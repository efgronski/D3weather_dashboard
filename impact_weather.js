// impactful weather dashboard code

var selectedList = [] // list of selected cities

var checkboxChange = function(value){

    // handle checkbox being clicked
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
var parseDate = d3.timeParse("%Y-%m-%d") // handle date type
var precip // filter data for each graph
var tempHigh
var tempLow
var citydata // all data for city filtering
var precipG // groups for each graph
var highG
var lowG
var colorScale // add color scale
var defaultPrecipNest // this is default data for testing
var cities = ['CLT', 'CQT', 'IND', 'JAX', 'MDW', 'PHL', 'PHX'] // list of all cities
var precipLineInterpolate // create lines for each graph
var highLineInterpolate
var lowLineInterpolate

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

    // reposition graphs in svgs to fit title
    
    precipG.attr('transform', function(f){
        return 'translate('+[20,40]+')'
    });

    lowG.attr('transform', function(f){
        return 'translate('+[20,30]+')'
    });

    highG.attr('transform', function(f){
        return 'translate('+[20,30]+')'
    });

    d3.selectAll('.graph-title').attr('transform', function(f){
        return 'translate('+[50,18]+')'
    });

    d3.selectAll('.graph-subtitle').attr('transform', function(f){
        return 'translate('+[50,35]+')'
    });
    
    d3.selectAll('.x-axis-label').attr('transform', function(f){
        return 'translate('+[320,355]+')'
    });

    d3.select('.x-axis-label-p').attr('transform', function(f){
        return 'translate('+[560,375]+')'
    });

    d3.selectAll('.y-axis-label').attr('transform', function(f){
        return 'translate('+[18,227]+')rotate(270)'
    });

    d3.select('.y-axis-label-p').attr('transform', function(f){
        return 'translate('+[18,237]+')rotate(270)'
    });

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

    // line interpolate functions

    precipLineInterpolate = d3.line()
        .x(function(d) { return xScaleFirst(d.date); })
        .y(function(d) { return yScaleFirst(d.actual_precipitation); });

    highLineInterpolate = d3.line()
        .x(function(d) { return xScaleSecond(d.date); })
        .y(function(d) { return yScaleSecondHigh(d.record_max_temp); });

    lowLineInterpolate = d3.line()
        .x(function(d) { return xScaleSecond(d.date); })
        .y(function(d) { return yScaleSecondLow(d.record_min_temp); });

    // default data for testing

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

    // color scale

    colorScale = d3.scaleOrdinal(defaultPrecipNest.map((x) => x['key']), d3.schemeCategory10);

    // start screen when visualization is open
    // all lines will disappear when use selects a city in checkbox
    
    updateChart(cities)

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

    // precipitation line graph

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

    var precipLines = precipG.selectAll('.precip-line')
        .data(filteredPrecipNest, function(d){
            return d.key
        })

    var precipLinesG = precipLines
        .enter()
        .append('g')
        .attr('class', 'precip-line')

    precipLinesG.append('path')
            .attr('class', 'line-plot')
            .attr("d", function(d) { return precipLineInterpolate(d.values); })
            .attr('transform', 'translate(' + [25, 0] + ')')
            .style('stroke', function(d) {return colorScale(d.key)})
            .style("stroke-width", "2");

    precipLines.exit().remove()

    // record high line graph

    var filteredHighData = filteredDataset.map(el => {
        return {
            city_code: el.city_code,
            date: el.date,
            record_max_temp: el.record_max_temp
            }  
    })

    var filteredHighNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(filteredHighData);

    var highLines = highG.selectAll('.high-line')
        .data(filteredHighNest, function(d){
            return d.key
        })

    var highLinesG = highLines
        .enter()
        .append('g')
        .attr('class', 'high-line')

    highLinesG.append('path')
        .attr('class', 'line-plot')
        .attr("d", function(d) { return highLineInterpolate(d.values); })
        .attr('transform', 'translate(' + [25, 11] + ')')
        .style('stroke', function(d) {return colorScale(d.key)})
        .style("stroke-width", "2");

    highLines.exit().remove()

    // record LOW line graph

    var filteredLowData = filteredDataset.map(el => {
        return {
            city_code: el.city_code,
            date: el.date,
            record_min_temp: el.record_min_temp
            }  
    })

    var filteredLowNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(filteredLowData);

    var lowLines = lowG.selectAll('.low-line')
        .data(filteredLowNest, function(d){
            return d.key
        })

    var lowLinesG = lowLines
        .enter()
        .append('g')
        .attr('class', 'low-line')

    lowLinesG.append('path')
        .attr('class', 'line-plot')
        .attr("d", function(d) { return lowLineInterpolate(d.values); })
        .attr('transform', 'translate(' + [25, 11] + ')')
        .style('stroke', function(d) {return colorScale(d.key)})
        .style("stroke-width", "2");

    lowLines.exit().remove()
    
}
