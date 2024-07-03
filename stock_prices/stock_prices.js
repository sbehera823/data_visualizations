var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');


var padding = {t: 20, r: 20, b: 60, l: 60};

trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;


svg.selectAll('.background')
    .data(['A', 'B', 'C', 'C']) 
    .enter()
    .append('rect')
    .attr('class', 'background')
    .attr('width', trellisWidth) 
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {

        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

var parseDate = d3.timeParse('%b %Y');
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];


d3.csv('stock_prices.csv').then(function(dataset) {

    dataset.forEach(function(d) {
        d.date = parseDate(d.date); 

    });

    var nestedData = d3.group(dataset, function(d) { return d.company; });

    var colorScale = d3.scaleOrdinal()
    .domain(Array.from(nestedData.keys()))
    .range(d3.schemeDark2); 

    var xScale = d3.scaleTime()
    .domain(dateDomain)
    .range([0, trellisWidth]); 

    var yScale = d3.scaleLinear()
        .domain(priceDomain)
        .range([trellisHeight, 0]); 

    var line = d3.line()
        .x(function(d) { return xScale(d.date); }) 
        .y(function(d) { return yScale(d.price); });  

    var trellis = svg.selectAll(".trellis")
        .data(nestedData) 
        .enter()
        .append("g") 
        .attr("class", "trellis")
        .attr('transform', function(d, i) {
            
            var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
    });    
    
    trellis.each(function(d) {
        var companyName = d[0]; 
        d3.select(this)
            .selectAll(".line-plot")
            .data([d[1]])
            .enter()
            .append("path")
            .attr("class", "line-plot")
            .attr("d", line)
            .style("stroke", function(d) { return colorScale(companyName); })
            .style("fill", "none");
    });

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    trellis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + trellisHeight + ")")
        .call(xAxis);

    trellis.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    trellis.append("text")
        .attr("class", "company-label")
        .attr("transform", function(d, i) {
            var tx = trellisWidth / 2; 
            var ty = trellisHeight / 2;
            return "translate(" + tx + "," + ty + ")";
        })
        .attr("text-anchor", "middle") 
        .style("fill", function(d) { return colorScale(d[0]); }) 
        .text(function(d) { return d[0]; });     
        
    trellis.append("text")
        .attr("class", "x axis-label")
        .attr("transform", function(d, i) {
            
            var tx = trellisWidth / 2;
            var ty = trellisHeight + 34; 
            return "translate(" + tx + "," + ty + ")";
        })
        .attr("text-anchor", "middle")
        .text("Date (by Month)"); 

    trellis.append("text")
        .attr("class", "y axis-label")
        .attr("transform", function(d, i) {
            
            var tx = -30; 
            var ty = trellisHeight / 2;
            return "translate(" + tx + "," + ty + ") rotate(-90)";
        })
        .attr("text-anchor", "middle")
        .text("Stock Price (USD)"); 


    var xGrid = d3.axisTop(xScale)
        .tickSize(-trellisHeight) 
        .tickFormat(""); 
    
    var yGrid = d3.axisLeft(yScale)
        .tickSize(-trellisWidth) 
        .tickFormat("");   

    trellis.append("g")
        .attr("class", "x grid")
        .call(xGrid)
        .selectAll(".domain").style("stroke", "none");
    
    trellis.append("g")
        .attr("class", "y grid")
        .call(yGrid)
        .selectAll(".domain").style("stroke", "none");      

});
