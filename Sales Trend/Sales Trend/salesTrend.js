// Define SVG area dimensions
let svgWidth = 700;
let svgHeight = 600;
// Define the chart's margins as an object
let margin = {
  top: 200,
  right: 30,
  bottom: 120,
  left: 100
};
// Define dimensions of the chart area
let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;
// Select body, append SVG area to it, and set its dimensions
let svg = d3.select('body')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
// Append a group area, then set its margins
let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//*********************************************//
// Configure a parseTime function which will return a new Date object from a string
 parseTime= d3.timeParse("%d-%b-%y")
console.log(`result: , ${parseTime}`);
// Load csv datd
d3.csv('/Data/sales_Trend.csv').then(function(orderData){
  console.log(orderData);
// cast the data from the csv as numbers
  orderData.forEach(data => {
    data.date = parseTime(data.month_year);
    data.orderTotal = +data.order_total;
     console.log(data.month_year);
})

// Create a scale for your independent (x) coordinates
  let xScale = d3.scaleTime()
    .domain(d3.extent(orderData, data => data.date))
    .range([0, chartWidth]);
    console.log("X line",xScale.domain());
    

// Create a scale for your dependent (y) coordinates
  let yScale = d3.scaleLinear()
    .domain([0,160000])
    .range([chartHeight, 7]);
   console.log("Y line",yScale.domain());
  
// These will be used to create the chart's axes
  let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%m-%Y"));
  let yAxis = d3.axisLeft(yScale);
  
// create a line generator function and store as a variable
  let createLine = d3.line()
    .x(data => xScale(data.date))
    .y(data => yScale(data.orderTotal));

//==>Create the circle and tooltips<==//   
//==>Create the  
// append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(orderData)
    .enter()
    .append("circle")
    .attr("cx", data => xScale(data.date))
    .attr("cy", data => yScale(data.orderTotal))
    .attr("r", "8")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "black");
// date formatter to display dates nicely
  var dateFormatter = d3.timeFormat("%m-%Y");        
// Step 1: Append tooltip div
  var toolTip = d3.select("body")
    .append("div")
    .classed("tooltip", true);  

// Step 2: Create "mouseover" event listener to display tooltip
circlesGroup.on("mouseover", function(data) {
toolTip.style("display", "block")
    .html(
      `<strong>date:${dateFormatter(data.date)}<strong><hr> sales:${data.orderTotal}`)
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY + "px");
})

// Step 3: Create "mouseout" event listener to hide tooltip
  .on("mouseout", function() {
    toolTip.style("display", "none");
  });
//******************************************
//===<Create the X&Y AXIS and style them>===
// Append an SVG path and plot its points using the line function, give the path a class of line
  //Will show the X&Y Axis
chartGroup.append('path')
 .attr('d', createLine(orderData))
 .classed('line', true)
 .attr('stroke', 'black')

// Append an SVG group element to the SVG area, create the left axis inside of it, and give it a class of "axis"
 //Style the xAxis
chartGroup.append('g')
 .classed('axis', true)
.style("font", "14px times")
 .style("font-weight","normal")
 .call(yAxis);
// Append an SVG group element to the SVG area, create the bottom axis inside of it
 //Style the yAxis
chartGroup.append('g')
 .classed('axis', true)
 .attr('transform', `translate(0, ${chartHeight})`)
 .style("font", "14px times")
 .style("font-weight","normal")
 .call(xAxis);

// add the bar lable "Monthly Sales Trend"
chartGroup.append('text')
  .attr("font-family", "Saira")
  .attr("y",chartHeight+60)
  .attr("x",chartWidth -350)
  .style("font", "24px times")
  .attr('text-anchor', 'bottom')
  .text('Monthly Sales Trend');
chartGroup.append("text")
  .attr("y",chartHeight -350)
  .attr("x",chartWidth - 690)
  .attr('transform', 'rotate(-90)')
  .style("font", "14px times")
  .text("Sales($)");
}).catch(function(error) {
  console.log(error);
});
    
    
    