queue()
    .defer(d3.csv, "austin_weather.csv")
    .await(drawStackedChart);
let weatherChart, selected, chartTitle, selectElement, apiAllData;
const all = [[{
    color: '#4e79a7',
    key: 'TempHighF',
    label: 'High'
}, {
    color: '#4ea77d',
    key: 'TempAvgF',
    label: 'Avg'
}, {
    color: '#dadfec',
    key: 'TempLowF',
    label: 'Low'
}, {
    xAxisName: 'Date',
    yAxisName: 'Temperature',
    title: 'Temperature '
}], [{
    color: '#4e79a7',
    key: 'DewPointHighF',
    label: 'High'
}, {
    color: '#4ea77d',
    key: 'DewPointAvgF',
    label: 'Avg'
}, {
    color: '#dadfec',
    key: 'DewPointLowF',
    label: 'Low'
}, {
    xAxisName: 'Date',
    yAxisName: 'Dew Point',
    title: 'Dew '
}], [{
    color: '#4e79a7',
    key: 'HumidityHighPercent',
    label: 'High'
}, {
    color: '#4ea77d',
    key: 'HumidityAvgPercent',
    label: 'Avg'
}, {
    color: '#dadfec',
    key: 'HumidityLowPercent',
    label: 'Low'
}, {
    xAxisName: 'Date',
    yAxisName: 'Humidity',
    title: 'Humidity'
}], [{
    color: '#4e79a7',
    key: 'SeaLevelPressureHighInches',
    label: 'High'
}, {
    color: '#4ea77d',
    key: 'SeaLevelPressureAvgInches',
    label: 'Avg'
}, {
    color: '#dadfec',
    key: 'SeaLevelPressureLowInches',
    label: 'Low'
}, {
    xAxisName: 'Date',
    yAxisName: 'Sea Level Pressure',
    title: 'Sea Level Pressure '
}], [{
    color: '#4e79a7',
    key: 'VisibilityHighMiles',
    label: 'High'
}, {
    color: '#4ea77d',
    key: 'VisibilityAvgMiles',
    label: 'Avg'
}, {
    color: '#dadfec',
    key: 'VisibilityLowMiles',
    label: 'Low'
}, {
    xAxisName: 'Date',
    yAxisName: 'Visibility Miles',
    title: 'Visibility Mile '
}], [{
    color: '#4e79a7',
    key: 'WindHighMPH',
    label: 'High'
}, {
    color: '#4ea77d',
    key: 'WindAvgMPH',
    label: 'Avg'
}, {
    color: '#dadfec',
    key: 'WindGustMPH',
    label: 'Low'
}, {
    xAxisName: 'Date',
    yAxisName: 'Wind MPH',
    title: 'Wind '
}], [{
    color: '#4e79a7',
    key: 'PrecipitationSum',
    label: 'Total'
},{
    xAxisName: 'PrecipitationSum',
    yAxisName: 'PrecipitationSum Inch',
    title: 'PrecipitationSum'
}]];
const selectData = [{
    id: 0,
    text: 'Temperature'
}, {
    id: 1,
    text: 'Dew'
}, {
    id: 2,
    text: 'Humidity'
}, {
    id: 3,
    text: 'Sea Level Pressure'
}, {
    id: 4,
    text: 'Visibility Mile'
}, {
    id: 5,
    text: 'Wind'
}, {
    id: 6,
    text: 'PrecipitationSum'
} 
]
window.onload = () => {
    selectElement = document.getElementById('multiselect');
    let data = '';
    selectData.forEach((item) => {
        data += `<option value="${item.id}">${item.text}</option>`
    })
    selectElement.innerHTML = data;
}

function selectionChanged($event){
	selected = all[selectElement.options[selectElement.selectedIndex].value];
	drawStackedChart(null, apiAllData);
}
	
