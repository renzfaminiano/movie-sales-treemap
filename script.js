let movieUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'


let width = window.innerWidth*0.65
let height = window.innerHeight*0.6

let canvas = d3.select('#treemap')
let legend = d3.select('#legend')

let colors = {
    "Action": "#632626",
    "Drama": "#B5DEFF",
    "Adventure": "#CEE5D0",
    "Family": "#BCCEF8",
    "Animation": "#BFA2DB",
    "Comedy": "#FFF89A",
    "Biography": "#7882A4",
}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

let movieData


let drawCanvas = () => {

    canvas.attr("width", width)

}

let drawTreeMap = () => {

    let tooltip = d3.select('#tooltip')
                    .style('position','absolute')
                    

    let hierarchy = d3.hierarchy(movieData, (d)=>{
        return d['children']
    }).sum((d)=>{
        return d['value']
    }).sort((d1,d2)=>{
        return d2['value']-d1['value']
    })

    let createTreeMap = d3.treemap().size([width,height])

    createTreeMap(hierarchy)

    let leaves = hierarchy.leaves()

    let block = canvas.selectAll('g')
       .data(leaves)
       .enter()
       .append('g')
       .attr('transform',(d)=>{
            return 'translate(' + d['x0'] +','+ d['y0'] + ')'
       })

    block.append('rect')
         .attr('class','tile')
         
         .attr('fill', (d)=>{
            return colors[d['data']['category']]
         })
         .attr('data-name', (d)=>{return d['data']['name']})
         .attr('data-category', (d)=>{return d['data']['category']})
         .attr('data-value', (d)=>{return d['data']['value']})
         .attr('width', (d)=>{return d['x1']-d['x0']})
         .attr('height', (d)=>{return d['y1']-d['y0']})
         .on('mouseover', (event, d)=>{
            tooltip.transition()
                .style('visibility','visible')
                .style('left',(event.clientX+15)+'px')
                .style('top',(event.clientY-15)+'px')
                
            tooltip.text(d['data']['name'] + " - "+ formatter.format(d['data']['value']))
            tooltip.attr('data-value', d['data']['value'])
        })
       .on('mouseout', ()=>{
            tooltip.transition()
                .style('visibility','hidden')
        })
         

    block.append('text')
         .text((d)=>{return d['data']['name']})
         .attr('x','5')
         .attr('y','15')
         
}

let drawLegend = () => {

    legend.attr("width", width)
    
    legend.selectAll('rect')
          .data(Object.keys(colors))
          .enter()
          .append('rect')
          .attr('class','legend-item')
          .attr('width','25px')
          .attr('height','25px')
          .attr('fill',(d)=>{return colors[d]})
          .attr('x', (d,i)=>{return 25 + i*100})
          .attr('y',5)
          

    legend.selectAll('text')
         .data(Object.keys(colors))
         .enter()
         .append('text')
         .text((d)=>{return d})
         .attr('x',(d,i)=>{return 25 + i*100+35})
         .attr('y','20')
}

d3.json(movieUrl).then(
    (data, error) => {
        if(error){
            console.log(error)
        } else {
            movieData = data
            console.log(movieData)
            drawCanvas()
            drawTreeMap()
            drawLegend()
        }
    }
)

window.onresize = function(){ location.reload() }