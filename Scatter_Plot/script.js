const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const req = new XMLHttpRequest();

let values=[]
let xScale
let yScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

let tooltip = d3.select("#tooltip")

let drawScale = ()=>{
    svg.attr("width",width)
       .attr('height',height)
}

let generateScales = () => {
    
    xScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item['Year']
                        }) - 1 , d3.max(values, (item) => {
                            return item['Year']
                        }) + 1])
                        .range([padding, width-padding])

    yScale = d3.scaleTime()
                        .domain([d3.min(values, (item) => {
                            return new Date(item['Seconds'] * 1000)
                        }), d3.max(values, (item) => {
                            return new Date(item['Seconds'] * 1000)
                        })])
                        .range([padding, height-padding])

}

let drawPoints=()=>{
    svg.selectAll('circle')
       .data(values)
       .enter()
       .append('circle')
       .attr('class','dot')
       .attr('r','5')
       .attr('data-xvalue',(item)=>{
        return item['Year']
       })
       .attr('data-yvalue',(item)=>{
        let time=new Date(item['Seconds'] * 1000)
        return d3.utcFormat(time,"%M:%S")
       })
       .attr('cx',(item)=>{
        return xScale(item["Year"])
       })
       .attr('cy',(item)=>{
        return yScale(new Date(item["Seconds"] * 1000))
       })
       .attr('fill', (item) => {
        if(item['URL'] === ""){
            return 'lightgreen'
        }else{
            return 'orange'
        }
        })
        .on('mouseover',(item,idx) => {
            tooltip.transition()
                   .style('visibility','visible')

            tooltip.attr("data-year",idx['Year'])
            if(idx['Doping'] != ""){
                tooltip.text(
                    idx["Year"]+" - "+idx["Name"]+" - "+idx['Time']+" - "+idx['Doping']
                )
            }else{
                tooltip.text(
                    idx["Year"]+" - "+idx["Name"]+" - "+idx['Time']+" - No Allegation"
                )
            }

        })
        .on('mouseout',()=>{
            tooltip.transition()
                   .style('visibility','hidden')
        })

}


let generateAxis = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
                

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.utcFormat("%M:%S"));

            svg.append('g')
                .call(xAxis)
                .attr('id', 'x-axis')
                .attr('transform', 'translate(0, ' + (height-padding) +')')
        
            svg.append('g')
                .call(yAxis)
                .attr('id', 'y-axis')
                .attr('transform','translate(' + padding + ', 0)')
}

req.open("GET",url,true)
req.onload=()=>{
    values=JSON.parse(req.responseText)
    console.log(values)
    drawScale()
    generateScales()
    drawPoints()
    generateAxis()

}
req.send()