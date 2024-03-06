// impactful weather dashboard code

let selectedList = []

var checkboxChange = function(value){

    if(selectedList.includes(value) == true){
        let filteredList = selectedList.filter(function (city) {
            return city !== value;
        });
        selectedList = filteredList
    } else {
        selectedList.push(value)
    }

    updateChart(selectedList)
}

// load data and compute graphs

var citydata

d3.csv('impact_weather.csv').then(function(dataset) {

    citydata = dataset

    var dateDomain = [new Date(2014, 7, 1), new Date(2015, 6, 30)]

    var precip = citydata.map(x => x['actual_precipitation'])
    var precipDomain = [Math.min(...precip), Math.max(...precip)]
    
    var tempHigh = citydata.map(x => x['record_max_temp'])
    var tempLow = citydata.map(x => x['record_min_temp'])
    var tempHighDomain = [Math.min(...tempHigh), Math.max(...tempHigh)]
    var tempLowDomain = [Math.min(...tempLow), Math.max(...tempLow)]


    let xScaleFirst = d3.scaleTime()
        .domain(dateDomain)
        .range([0, 1130]);

    let yScaleFirst = d3.scaleLinear()
        .domain(precipDomain)
        .range([300, 0]);

    let xGridFirst = d3.axisTop(xScaleFirst)
        .tickSize(-300, 0, 0)
        .tickFormat('')

    let yGridFirst = d3.axisLeft(yScaleFirst)
        .tickSize(-1130, 0, 0)
        .tickFormat('')

    let xScaleSecond = d3.scaleTime()
        .domain(dateDomain)
        .range([0, 660]);

    let yScaleSecondHigh = d3.scaleLinear()
        .domain(tempHighDomain)
        .range([280, 0]);

    let yScaleSecondLow = d3.scaleLinear()
        .domain(tempLowDomain)
        .range([280, 0]);

    let xGridSecond = d3.axisTop(xScaleSecond)
        .tickSize(-280, 0, 0)
        .tickFormat('')

    let yGridSecondHigh = d3.axisLeft(yScaleSecondHigh)
        .tickSize(-660, 0, 0)
        .tickFormat('')

    let yGridSecondLow = d3.axisLeft(yScaleSecondLow)
        .tickSize(-660, 0, 0)
        .tickFormat('')

    let precipG = d3.select('.precipitation')
    let highG = d3.select('.record-high')
    let lowG = d3.select('.record-low')

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
        .attr('transform','translate(' + [25, 0] + ')')
        .call(xGridSecond);

    highG.append('g')
        .attr('class', 'y grid')
        .attr('transform','translate(' + [25, 0] + ')')
        .call(yGridSecondHigh);

    lowG.append('g')
        .attr('class', 'x grid')
        .attr('transform','translate(' + [25, 0] + ')')
        .call(xGridSecond);

    lowG.append('g')
        .attr('class', 'y grid')
        .attr('transform','translate(' + [25, 0] + ')')
        .call(yGridSecondLow);

    let xAxisFirst = d3.axisBottom(xScaleFirst);
        precipG.append('g')
            .attr('class', 'x axis')
            .attr('transform','translate(' + [25, 300] + ')')
            .call(xAxisFirst);

    let yAxisFirst = d3.axisLeft(yScaleFirst);
        precipG.append('g')
            .attr('class', 'y axis')
            .attr('transform','translate(' + [25, 0] + ')')
            .call(yAxisFirst);

    d3.selectAll('rect').attr('transform', function(f){
        return 'translate('+[25,0]+')'
    })

    let xAxisSecondHigh = d3.axisBottom(xScaleSecond);
        highG.append('g')
            .attr('class', 'x axis')
            .attr('transform','translate(' + [25, 280] + ')')
            .call(xAxisSecondHigh);

    let yAxisSecondHigh = d3.axisLeft(yScaleSecondHigh);
        highG.append('g')
            .attr('class', 'y axis')
            .attr('transform','translate(' + [25, -20] + ')')
            .call(yAxisSecondHigh);

    let xAxisSecondLow = d3.axisBottom(xScaleSecond);
        lowG.append('g')
            .attr('class', 'x axis')
            .attr('transform','translate(' + [25, 280] + ')')
            .call(xAxisSecondLow);

    let yAxisSecondLow = d3.axisLeft(yScaleSecondLow);
        lowG.append('g')
            .attr('class', 'y axis')
            .attr('transform','translate(' + [25, -20] + ')')
            .call(yAxisSecondLow);

});

function updateChart(selectedList){

    // filter the data based on the selections made by user
    var filteredDataset

    var map1 = selectedList.map((city) => citydata.filter((row) => row.city_code == city))
    
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
    }

    // create nest of each city in dataset
    // var cityNest = d3.nest()
    //     .key(function(c) {
    //         return c.city_code;
    //     })
    //     .entries(filteredDataset)

    // console.log(cityNest)
}
