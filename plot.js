var firstCat = null;
var secondCat = null;
var firstCatName = null;
var secondCatName = null;
var firstType = null;
var secondType = null; 
var parent;
var width;
var height;
var paddingLeft = 110;
var paddingRight = 20;
var paddingBottom = 90;
var paddingTop = 20;
var paddingBottomAxis = 20;
var categoriesArray = [];
var categoryNameToIndex = new Object();
var filename = "2016-FCC-New-Coders-Survey-Data-Removed-Outliers.csv";
var svg, tip;

var colorRange = [0.85, 0.25];
var colorHue = 120;
var colorSaturation = 0.5;
//var colors = ['#a5cbd8', '#e8f3f7', '#f97e66', '#d03d00', '#aa0c10'];
var colors = ['#F7CCCA', '#E7A09D', '#D77571', '#C74A45', '#B81F19'];
// via http://www.perbang.dk/rgbgradient/

var categories = [
    { name: "Age", type: "int", axis: "x" },
    { name: "CityPopulation", type: "string", axis: "x"},
    { name: "EmploymentStatus", type: "string", axis: "x"},
    { name: "EmploymentField", type: "string", axis: "x"},
    { name: "Gender", type: "string", axis: "x"},
    { name: "HasChildren", type: "bool", axis: "x"},
    { name: "IsEthnicMinority", type: "bool", axis: "x"},
    { name: "IsReceiveDisabilitiesBenefits", type: "bool", axis: "x"},
    { name: "MaritalStatus", type: "string", axis: "x"},
    { name: "SchoolDegree", type: "string", axis: "x"},
    { name: "AttendedBootcamp", type: "bool", axis: "y"},
    { name: "BootcampFullJobAfter", type: "bool", axis: "y"},
    { name: "BootcampPostSalary", type: "int", axis: "y"},
    { name: "ExpectedEarning", type: "int", axis: "y" },
    { name: "HoursLearning", type: "int", axis: "y" },
    { name: "MonthsProgramming", type: "int", axis: "y" },
    { name: "IsSoftwareDev", type: "bool", axis: "y"},
    { name: "JobRelocate", type: "bool", axis: "y"},
    { name: "JobRoleInterest", type: "string", axis: "y" },
    { name: "JobWherePref", type: "string", axis: "y"}
    
    /* Too many options to show */
    //{ name: "CountryCitizen", type: "string", axis: "x"},
    //{ name: "CountryLive", type: "string", axis: "x"},
    //{ name: "LanguageAtHome", type: "string", axis: "x"},
    //{ name: "SchoolMajor", type: "string", axis: "x"},
];

$(function() {
    parent = d3.select('#plot')
    width = parent.node().getBoundingClientRect().width;
    height = parent.node().getBoundingClientRect().height;
});

