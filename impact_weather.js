// impactful weather dashboard code

var selectedList = []

var checkboxChange = function(value){

    if(selectedList.includes(value) == true){
        var filteredList = selectedList.filter(function (city) {
            return city !== value;
        });
        selectedList = filteredList
    } else {
        selectedList.push(value)
    }

    updateChart(selectedList)
}

// global variables
var parseDate = d3.timeParse("%Y-%m-%d")
var precip
var tempHigh
var tempLow
var citydata
var precipG
var highG
var lowG
var colorScale
var lineInterpolate
var defaultPrecipNest
var cities = ['CLT', 'CQT', 'IND', 'JAX', 'MDW', 'PHL', 'PHX']
var line

// load data and compute graphs

d3.csv('impact_weather.csv').then(function(dataset) {

    // variables
    for (d of dataset){
        d.date = parseDate(d.date);
    }
    
    citydata = dataset

    var dateDomain = [new Date(2014, 6, 1), new Date(2015, 5, 30)];

    precip = citydata.map(x => x['actual_precipitation']);
    var precipDomain = [Math.min(...precip), Math.max(...precip)];
    
    tempHigh = citydata.map(x => x['record_max_temp']);
    tempLow = citydata.map(x => x['record_min_temp']);
    var tempHighDomain = [Math.min(...tempHigh), Math.max(...tempHigh)];
    var tempLowDomain = [Math.min(...tempLow), Math.max(...tempLow)];

    // scales for top graph

    var xScaleFirst = d3.scaleTime()
        .domain(dateDomain)
        .range([0, 1130]);

    var yScaleFirst = d3.scaleLinear()
        .domain(precipDomain)
        .range([300, 0]);

    // create grids for top graph

    var xGridFirst = d3.axisTop(xScaleFirst)
        .tickSize(-300, 0, 0)
        .tickFormat('');

    var yGridFirst = d3.axisLeft(yScaleFirst)
        .tickSize(-1130, 0, 0)
        .tickFormat('');

    // create scales for bottom grids

    var xScaleSecond = d3.scaleTime()
        .domain(dateDomain)
        .range([0, 660]);

    var yScaleSecondHigh = d3.scaleLinear()
        .domain(tempHighDomain)
        .range([280, 0]);

    var yScaleSecondLow = d3.scaleLinear()
        .domain(tempLowDomain)
        .range([280, 0]);

    // create grids for bottom two graphs

    var xGridSecond = d3.axisTop(xScaleSecond)
        .tickSize(-280, 0, 0)
        .tickFormat('');

    var yGridSecondHigh = d3.axisLeft(yScaleSecondHigh)
        .tickSize(-660, 0, 0)
        .tickFormat('');

    var yGridSecondLow = d3.axisLeft(yScaleSecondLow)
        .tickSize(-660, 0, 0)
        .tickFormat('');

    precipG = d3.select('g.precipitation');
    highG = d3.select('g.record-high');
    lowG = d3.select('g.record-low');

    // append grids for graphs

    precipG.append('g')
        .attr('class', 'x grid')
        .attr('transform','translate(' + [25, 0] + ')')
        .call(xGridFirst);

    precipG.append('g')
        .attr('class', 'y grid')
        .attr('transform','translate(' + [25, 0] + ')')
        .call(yGridFirst);

    highG.append('g')
        .attr('class', 'x grid')
        .attr('transform','translate(' + [25, 10] + ')')
        .call(xGridSecond);

    highG.append('g')
        .attr('class', 'y grid')
        .attr('transform','translate(' + [25, 10] + ')')
        .call(yGridSecondHigh);

    lowG.append('g')
        .attr('class', 'x grid')
        .attr('transform','translate(' + [25, 10] + ')')
        .call(xGridSecond);

    lowG.append('g')
        .attr('class', 'y grid')
        .attr('transform','translate(' + [25, 10] + ')')
        .call(yGridSecondLow);

    // axes for precip graph

    var xAxisFirst = d3.axisBottom(xScaleFirst);
        precipG.append('g')
            .attr('class', 'x axis')
            .attr('transform','translate(' + [25, 300] + ')')
            .call(xAxisFirst);

    var yAxisFirst = d3.axisLeft(yScaleFirst);
        precipG.append('g')
            .attr('class', 'y axis')
            .attr('transform','translate(' + [25, 0] + ')')
            .call(yAxisFirst);

    // reposition rectangles to fit in svgs

    d3.selectAll('.precipitation rect').attr('transform', function(f){
        return 'translate('+[25,0]+')'
    });

    d3.selectAll('.record-low rect').attr('transform', function(f){
        return 'translate('+[25,10]+')'
    });

    d3.selectAll('.record-high rect').attr('transform', function(f){
        return 'translate('+[25,10]+')'
    });

    // d3.selectAll('.fast-facts').attr('transform', function(f){
    //     return 'translate('+[10,10]+')'
    // });

    // axes for bottom two graphs

    var xAxisSecondHigh = d3.axisBottom(xScaleSecond);
        highG.append('g')
            .attr('class', 'x axis')
            .attr('transform','translate(' + [25, 290] + ')')
            .call(xAxisSecondHigh);

    var yAxisSecondHigh = d3.axisLeft(yScaleSecondHigh);
        highG.append('g')
            .attr('class', 'y axis')
            .attr('transform','translate(' + [25, 10] + ')')
            .call(yAxisSecondHigh);

    var xAxisSecondLow = d3.axisBottom(xScaleSecond);
        lowG.append('g')
            .attr('class', 'x axis')
            .attr('transform','translate(' + [25, 290] + ')')
            .call(xAxisSecondLow);

    var yAxisSecondLow = d3.axisLeft(yScaleSecondLow);
        lowG.append('g')
            .attr('class', 'y axis')
            .attr('transform','translate(' + [25, 10] + ')')
            .call(yAxisSecondLow);

    // others

    // var line = d3.line()
    //     .x(function(d) { return xScaleFirst(d['date']); })
    //     .y(function(d) { return yScaleFirst(d['actual_precipitation']); });

    line = d3.line()
        .x(function(d) { return xScaleFirst(d.date); })
        .y(function(d) { return yScaleFirst(d.actual_precipitation); });

    
    var precipData = citydata.map(el => {
        return {
            city_code: el.city_code,
            date: el.date,
            actual_precipitation: el.actual_precipitation
            }  
    })

    defaultPrecipNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(precipData);

    colorScale = d3.scaleOrdinal(defaultPrecipNest.map((x) => x['key']), d3.schemeCategory10);

    // var lines = precipG.selectAll('lines')
    //     .data(defaultPrecipNest)
    //     .enter()
    //     .append('g')

    // lines.append('path')
    //         .attr('class', 'line-plot')
    //         .attr("d", function(d) { return line(d.values); })
    //         .style('stroke', function(d) {return colorScale(d.key)})
    //         .style("stroke-width", "2");

});

