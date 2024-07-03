var letters;
var widthScale;


// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}

// Recall that when data is loaded into memory, numbers are loaded as Strings
// This function converts numbers into Strings during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// A map with arrays for each category of letter sets
var lettersMap = {
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split(''),
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
};

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    letters = dataset;

    // **** Your JavaScript code goes here ****
    var maxFrequency = d3.max(letters, function(d) { return d.frequency; });
    widthScale = d3.scaleLinear()
        .domain([0, maxFrequency])
        .range([0, chartWidth]);

    // Update the chart for all letters to initialize
    updateChart('all-letters');
});


function updateChart(filterKey, cutoff = 0) {
    cutoff = cutoff/100;
    var filteredLetters = letters.filter(function(d){
        return (lettersMap[filterKey].indexOf(d.letter) >= 0) && (d.frequency >= cutoff);
    });

    var bars = chartG.selectAll('.bar').data(filteredLetters, function(d) { return d.letter; });

    bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', function(d, i) { return i * barBand; })
        .attr('width', function(d) { return widthScale(d.frequency); })
        .attr('height', barHeight)
        .attr('fill', 'black');

    bars.attr('x', 0)
        .attr('y', function(d, i) { return i * barBand; })
        .attr('width', function(d) { return widthScale(d.frequency); })
        .attr('height', barHeight);

    bars.exit().remove();

    var labels = chartG.selectAll('.label').data(filteredLetters, function(d) { return d.letter; });

    labels.enter().append('text')
        .attr('class', 'label')
        .attr('x', -5)
        .attr('y', function(d, i) { return i * barBand + barHeight / 2; })
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .text(function(d) { return d.letter; });

    labels.attr('x', -5)
        .attr('y', function(d, i) { return i * barBand + barHeight / 2; })
        .text(function(d) { return d.letter; });

    labels.exit().remove();

    var maxFrequency = d3.max(letters, function(d) { return d.frequency; });
    var tickValues = d3.range(0, maxFrequency, 0.02); 
    var xAxisTop = d3.axisTop(widthScale).tickValues(tickValues).tickFormat(d3.format(".0%"));
    var xAxisBottom = d3.axisBottom(widthScale).tickValues(tickValues).tickFormat(d3.format(".0%"));

    chartG.selectAll('.x.axis.top').data([0]).enter().append("g")
        .attr("class", "x axis top")
        .merge(chartG.select('.x.axis.top'))
        .call(xAxisTop);


    if(chartG.select('.axis-label').empty()) {
        chartG.append("text")
            .attr("class", "axis-label") 
            .attr("x", chartWidth / 2) 
            .attr("y", -30) 
            .attr("text-anchor", "middle") 
            .text("Letter Frequency (%)");
        }    
    chartG.selectAll('.x.axis.bottom').data([0]).enter().append("g")
        .attr("class", "x axis bottom")
        .attr("transform", `translate(0,${chartHeight})`)
        .merge(chartG.select('.x.axis.bottom'))
        .call(xAxisBottom);
}

var main = document.getElementById('main');

d3.select(main)
    .append('p') 
    .append('button') 
    .style("border", "1px solid black") 
    .text('Filter Data') 
    .on('click', () => {
        var cutoffValue = document.getElementById('cutoff').value; // Fetches the value from the input field
    var select = d3.select('#categorySelect').node();
    var category = select.options[select.selectedIndex].value;
    updateChart(category, Number(cutoffValue));
    });


// Remember code outside of the data callback function will run before the data loads