function capitalizeFirstLetter(string) {
    string = string.trim();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function dropdownChanged() {
    if (firstCatName === null || secondCatName === null) {
        return;
    }
    
    firstCat = categoryNameToIndex[firstCatName];
    secondCat = categoryNameToIndex[secondCatName];
    firstType = "int";
    secondType = "int";
    categories.forEach(function (cat) {
        if (cat["name"] == firstCatName) {
            firstType = cat["type"];
        } else if (cat["name"] == secondCatName) {
            secondType = cat["type"];
        }
    });
    
    $(".svg").remove();
    svg = parent
        .append("svg")
        .attr("class", "svg")
        .attr("width", width)
        .attr("height", height);
    $(".tooltip").remove();
    tip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    fct = plot_numerical;
    if ((firstType === "string" || firstType === "bool") && (secondType === "string" || secondType === "bool")) {
        fct = plot_categorical;
    }
    else if (firstType !== "int" || secondType !== "int") {
        fct = plot_numerical_categorical;
    }
    d3.text(filename, fct)
}

function plot_categorical(unparsedData) {
    var rows = d3.csv.parseRows(unparsedData);
    var data = [];
    var pairToCount = new Object();
    var countMax = Number.MIN_VALUE;
    var firstRange = [];
    var secondRange = [];
    for (var rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        var firstVal = rows[rowIndex][firstCat];
        if (firstVal !== "NA" && firstVal !== "OL") {
            var secondVal = rows[rowIndex][secondCat];
            if (secondVal !== "NA" && secondVal !== "OL") {
                d = { "origRow": parseInt(rowIndex) };
                switch (firstType) {
                    case "int":
                        d["firstVal"] = parseInt(firstVal);
                        break;
                    case "string":
                        d["firstVal"] = firstVal;
                        if (firstRange.indexOf(firstVal) < 0) {
                            firstRange.push(firstVal);
                        }
                        break;
                    case "bool":
                        if (firstVal === "0") {
                            d["firstVal"] = firstCatName + ": No";
                        }
                        else if (firstVal === "1") {
                            d["firstVal"] = firstCatName + ": Yes";
                        }
                        if (firstRange.indexOf(d["firstVal"]) < 0) {
                            firstRange.push(d["firstVal"]);
                        }
                        break;
                }
                switch (secondType) {
                    case "int":
                        d["secondVal"] = parseInt(secondVal);
                        break;
                    case "string":
                        d["secondVal"] = secondVal;
                        if (secondRange.indexOf(secondVal) < 0) {
                            secondRange.push(secondVal);
                        }
                        break;
                    case "bool":
                        if (secondVal === "0") {
                            d["secondVal"] = secondCatName + ": No";
                        }
                        else if (secondVal === "1") {
                            d["secondVal"] = secondCatName + ": Yes";
                        }
                        if (secondRange.indexOf(d["secondVal"]) < 0) {
                            secondRange.push(d["secondVal"]);
                        }
                        break;
                }
                data.push(d);
                var pair_string = d["firstVal"] + ", " + d["secondVal"];
                var count = pairToCount[pair_string];
                if (count == null) {
                    pairToCount[pair_string] = 1;
                } else {
                    pairToCount[pair_string]++;
                    if (pairToCount[pair_string] > countMax) {
                        countMax = pairToCount[pair_string];
                    }
                }
            }
        }
    } // end for

    // fix categorical ordering
    // // CityPopulation
    citypopulation_ordering = [
        "less than 100,000",
        "between 100,000 and 1 million",
        "more than 1 million"
    ];    
    if (firstCatName === "CityPopulation") {
        firstRange = citypopulation_ordering;
    }
    if (secondCatName === "CityPopulation") {
        secondRange = citypopulation_ordering;
    }
    // // SchoolDegree
    schooldegree_ordering = [
        "no high school (secondary school)",
        "some high school",
        "high school diploma or equivalent (GED)",
        "some college credit, no degree",
        "associate's degree",
        "trade, technical, or vocational training",
        "bachelor's degree",
        "master's degree (non-professional)",
        "professional degree (MBA, MD, JD, etc.)",
        "Ph.D."
    ];
    if (firstCatName === "SchoolDegree") {
        console.log(firstRange);
        console.log(schooldegree_ordering);
        firstRange = schooldegree_ordering;
    }
    if (secondCatName === "SchoolDegree") {
        secondRange = schooldegree_ordering;
    }

    var colorScale = d3.scale.linear()
        .domain([0, countMax])
        .range(colorRange);
    
    var blockWidth = (width - paddingLeft) / firstRange.length;
    var blockHeight = (height - paddingBottom) / secondRange.length;
    var blockPadding = 4;
    
    // x axis
    var smallBlocks = firstRange.length >= 10;
    var firstLabels = svg.selectAll(".axis-title x-axis")
        .data(firstRange)
        .enter().append("text")
            .text(function(d) { return capitalizeFirstLetter(d); })
            .attr("transform", function(d, i) {
                var transform = "translate(" +
                    (i * blockWidth + paddingLeft + blockPadding * 2) +
                    "," +
                    (secondRange.length * blockHeight + blockPadding * 2.5) +
                    ")";
                if (smallBlocks) {
                    transform += ", rotate(10)";
                }
                return transform;
                })
            .attr("class", smallBlocks ? "axis-title-small x-axis" : "axis-title x-axis")
            .call(wrap, blockWidth - blockPadding * (smallBlocks ? 4 : 2));
    
    // y axis
    smallBlocks = secondRange.length > 3;
    var secondLabels = svg.selectAll(".axis-title y-axis")
        .data(secondRange)
        .enter().append("text")
            .text(function(d) { return capitalizeFirstLetter(d); })
        .attr("transform", function(d, i) {
            if (smallBlocks) {
                return "translate(0," +
                    ((i + 0.5) * blockHeight - blockPadding) + ")";
            }
            return "translate(" +
                (paddingLeft * 0.75) + "," +
                ((i + 1) * blockHeight - blockPadding * 2) +
                "), rotate(-90)"
            })
            .attr("class", "axis-title")
            .call(wrap, smallBlocks ? paddingLeft : blockHeight);

    // datapoints
    var blocks = svg.selectAll(".block")
        .data(data)
        .enter().append("rect")
        .attr("x", function (d) { return firstRange.indexOf(d["firstVal"]) * blockWidth + paddingLeft + blockPadding; })
        .attr("y", function (d) { return secondRange.indexOf(d["secondVal"]) * blockHeight; })
        .attr("rx", blockPadding * 2)
        .attr("ry", blockPadding * 2)
        .attr("width", blockWidth - blockPadding)
        .attr("height", blockHeight - blockPadding)
        .style("fill", function (d) {
            var c = pairToCount[d["firstVal"] + ", " + d["secondVal"]];
            return d3.hsl(colorHue, colorSaturation, colorScale(c));
        })
        .on("mouseover", function (d) {
            var c = pairToCount[d["firstVal"] + ", " + d["secondVal"]];
            
            tip.transition()
                .duration(200)
                .style('opacity', 1);
            tip.html('<div><span class="category">Count</span><span class="value">' + c + '</span></div>' +
                '<div style="clear: both;"></div>');
        })
        .on('mousemove', function (d) {
            tip.style('left', (d3.event.pageX) + 10 + 'px')
                .style('top', (d3.event.pageY) + 'px');
        })
        .on("mouseout", function (d) {
            // hide tooltip
            tip.transition()
                .duration(200)
                .style('opacity', 0);
        });
}
        
function plot_numerical(unparsedData) {
    var rows = d3.csv.parseRows(unparsedData);
    var data = [];
    var pairToCount = new Object();
    var countMax = Number.MIN_VALUE;
    for (var rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        var firstVal = rows[rowIndex][firstCat];
        if (firstVal !== "NA" && firstVal !== "OL") {
            var secondVal = rows[rowIndex][secondCat];
            if (secondVal !== "NA" && secondVal !== "OL") {
                data.push({
                    "origRow": parseInt(rowIndex),
                    "firstVal": parseInt(firstVal),
                    "secondVal": parseInt(secondVal)
                });
                var count = pairToCount[firstVal + ", " + secondVal];
                if (count == null) {
                    pairToCount[firstVal + ", " + secondVal] = 1;
                }
                else {
                    pairToCount[firstVal + ", " + secondVal]++;
                    if (pairToCount[firstVal + ", " + secondVal] > countMax) {
                        countMax = pairToCount[firstVal + ", " + secondVal];
                    }
                }
            }
        }
    }
    
    var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d["firstVal"]; })])
        .range([paddingLeft, width - paddingRight]);
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d["secondVal"]; })])
        .range([height - paddingBottom, paddingTop]);
        
    var colorScale = d3.scale.linear()
        .domain([0, countMax])
        .range(colorRange)
    var radiusScale = d3.scale.linear()
        .domain([0, countMax])
        .range([2, 6]);

    function getColor(d) {
        var count = pairToCount[d["firstVal"] + ", " + d["secondVal"]];
        return d3.hsl(colorHue, colorSaturation, colorScale(count));
    }
    function getRadius(d) {
        var count = pairToCount[d["firstVal"] + ", " + d["secondVal"]];
        return radiusScale(count);
    }
            
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d["firstVal"]);
        })
        .attr("cy", function(d) {
            return yScale(d["secondVal"]);
        })
        .attr("r", function(d) {
            return getRadius(d);
        })
        .style("fill", function(d) {
            return getColor(d);
        })
        .on("mouseover", function(d) {
            this.parentNode.appendChild(this);
            tip.transition()
                .duration(200)
                .style('opacity', 1);
            tip.html('<div><span class="category">' + firstCatName + '</span><span class="value">' + d["firstVal"] + '</span><div style="clear: both;"></div></div>' +
                '<div><span class="category">' + secondCatName + '</span><span class="value">' + d["secondVal"] + '</span><div style="clear: both;"></div></div>' + 
                '<div><span class="category">Count</span><span class="value">' + pairToCount[d["firstVal"] + ", " + d["secondVal"]] + '</span><div style="clear: both;"></div></div>')
                .style('left', (d3.event.pageX) + 10 + 'px')
                .style('top', (d3.event.pageY) + 'px');
        })
        .on("mouseout", function(d) {
            // hide tooltip
            tip.transition()
                .duration(200)
                .style('opacity', 0);
        });
    
    // draw axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - paddingBottom) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + paddingLeft + ",0)")
        .call(yAxis);

    // draw axes labels
    svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "translate(" + (width + paddingLeft) / 2 + ", " + (height - paddingBottom / 3) + ")")
        .text(firstCatName);
    svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "translate(" + paddingLeft / 2 + ", " + height / 2 + ")rotate(-90)")
        .text(secondCatName);
}

