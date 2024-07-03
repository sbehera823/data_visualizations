// **** Functions to call for scaled values ****

function scaleYear(year) {
    return yearScale(year);
}

function scaleHomeruns(homeruns) {
    return hrScale(homeruns);
}

// **** Code for creating scales, axes, and labels ****

var yearScale = d3.scaleLinear()
    .domain([1870, 2017]).range([60, 700]);

var hrScale = d3.scaleLinear()
    .domain([0, 75]).range([340, 20]);

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(d => d));

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(hrScale));

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", 650)
    .attr("y", 380)
    .text("MLB Season");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 20)
    .attr("x", -20)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Home Runs (HR)");

svg.append("text")
    .attr("class", "graph title")
    .attr("text-anchor", "middle")
    .attr("x", 700 / 2)
    .attr("y", 20)
    .style("font-size", "24px")
    .text("Top 10 HR Leaders per MLB Season");

d3.csv("baseball_hr_leaders.csv").then(function(data) {
    var player = svg.selectAll(".player")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "player")
        .attr("transform", d => `translate(${scaleYear(d.year)},${scaleHomeruns(d.homeruns)})`);

        player.append("circle")
        .attr("r", 2)
        .style("fill", d => {
            if (d.rank <= 3) {
                return "#FFA500";  
            } else if (d.rank >= 9) {
                return "#808080"; 
            } else {
                return "#ADD8E6";  
            }
        })
        .style("opacity", 0.6);

        player.append("text")
        .text(d => d.name)  
        .attr("text-anchor", "middle")
        .attr("dy", "-5")  
        .style("font-size", "10px")
        .style("fill", "#333");  
});
