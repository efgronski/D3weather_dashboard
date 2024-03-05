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