function plot_numerical_categorical(unparsedData) {
    var rows = d3.csv.parseRows(unparsedData);
    var data = [];
    var pairToCount = new Object();
    var countMax = Number.MIN_VALUE;
    var numericalCatName = secondCatName;
    var categoricalCatName = firstCatName;
    
    if (firstType === "int" && (secondType === "string" || secondType === "bool")) {
        // switch so that categorical is on x-axis
        var tempCat = firstCat;
        firstCat = secondCat;
        secondCat = tempCat;
        
        categoricalCatName = secondCatName;
        numericalCatName = firstCatName;
        
        firstType = secondType;
        secondType = "int"; 
    }
    if ((firstType !== "string" && firstType !== "bool") && secondType !== "int") {
        // function reached in error
        return;
    }
    
    // category { value: count at that value }
    var categoriesToValuesAndCounts = new Object();
    
    for (var rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        var firstVal = rows[rowIndex][firstCat];
        if (firstVal !== "NA" && firstVal !== "OL") {
            var secondVal = rows[rowIndex][secondCat];
            if (secondVal !== "NA" && secondVal !== "OL") {
                data.push({
                    "origRow": parseInt(rowIndex),
                    "firstVal": firstVal,
                    "secondVal": parseInt(secondVal)
                });
                var count = pairToCount[firstVal + ", " + secondVal];
                if (count == null) {
                    pairToCount[firstVal + ", " + secondVal] = 1;
                }
                else {
                    pairToCount[firstVal + ", " + secondVal]++;
                    if (pairToCount[firstVal + ", " + secondVal] > countMax) {
                        countMax = pairToCount[firstVal + ", " + secondVal];
                    }
                }
                if (categoriesToValuesAndCounts[firstVal] === undefined) {
                    categoriesToValuesAndCounts[firstVal] = {
                            [secondVal]: pairToCount[firstVal + ", " + secondVal]
                    }
                }
                else {
                    categoriesToValuesAndCounts[firstVal][secondVal] = pairToCount[firstVal + ", " + secondVal];
                }
            }
        }
    }
    
    // intuitive reordering
    ordering = Object.keys(categoriesToValuesAndCounts);
    if (categoricalCatName === "CityPopulation") {
        ordering = [
            "less than 100,000",
            "between 100,000 and 1 million",
            "more than 1 million"
        ];
        categoriesToValuesAndCounts = {
            "less than 100,000": categoriesToValuesAndCounts["less than 100,000"],
            "between 100,000 and 1 million": categoriesToValuesAndCounts["between 100,000 and 1 million"],
            "more than 1 million": categoriesToValuesAndCounts["more than 1 million"]
        }
    }
    if (categoricalCatName === "SchoolDegree") {
        ordering = [
            "no high school (secondary school)",
            "some high school",
            "high school diploma or equivalent (GED)",
            "some college credit, no degree",
            "associate's degree",
            "trade, technical, or vocational training",
            "bachelor's degree",
            "master's degree (non-professional)",
            "professional degree (MBA, MD, JD, etc.)",
            "Ph.D."
        ];
    }
    newCat = {}
    ordering.forEach(function(category) {
        if (category in categoriesToValuesAndCounts) {
            newCat[category] = categoriesToValuesAndCounts[category];
        }
    });
    categoriesToValuesAndCounts = newCat;

    var yScale = d3.scale.linear()
        // max of the values across all type entries
        .domain([0, d3.max(data, function(d) { return d["secondVal"]; })])
        .range([height - paddingBottom, paddingTop]);
    
    var yAxis = d3.svg.axis()
       .scale(yScale)
       .orient("left");
    
    var xOffset;
    var xPaddingBetweenCategories = 20;
    var numEntries = Object.entries(categoriesToValuesAndCounts).length;
    var entryIndex = 0;
    var chartWidthMinusPadding = ((width-paddingRight)-paddingLeft)/numEntries- xPaddingBetweenCategories;
    var chartWidth = ((width-paddingRight)-paddingLeft)/numEntries;
    
    // find max number of values in any category, to determine out height of bars
    var maxNumValues = 0;
    for (category in categoriesToValuesAndCounts) {
        var length = Object.entries(categoriesToValuesAndCounts[category]).length;
        if (length > maxNumValues) {
            maxNumValues = length;
        }
    }
    
    for (category in categoriesToValuesAndCounts) {
        xOffset = entryIndex*chartWidth;
        var xScale = d3.scale.linear()
            .domain([0, d3.max(Object.values(categoriesToValuesAndCounts[category]), function(d) { return d })])
            .range([paddingLeft + xOffset, paddingLeft + xOffset + chartWidthMinusPadding]);
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(d3.format("d"))
            .orient("bottom");
        var xWidthScale = d3.scale.linear()
            .domain([0, d3.max(Object.values(categoriesToValuesAndCounts[category]), function(d) { return d })])
            //.domain([0, countMax])
            .range([0, chartWidthMinusPadding]);
        
        // add category name to data array for uniqueness    
        var dataArray = Object.entries(categoriesToValuesAndCounts[category]);
        for (index in dataArray) {
            dataArray[index].push(category);  
        }

        // add bars based on data in categoriesToValuesAndCounts[category]
        var count = 0;
        svg.selectAll("rect")
            .data(dataArray, function(d){
                return d; })
            .enter()
            .append("rect")
            .attr("x", function() {
                return paddingLeft + xOffset;
            })
            .attr("y", function(d) {
                return yScale(parseInt(d[0])); //key
            })
            .attr("width", function(d) {
                return xWidthScale(d[1]); //value
            })
            .attr("height", function(d) {
                var barHeight = (1/maxNumValues) * ((height - paddingBottom) - paddingTop);
                if (barHeight > 5) {
                    barHeight = 5;
                }
                barHeight = barHeight-barHeight/10;
                return barHeight;
            })
            .attr("fill", d3.hsl(colorHue, colorSaturation, 0.7))
            .on("mouseover", function (d) {
                tip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tip.html('<div><span class="category">' + numericalCatName + '</span><span class="value">' + d[0] + '</span><div style="clear: both;"></div></div>' +
                    '<div><span class="category">' + 'Count' + '</span><span class="value">' + d[1] + '</span><div style="clear: both;"></div></div>')
                    .style('left', (d3.event.pageX) + 10 + 'px')
                    .style('top', (d3.event.pageY) + 'px');
            })
            .on("mouseout", function (d) {
                // hide tooltip
                tip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });
            
        // add xAxis
        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + (height - paddingBottom + 6) + ")")
            .call(xAxis);
        svg.selectAll(".axis.x")
            .selectAll("text")
            .style("font-size","7px");
            
        // add category label
        var smallBlocks = numEntries >= 10;
        var transform = "translate(" + (paddingLeft + xOffset) + ", " + (height - paddingBottom + 32) + ")";
        if (smallBlocks) {
            transform += ", rotate(10)";
        }
        if (firstType === "string") {
            svg.append("text")
                .attr("class", smallBlocks ? "axis-title-small x-axis" : "axis-title x-axis")
                .attr("transform", transform)
                .text(category.trim())
                .call(wrap, chartWidthMinusPadding);
        }
        else if (firstType === "bool") {
            if (category === "0") {
                svg.append("text")
                    .attr("class", "axis-title x-axis")
                    .attr("transform", "translate(" + (paddingLeft + xOffset) + ", " + (height - paddingBottom / 3) + ")")
                    .text(categoricalCatName + ": No")
                    .call(wrap, chartWidthMinusPadding);
            }
            else if (category === "1") {
                svg.append("text")
                    .attr("class", "axis-title x-axis")
                    .attr("transform", "translate(" + (paddingLeft + xOffset) + ", " + (height - paddingBottom / 3) + ")")
                    .text(categoricalCatName+ ": Yes")
                    .call(wrap, chartWidthMinusPadding);
            }
        }
        entryIndex++;
    }
    
    // add yAxis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + paddingLeft + ",0)")
        .call(yAxis);
    svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "translate(" + paddingLeft / 2 + ", " + height / 2 + ")rotate(-90)")
        .text(numericalCatName);
    
}

