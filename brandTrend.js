// set the dimensions and margins of the SVG
var margin = {top: 200, right: 30, bottom: 50, left: 60},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("my_dataviz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// set the dimensions and margins of the graph(framework)
var margin = {top: 30, right: 30, bottom: 100, left: 80},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//*********************************************
// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .style("text-anchor", "middle")
  .style("font", "14px Arial")
   
// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")
  .style("text-anchor", "left")
  .style("font", "14px times")
  .style("font-weight","normal")

// A function that create / update the plot for a given variable:
function update(selectedVar) {

// Parse the Data
d3.csv('/Data/brand_Trend.csv').then(function(data){
  console.log(data);
// X axis
  x.domain(data.map(function(d) { return d.group; }))
  xAxis.transition().duration(1000).call(d3.axisBottom(x))

// Add Y axis
  y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

// variable u: map data to existing bars
  var u = svg.selectAll("rect")
    .data(data)
      
//*********************************************     
// update bars
  u
  .enter()
  .append("rect")
  .merge(u)
  .transition()
  .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { return y(d[selectedVar]); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d[selectedVar]); })
      .style("stroke", "blue")
      .attr("fill", "blue")

// clear the value interactively 
d3.selectAll("text.value").remove();      

//Create variable
let v = svg.selectAll("div")
  .data(data)

  v
  .enter()
  .append('text')
  .merge(v)
  .transition()
  .duration(1000)
  .attr("class", "value")
  .attr("text-anchor", "left")
  .attr("x", function(d) { return x(d.group)+10; })
  .attr("y", function(d) { return y(d[selectedVar])-10; })
  .text(function(d) {return d[selectedVar]})
  .style("font", "12px Arial")
  .attr('text-anchor', 'left')
  .attr("fill", "oraneg")
 
// add the bar lable "Product" and "Oct 2018 - Jan 2020"
  svg.append("text")
   .attr("class", "x label")
    .attr("y", height +60)
    .attr("x", width - 360)
    .style("font", "24px times")
    .attr("text-anchor", "top")
    .text("Product Summary");
  svg.append("text")
    .attr("y", height +80)
    .attr("x", width - 330)
    .style("font", "14px Arial")
    .text("(Oct 2018 - Jan 2020)");
  svg.append()  
  .attr("class", "bar")
  .text(function(d) { return selectedVar; }); 
  })

}
// Initialize plot
update('var1')
