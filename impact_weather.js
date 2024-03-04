// impactful weather dashboard code

// establish variables
var svg = d3.select('svg');

//layout sections of dashboard
svg.select('.title')
    .attr('transform', function(d, i) {
        return 'translate('+[20, 20]+')';
    })
    .attr('font-size', '40px');

svg.select('.select-country')
    .attr('transform', function(d, i) {
        return 'translate('+[20, 20]+')';
    });

svg.select('.percipitation')
    .attr('transform', function(d, i) {
        return 'translate('+[230, 20]+')';
    });

svg.select('.record-high')
    .attr('transform', function(d, i) {
        return 'translate('+[20, 360]+')';
    });

svg.select('.record-low')
    .attr('transform', function(d, i) {
        return 'translate('+[700, 360]+')';
    });

svg.select('.fast-facts')
    .attr('transform', function(d, i) {
        return 'translate('+[20, 660]+')';
    });

d3.selectAll('rect')
    .attr('fill', '#d3d3d3')

svg.select('.select-title')
    .attr('transform', function(d, i) {
        return 'translate('+[5, 20]+')';
    })
    .attr('font-size', '20px');

// load data and compute graphs

d3.csv('impact_weather.csv').then(function(dataset) {

    // create nest of each city in dataset
    var cityNest = d3.nest()
        .key(function(c) {
            return c.city_code;
        })
        .entries(dataset)

    var countryForm = svg.select('g.select-country')

    // countryForm.append('Inputs.checkbox(["red", "green", "blue"], {label: "color"})')


});