function updateChart(selectedList){

    // filter the data based on the selections made by user
    var filteredDataset

    var map1 = selectedList.map((city) => citydata.filter((row) => row.city_code == city));
    
    if (map1.length == 0){
        filteredDataset = []
    } else if (map1.length == 1){
        filteredDataset = map1[0]
    } else if (map1.length == 2){
        filteredDataset = map1[0].concat(map1[1])
    } else if (map1.length == 3){
        filteredDataset = map1[0].concat(map1[1], map1[2])
    } else if (map1.length == 4){
        filteredDataset = map1[0].concat(map1[1], map1[2], map1[3])
    } else if (map1.length == 5){
        filteredDataset = map1[0].concat(map1[1], map1[2], map1[3], map1[4])
    } else if (map1.length == 6){
        filteredDataset = map1[0].concat(map1[1], map1[2], map1[3], map1[4], map1[5])
    } else {
        filteredDataset = citydata
    };

    var filteredPrecipData = filteredDataset.map(el => {
        return {
            city_code: el.city_code,
            date: el.date,
            actual_precipitation: el.actual_precipitation
            }  
    })

    var filteredPrecipNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(filteredPrecipData);

    var lines = precipG.selectAll('.line')
        .data(filteredPrecipNest, function(d){
            return d.key
        })

    var linesG = lines
        .enter()
        .append('g')
        .attr('class', 'line')

    linesG.append('path')
            .attr('class', 'line-plot')
            .attr("d", function(d) { return line(d.values); })
            .style('stroke', function(d) {return colorScale(d.key)})
            .style("stroke-width", "2");

    lines.exit().remove()
}