function onload() {
    d3.text(filename, function (unparsedData) {
        var rows = d3.csv.parseRows(unparsedData);
        categories.forEach(function (cat) {
            var menu_num = 1;
            if (cat["axis"] == "y") {
                menu_num = 2;
            }

            $("#dropdown-menu-" + menu_num).append(
                "<li><a class=\"dropdown-value-" + menu_num + "\" href=\"#\">" + cat["name"] + "</a></li>"
            );
        });
        categoriesArray = rows[0];
        for (category in categoriesArray) {
            // make dict mapping category names to array
            categoryNameToIndex[categoriesArray[category]] = category;
        }
            
        $('.dropdown-value-1').click(function (e) {
            e.preventDefault();
            firstCatName = $(this).text();
            $('#dropdownMenu1').html(firstCatName);
            dropdownChanged();
        });
        $('.dropdown-value-2').click(function (e) {
            e.preventDefault();
            secondCatName = $(this).text();
            $('#dropdownMenu2').html(secondCatName);
            dropdownChanged();
        });
    });
}
        
function showSuggestion(cat1, cat2) {
    firstCatName = cat1;
    secondCatName = cat2;
    $('#dropdownMenu1').html(firstCatName);
    $('#dropdownMenu2').html(secondCatName);
    dropdownChanged();
}


function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0,//parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        
        var firstWord = true;
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width && !firstWord) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
            }
            firstWord = false;
        }
    });
}
        