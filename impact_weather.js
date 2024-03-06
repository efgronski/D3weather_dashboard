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
var precip
var tempHigh
var tempLow
var citydata
var precipG
var highG
var lowG
var colorScale
var lineInterpolate
var defaultCityNest
var cities = ['CLT', 'CQT', 'IND', 'JAX', 'MDW', 'PHL', 'PHX']

// load data and compute graphs

d3.csv('impact_weather.csv').then(function(dataset) {

    // variables
    
    citydata = dataset

    var dateDomain = [new Date(2014, 7, 1), new Date(2015, 6, 30)];

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

    var line = d3.line()
        .x(function(d) { return xScaleFirst(d['date']); })
        .y(function(d) { return yScaleFirst(d['actual_precipitation']); });

    defaultCityNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(citydata);

    colorScale = d3.scaleOrdinal(defaultCityNest.map((x) => x['key']), d3.schemeCategory10);

    d3.select('.precipitationG').append('g')
        .selectAll('line')
        .data(defaultCityNest)
        .enter()
        .append('g')
        .attr('class', 'lines')

    precipG.selectAll('.lines')
        .data(function(d){
            console.log(d)
            return [d.values];
        })
        .enter()
        .append('path')
            .attr('class', 'line-plot')
            .attr('d', line)
            .style('stroke', function(d) {return colorScale(cities[0])})
            .style("stroke-width", "2");
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

    // create nest of each city in dataset
    var cityNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(filteredDataset);

    // precipG.selectAll('path')
    //     .data(defaultCityNest)
    //     .enter()
    //     .append('path')
    //         .attr('class', 'line-plot')
    //         .style('stroke', function(d) {return colorScale(cityNest[0].city_code)  })
    //         .attr('d', lineInterpolate);

}
