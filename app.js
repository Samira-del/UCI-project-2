// Set up our chart
//= ================================
let svgWidth = 960;
let svgHeight = 500;
let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

var columns = ['brand','category','style','sku', 'name', 'upc', 'item_cost', 'selling_price', 'order_id', 'order_date', 'site_name', 'qty_sold', 'order_amount']

// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
let svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Define the dropdown values
// =================================
var dropbox_value = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Import data from the smurfData.csv file
// =================================
d3.csv("/Data/WPS_Orders.csv").then(function(orderData) {
    
    orderData.forEach(function(d) {
        d.order_amount = +d.order_amount;        
      });
    console.log("Data", orderData);

    // Create Scales
    // ============================================
    let xLinearScale = d3.scaleBand()
        .domain(orderData.map(d => d.site_name))
        .range([0, width])
        .padding(0.4);
    console.log('xLineScale', xLinearScale.domain());
    
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(orderData, d => d.order_amount) + 90])
        .range([height, 0]);
    console.log('yLineScale', yLinearScale.domain());

    // Create Axes
    // =============================================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes to the chartGroup - ADD STYLING
    // ==============================================
    // Add bottomAxis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Module");

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
        .attr('stroke', 'black')
        .call(leftAxis)
        .append("text")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Average");
  
    // add the Y gridlines
    chartGroup.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft()
          .scale(yLinearScale)
          .tickSize(-width, 0, 0)
          .tickFormat(''));

    chartGroup.append('text')
      .attr("y", -50)
      .attr("x", -(height / 2))
      .attr("font-family", "Saira")
      .attr("font-size", '20px')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Total Sales (@1000)');

    chartGroup.append('text')
        .attr('x', width / 2)
        .attr('y', -5)
        .attr("font-family", "Saira")
        .attr("font-size", '20px')
        .attr('text-anchor', 'middle')
        .text('Total Sales by Marketplace');
    
    chartGroup.append('text')
      .attr('x', width / 2)
      .attr('y', +height + 50)
      .attr("font-family", "Saira")
      .attr("font-size", '20px')
      .attr('text-anchor', 'middle')
      .text('Marketplace');
    
    // Show all data
    // ===================================
    barsGroup = chartGroup.append('g')
        .selectAll("rect")
        .data(orderData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xLinearScale(d.site_name))
        .attr("y", d => yLinearScale(d.order_amount))
        .attr("width", xLinearScale.bandwidth())
        .attr('stroke', 'blue')
        .attr('fill', 'blue')
        .attr("height", function(d) { return height - yLinearScale(d.order_amount)});
    
    // Initialize Tooltip
    let toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([0, 80])
    .html(function(data){
        return `${(data.site_name)}</br>${data.order_amount}`
    });

    // Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    barsGroup.on('mouseover', function(data){
      toolTip.show(data, this)
    });

    // Create "mouseout" event listener to hide tooltip
    barsGroup.on('mouseout', function(data){
      toolTip.hide(data);
    });
    

    // Handler for dropdown value change
    // ===================================
    var dropdownChange = function() {
      newvalue = d3.select(this).property('value');
      var newData = orderData.filter(function(d) { return d.month  == newvalue;})
      cleareBars();
      clearTable();
      updateBars(newData);
      tabulate(newData,columns)
    };

    var dropdown = d3.select("body")
        .insert("select", "svg")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
      .data(dropbox_value)
      .enter().append("option")
      .attr("value", function (d) { return d; })
      .text(function (d) {
          return d[0].toUpperCase() + d.slice(1,d.length);
        });
           

    // Craete Bar Chart   
    // ===================================
    var updateBars = function(newdata) {
      // append Bar Chart
      var barGroup = chartGroup.append('g')
        .selectAll("rect")
        .data(newdata)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xLinearScale(d.site_name))
        .attr("y", d => yLinearScale(d.order_amount))
        .attr("width", xLinearScale.bandwidth())
        .attr('stroke', 'blue')
        .attr('fill', 'blue')
        .attr("height", function(d) { return height - yLinearScale(d.order_amount)})
      
      // Initialize Tooltip
      let toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([0, 80])
        .html(function(data){
            return `${(data.site_name)}</br>${data.order_amount}`
      });

      // Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Create "mouseover" event listener to display tooltip
      barGroup.on('mouseover', function(data){
        toolTip.show(data, this)
      });

      // Create "mouseout" event listener to hide tooltip
      barGroup.on('mouseout', function(data){
        toolTip.hide(data);
      });
    };

    // Create Table
    // ===================================
    var tabulate = function (data,columns) {
      var table = d3.select('#csv-table')
      var thead = table.append('thead');
      var tbody = table.append('tbody');
      
      thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (d) { return d });
    
      var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
    
      var cells = rows.selectAll('td')
          .data(function(row) {
            return columns.map(function (column) {
              return { column: column, value: row[column] };
            });
          })
          .enter()
          .append('td')
          .text(function (d) { return d.value });
    
      return table;
    }
    tabulate(orderData,columns);
    // Remove old table and old bars
    // ===============================
    var clearTable = function(){
      d3.select("#csv-table")
        .html('');
    }
    
    var cleareBars = function(){
      d3.selectAll("rect")
        .remove()
        .exit();
    }
});

