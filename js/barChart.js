console.log("Hello")
var createBarChart = (function(){
    // Setup svg using Bostock's margin convention
//(function(){
    var margin = {top: 40, right: 260, bottom: 55, left: 60};

    var width = 1060 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var svg = d3.select(".content")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var Scales={};
    var x;
    var y;
    var colors;
    var tooltip;

    d3.csv("/data/movietable.csv", function(data){

    // Transpose the data into layers
    dataset = d3.layout.stack()(["1", "2", "3", "4","5"].map(function(rating) {
    return data.map(function(d) {
      return {x: d.Decade, y: +d[rating]};
    });
    }));

    createScales(dataset);
    createAxes(dataset);

    groups = createGroups(dataset);
    createRect(groups);
    drawLegend();
    tooltipDisplay();
    });



    // Prep the tooltip bits, initial display is hidden
    var tooltipDisplay = function(){

     tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
    tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

    };

    var createScales = function(dataset){
        // Set x, y and colors
          Scales.x= d3.scale.ordinal()
          .domain(dataset[0].map(function(d) { return d.x; }))
          .rangeRoundBands([10, width-10], 0.02);

          Scales.y=d3.scale.linear()
          .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
          .range([height, 0]);

          Scales.colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574","#b4d07e"];

    };

    var createAxes = function(dataset){ //Create the axes for the chart
      x = Scales.x;
      y = Scales.y;
      colors = Scales.colors;

      // Define and draw axes
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

        .ticks(7)
        .tickSize(-width, 1, 0)
        .tickFormat( function(d) { return d } );

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    }

    var createGroups = function(dataset){
    // Create groups for each series, rects for each segment 
    var groups = svg.selectAll("g.cost")
      .data(dataset)
      .enter().append("g")
      .attr("class", "cost")
      .style("fill", function(d, i) { return Scales.colors[i]; });

      return groups;
    };

    var createRect = function(groups){ //Draw rectangular bars showing each bin
    var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });
    };

    var drawLegend = function(){ //Function to create color legend
      var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
       
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {return Scales.colors.slice().reverse()[i];});
       
      legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) { 
          switch (i) {
            case 0: return "1";
            case 1: return "2";
            case 2: return "3";
            case 3: return "4";
            case 4: return "5";
          }
        });
      };
})();