function drawStackedChart(error, data){
    if (!selected) {
        selected = all[0];
    }
	
	apiAllData = data;
	
	(function ($, d3, moment) {
            'use strict'

            // *** THE COLORS / KEY *** //
            var colors = [
                ["Pending", "#dadfec"],
                ["InProgress", "#53789e"],
                ["Completed", "#fad29a"]
            ];

            // *** SETTINGS *** //
            var settings = function () {
                var margins = {
                    top: 10,
                    bottom: 65,
                    left: 40,
                    right: 260
                };
                var dim = {
                    width: 1350,
                    height: 500
                };

                return {
                    margins: margins,
                    dim: dim
                };
            }();

            var datasetTemp = [];
            var datasetDewPoint = [];
			var metric = '';
			var legandHigh = '', legendAvg = '', legendLow = '';
			
			var selectedChoice = selected[0].key;
			var index = 0;
			if (selectedChoice == 'TempHighF'){
				index = 1;
				legandHigh = 'High temperature (F)';
				legendAvg = 'Average temperature (F)';
				legendLow = 'Low temperature (F)';
			}
			if (selectedChoice == 'DewPointHighF'){
				index = 2;
				legandHigh = 'High dew point (F)';
				legendAvg = 'Average dew point (F)';
				legendLow = 'Low dew point (F)';
			}
			if (selectedChoice == 'HumidityHighPercent'){
				index = 3;
				legandHigh = 'High humidity (%)';
				legendAvg = 'Average humidity (%)';
				legendLow = 'Low humidity (%)';
			}
			if (selectedChoice == 'SeaLevelPressureHighInches'){
				index = 4;
				legandHigh = 'High sea level pressure (inch)';
				legendAvg = 'Average sea level pressure (inch)';
				legendLow = 'Low sea level pressure (inch)';
			}
			if (selectedChoice == 'VisibilityHighMiles'){
				index = 5;
				legandHigh = 'High visibility (mile)';
				legendAvg = 'Average visibility (mile)';
				legendLow = 'Low visibility (mile)';
			}
			if (selectedChoice == 'WindHighMPH'){
				index = 6;
				legandHigh = 'High wind speed (mph)';
				legendAvg = 'Average wind speed (mph)';
				legendLow = '';
            }
            if (selectedChoice == 'PrecipitationSum'){
				index = 7;
				legandHigh = 'Precipitation Sum (inch)';
				legendAvg = '';
				legendLow = '';
            }

			

                for (var i = 0; i < data.length; i++) {
					
					var evts = data[i].Events;

                    var splitted = [];
                    if (evts != " ") {
                        splitted = evts.split(" , ");
                    }
					
					if (index == 1){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
                            parseInt(data[i].TempLowF),
                            parseInt(data[i].TempAvgF),
                            parseInt(data[i].TempHighF),
						],
						events: splitted,
						gust: null,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = 'F';
					}
					if (index == 2){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
                            parseInt(data[i].DewPointLowF),
                            parseInt(data[i].DewPointAvgF),
                            parseInt(data[i].DewPointHighF),
						],
						events: splitted,
						gust: null,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = 'F';
					}
					if (index == 3){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
                            parseInt(data[i].HumidityLowPercent),
                            parseInt(data[i].HumidityAvgPercent),
                            parseInt(data[i].HumidityHighPercent),
						],
						events: splitted,
						gust: null,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = '%';
					}
					if (index == 4){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
                            parseInt(data[i].SeaLevelPressureLowInches),
                            parseInt(data[i].SeaLevelPressureAvgInches),
                            parseInt(data[i].SeaLevelPressureHighInches),
						],
						events: splitted,
						gust: null,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = 'in';
					}
					if (index == 5){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
                            parseInt(data[i].VisibilityLowMiles),
                            parseInt(data[i].VisibilityAvgMiles),
                            parseInt(data[i].VisibilityHighMiles),
						],
						events: splitted,
						gust: null,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = 'miles';
					}
					if (index == 6){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
							parseInt(0),
                            parseInt(data[i].WindAvgMPH),
                            parseInt(data[i].WindHighMPH),
						],
						events: splitted,
						gust: data[i].WindGustMPH,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = 'MPH';
                    }
                    if (index == 7){
						var tuppleTemp = {
                        date: data[i].Date,
                        values: [
                            parseInt(0),
                            parseInt(0),
							parseInt(data[i].PrecipitationSumInches),    
						],
						events: splitted,
						gust: null,
						precipitationSum: data[i].PrecipitationSumInches
						};
						datasetTemp.push(tuppleTemp);
						
						metric = 'inch';
					}
                }

                function renderChart(dataset, colors, settings, chartId, tooltipId, metric) {
                    // setup data for graphing ... re-map data and then stack
                    var remapped = colors.map(function (c, i) {
                        return dataset.map(function (d, ii) {
                            return {
                                x: ii,
                                y: d.values[i]
                            };
                        });
                    });
                    //stack
                    var stacked = d3.layout.stack()(remapped);

                    // *** SCALES *** //
                    var x = d3.scale.ordinal()
                        .domain(stacked[0].map(function (d) {
                            return d.x;
                        })) //pick one of the mapped arrays' x values for the domain
                        .rangeRoundBands([0, settings.dim.width]);
                    var y = d3.scale.linear()
                        .domain([0, d3.max(stacked[stacked.length - 1], function (d) {
                            return d.y0 + d.y;
                        })]) //the last mapped arrays' has the cummulative y values (y0)
                        .range([0, settings.dim.height]);
                    var z = d3.scale.ordinal().range(colors.map(function (c) {
                        return c[1];
                    })); //ordinal scale with the colors

                    // *** SETUP THE CHART *** //
                    d3.select('#' + chartId + ' svg').remove() //clear out old version
                    var svg = d3.select('#' + chartId)
                        .append("svg")
                        .attr({
                            'class': 'chart-wrapper',
                            width: settings.dim.width + settings.margins.left + settings.margins.right+100,
                            height: settings.dim.height + settings.margins.top + settings.margins.bottom +75

                        });

                    var chart = svg.append('g')
                        .attr('transform', 'translate(' + settings.margins.left + ',' + settings.margins.top + ')');

                    // Add a group for each column.
                    var valgroup = chart.selectAll("g.valgroup")
                        .data(stacked)
                        .enter().append("g")
                        .attr("class", "valgroup")
                        .style("fill", function (d, i) {
                            return z(i);
                        })
                        .style("stroke", function (d, i) {
                            return d3.rgb(z(i)).darker();
                        });

                    // Add a rect for each date.
                    var rect = valgroup.selectAll("rect")
                        .data(function (d) {
                            return d;
                        })
                        .enter().append("rect")
                        .attr("x", function (d) {
                            return x(d.x);
                        })
                        .attr("y", function (d) {
                            return settings.dim.height - y(d.y0) - y(d.y);
                        })
                        .attr("height", function (d) {
                            return y(d.y);
                        })
                        .attr("width", x.rangeBand())
                        .on("mouseout", function () {
                            $("#" + tooltipId).hide();
                        })
                        .on("mousemove", function (d, t) {
                            var value = d.y;
                            var date = dataset[t].date;
							var events = dataset[t].events;
							var gust = dataset[t].gust;
							var precipitationSum = dataset[t].precipitationSum;

                            //var splitted = date.split("-");
                            //var dateToShow = splitted[1] + "/" + splitted[2] + "/" + splitted[0];
							var dateToShow = date;

                            var tooltip = document.getElementById(tooltipId);
                            
							var html = '<div style="width: 150px; display: inline-block;">' +
                                '<span><b>' + dateToShow + '</b></span><br />' +
                                '<span>' + value + ' ' + metric + '</span>';

                            if (gust != null) {
                                html += '<br /><span>Wind gust: ' + gust + ' MPH</span>';
                            }

                            html += '<br /><span>Precipitation sum: ' + precipitationSum;

                            if (precipitationSum == "T") {
                                html += ' </span>';
                            }
                            else {
                                html += ' inches</span>';
                            }

                            html += '</div>';

                            if (events && events.length != 0) {
                                for (var i = 0; i < events.length; i++) {
                                    html += '<span style="width: 45px;">' +
                                        '<img style="display: inline;" src="images/' + events[i] +'.png" /></span>';
                                }
                            };

                            tooltip.innerHTML = html;
                            tooltip.style.display = "block";


                            var coordinates = d3.mouse(this);

                            var map_width = settings.dim.width;
							
							d3.select("#" + tooltipId)
                                    .style("top", (d3.event.layerY + 15) + "px")
                                    .style("left", (d3.event.layerX + 15) + "px");
                        });

                    // *** ADD THE TIME SERIES BOTTOM AXIS *** //
                    (function (svg, min, max, settings) {
                        //setup the min and max as moment objects
                        if (!moment.isMoment(min)) {
                            min = moment(min);
                            if (!min.isValid()) {
                                throw new Error("Invalid min date: " + min);
                            }
                        }
                        if (!moment.isMoment(max)) {
                            max = moment(max);
                            if (!max.isValid()) {
                                throw new Error("Invalid max date: " + max);
                            }
                        }


                        // *** SETUP THE TIME SERIES AXIS *** //
                        var timeScale = d3.time.scale()
                            .domain([min.toDate(), max.toDate()])
                            .range([0, settings.dim.width]);

                        //create the x-axis from the time scale
                        var xAxis = function (timeScale, min, max) {
                            var tickInterval, tickFormat, tickStep = 1,
                                duration = moment.duration(max.diff(min));


                            if (duration.asMonths() > 5) {
                                tickInterval = d3.time.month;
                                tickFormat = "%b '%y";
                            } else if (duration.asWeeks() > 5) {
                                tickInterval = d3.time.week;
                                tickFormat = "%b %d";
                            } else {
                                tickInterval = d3.time.day;
                                tickFormat = "%b %d";
                                tickStep = Math.ceil(duration.days() / 10);
                            }

                            console.log("date interval: ", { min: min, max: max }, { months: duration.asMonths(), weeks: duration.asWeeks(), days: duration.asDays() }, { interval: tickInterval, step: tickStep, format: tickFormat });

                            return d3.svg.axis()
                                .orient('bottom')
                                .scale(timeScale)
                                .ticks(tickInterval, tickStep)
                                .tickSize(5)
                                .tickPadding(5)
                                .tickFormat(d3.time.format(tickFormat));
                        }(timeScale, min, max);

                        //draw the axis
                        svg.append("g")
                            .attr('class', 'x-axis')
                            .attr('transform', 'translate(' + settings.margins.left + ',' + (settings.dim.height + settings.margins.top) + ')')
                            .call(xAxis)
                            .selectAll("text")
                            .attr("transform", "rotate(45) translate(0, 20)");
							
						 svg.append("text")
                             .attr("transform",
                                 "translate(" + (settings.dim.width / 2) + " ," +
                                 (settings.dim.height + settings.margins.top + 100) + ")")
                             .style("text-anchor", "middle")
                             .text("Date")
                             .style("font-size", "40");
							
						svg.append("circle")
                            .attr("cx", settings.dim.width + 50)
                            .attr("cy", 30)
                            .attr("r", 5)
                            .attr('fill', '#fad29a');

                        svg.append("text")
                            .text(legandHigh)
                            .attr("x", settings.dim.width + 60)
                            .attr("y", 35);

                        if (legendAvg != ''){
                            svg.append("circle")
                            .attr("cx", settings.dim.width + 50)
                            .attr("cy", 50)
                            .attr("r", 5)
                            .attr('fill', '#53789e');

                        svg.append("text")
                            .text(legendAvg)
                            .attr("x", settings.dim.width + 60)
                            .attr("y", 55);
                        }
						if (legendLow != ''){
							svg.append("circle")
                            .attr("cx", settings.dim.width + 50)
                            .attr("cy", 70)
                            .attr("r", 5)
                            .attr('fill', '#dadfec');

                        svg.append("text")
                            .text(legendLow)
                            .attr("x", settings.dim.width + 60)
                            .attr("y", 75);
						}
                        
                        //svg.append("g")
                        //    .attr("class", "y-axis")
                        //    .attr('transform', 'translate(40, 10)')
                        //    .call(d3.svg.axis()
                        //        .orient('left')
                        //        .scale(y)
                        //    );

                    }(svg, dataset[0].date, dataset[dataset.length - 1].date, settings));


                    return svg;
                }; // end renderChart //

                function renderSlider(dataset, settings, sliderId, callback) {
					

                    var RangeSlider = function (svg, width, radius, color, translater, callback) {
                        var self = this,
                            elements = {
                                min: { value: 0 },
                                max: { value: width }
                            },
                            settings = {
                                min: 0,
                                max: width,
                                radius: radius,
                                offset: Math.floor(radius / 2),
                                color: color,
                                opacity: {
                                    full: 1.0,
                                    medium: 0.8,
                                    half: 0.5,
                                    light: 0.3
                                },
                                translater: translater,
                                callback: callback
                            };

                        //build the bar
                        elements.$bar = svg.append('rect')
                            .attr({
                                x: settings.offset, width: settings.max - (settings.offset * 2),
                                y: settings.offset+1.5, height: settings.radius -3,
                                fill: settings.color,
                                'fill-opacity': settings.opacity.half
                            });

                        //build the handles
                        elements.$min = svg.append('ellipse')
                            .style('cursor', 'pointer')
                            .attr({
                                cx: settings.min, cy: settings.radius,
                                rx: settings.radius, ry: settings.radius,
                                fill: settings.color,
                                'fill-opacity': settings.opacity.medium
                            });
                        elements.$minText = svg.append('text')
                            .attr({
                                x: settings.min, y: settings.radius * 3 + settings.offset,
                                fill: 'black', 'fill-opacity': settings.opacity.medium,
                                'text-anchor': 'middle'
                            }).text(settings.translater.apply(self, [settings.min]).text);

                        elements.$max = svg.append('ellipse')
                            .style('cursor', 'pointer')
                            .attr({
                                cx: settings.max, cy: settings.radius,
                                rx: settings.radius, ry: settings.radius,
                                fill: settings.color,
                                'fill-opacity': settings.opacity.medium
                            });
                        elements.$maxText = svg.append('text')
                            .attr({
                                x: settings.max, y: settings.radius * 3 + settings.offset,
                                fill: 'black', 'fill-opacity': settings.opacity.medium,
                                'text-anchor': 'middle'
                            }).text(settings.translater.apply(self, [settings.max]).text);


                        //expose as public properties
                        self.elements = elements;
                        self.settings = settings;

                        //setup additional methods
                        self.init();
                    };

                    RangeSlider.prototype.init = function () {
                        var self = this,
                            api = {};

                        var runCallback = function (process) {
                            if (self.settings.callback) {
                                self.settings.callback.apply(self, [
                                    process,
                                    self.settings.translater.apply(self, [self.elements.min.value]),
                                    self.settings.translater.apply(self, [self.elements.max.value])
                                ]);
                            }
                        };

                        self.move = function (self) {
                            var api = {};

                            var resetBar = function (x, width) {
                                //no error checking
                                self.elements.$bar.attr({
                                    x: Math.max(x - self.settings.offset, 0), width: Math.max(width, 0)
                                });
                            };


                            api.$min = function (x) {
                                if (x >= self.settings.min && x <= self.elements.max.value) {
                                    self.elements.min.value = x;
                                    self.elements.$min.attr('cx', x);
                                    self.elements.$minText.attr('x', x).text(self.settings.translater.apply(self, [x]).text);
                                    resetBar(x, self.elements.max.value - x);
                                    runCallback('move');
                                }
                                return self;  //chain-able
                            };
                            api.$max = function (x) {
                                if (x >= self.elements.min.value && x <= self.settings.max) {
                                    self.elements.max.value = x;
                                    self.elements.$max.attr('cx', x);
                                    self.elements.$maxText.attr('x', x).text(self.settings.translater.apply(self, [x]).text);
                                    resetBar(self.elements.min.value, x - self.elements.min.value);
                                    runCallback('move');
                                }
                                return self;  //chain-able
                            };

                            return api;
                        }(self);

                        self.dragstart = function (self) {
                            var api = {};

                            var render = function ($element, $text) {
                                $element.attr('fill-opacity', self.settings.opacity.full);
                                $text.attr('fill-opacity', self.settings.full);
                                self.elements.$bar.attr('fill-opacity', self.settings.opacity.light);
                                runCallback('dragstart');
                            }
                            api.$min = function () {
                                render(self.elements.$min, self.elements.$minText);
                                return self;
                            };
                            api.$max = function () {
                                render(self.elements.$max, self.elements.$maxText);
                                return self;
                            };

                            return api;
                        }(self);

                        self.dragend = function (self) {
                            var api = {};

                            var render = function ($element, $text) {
                                $element.attr('fill-opacity', self.settings.opacity.medium);
                                $text.attr('fill-opacity', self.settings.medium);
                                self.elements.$bar.attr('fill-opacity', self.settings.opacity.half);
                                runCallback('dragend');
                            }
                            api.$min = function () {
                                render(self.elements.$min, self.elements.$minText);
                                return self;
                            };
                            api.$max = function () {
                                render(self.elements.$max, self.elements.$maxText);
                                return self;
                            };

                            return api;
                        }(self);

                        return self;
                    };


                    var svg = d3.select('#' + sliderId)
                        .append('svg')
                        .attr({
                            width: settings.dim.width + settings.margins.left + settings.margins.right,
                            height: 50
                        });

                    var min = moment(dataset[0].date),
                        max = moment(dataset[dataset.length - 1].date),
                        handles = {
                            size: 8
                        };
                    var timeScale = d3.time.scale()
                        .domain([min.toDate(), max.toDate()])
                        .range([0, settings.dim.width]);

                    //setup the svg container
                    var svg = d3.select('#' + sliderId)
                        .append('svg')
                        .attr({
                            width: settings.dim.width + settings.margins.left + settings.margins.right,
                            height: 50
                        });
                    var g = svg.append("g")
                        .attr('class', 'x-axis')
                        .attr('transform', 'translate(' + (settings.margins.left +10) + ',0)');

                    //draw the axis
                    g.append('line')
                        .attr({
                            x1: 0, y1: handles.size,
                            x2: settings.dim.width, y2: handles.size,
                            stroke: '#ccc',
                            "stroke-width": 1
                        });

                    var translater = function (timeScale) {
                        return function (x) {
                            var m = moment(timeScale.invert(x)),
                                ret = {
                                    x: x,
                                    text: null,
                                    value: m
                                };

                            if (m.isValid()) {
                                ret.text = m.format("MMM. DD, YYYY");
                            }
                            return ret;
                        };
                    }(timeScale);

                    var slider = new RangeSlider(g, settings.dim.width, handles.size, 'black', translater, callback);

                    console.log("slider", slider);

                    //setup handle dragging
                    slider.elements.$min.call(d3.behavior.drag()
                        .on('dragstart', slider.dragstart.$min)
                        .on('drag', function () {
                            slider.move.$min(d3.event.x);
                        })
                        .on('dragend', slider.dragend.$min));
                    slider.elements.$max.call(d3.behavior.drag()
                        .on('dragstart', slider.dragstart.$max)
                        .on('drag', function () {
                            slider.move.$max(d3.event.x);
                        })
                        .on('dragend', slider.dragend.$max));

                }

                function updateChartContent(dataset, colors, settings, chartId, tooltipId, metric) {
                    //draw for the first time
                    var svg = renderChart(dataset, colors, settings, chartId, tooltipId, metric);

                    var filterData = function (dstart, dend) {
                        //because .isBetween is exclusive, adjust these boundaries
                        dstart = dstart.subtract(1, 'minute'); dend = dend.add(1, 'minute');

                        return dataset.filter(function (d) {
                            return moment(d.date).isBetween(dstart, dend);
                        });
                    };

                    var callback = function (process, dstart, dend) {
                        if (process === 'dragend') {
                            var data = filterData(dstart.value, dend.value);
                            svg.attr('opacity', 1);
                            svg = renderChart(data, colors, settings, chartId, tooltipId, metric);
                        } else if (process === 'dragstart') {
                            svg.attr('opacity', 0.5);
                        }
                    };

                    return callback;
                }

                //////////////////////////
                var updateChartTemp = function (dataset, colors, settings, chartId, tooltipId, metric) {
					//d3.select('#' + 'controller-temp' + ' svg').remove();
					document.getElementById('controller-temp').innerHTML = "";
                    return updateChartContent(dataset, colors, settings, chartId, tooltipId, metric);
                }(datasetTemp, colors, settings, 'chart-temp', 'tooltip-temp', metric);

                renderSlider(datasetTemp, settings, 'controller-temp', updateChartTemp);

        }(jQuery, window.d3, window.moment));
}
