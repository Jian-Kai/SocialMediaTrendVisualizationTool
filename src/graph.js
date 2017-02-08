var drawD3ScatterPlot = function(element, xPos, yPos, labels, params) {
    //Show the tooltip
    //d3.select("#tooltip").classed("hidden", true);
    params = params || {};
    var padding = params.padding || 32,
        w = params.w || Math.min(720, document.documentElement.clientWidth - padding),
        h = params.h || w,
        xDomain = [Math.min.apply(null, xPos),
            Math.max.apply(null, xPos)
        ],
        yDomain = [Math.max.apply(null, yPos),
            Math.min.apply(null, yPos)
        ],
        pointRadius = 5;

    if (params.reverseX) {
        xDomain.reverse();
    }
    if (params.reverseY) {
        yDomain.reverse();
    }

    var xScale = d3.scale.linear().
    domain(xDomain)
        .range([w - padding, padding]),

        yScale = d3.scale.linear().
    domain(yDomain)
        .range([padding, h - padding]),

        xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(0),

        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(0),

        top_xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(0),

        right_yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(0);

    d3.select("svg").remove();
    console.log("remove")

    var svg = element.append("svg")
        .attr("width", w + 100)
        .attr("height", h + 50);

    var rect = svg.append("rect")
        .attr("x", 50)
        .attr("y", 20)
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "white")
        .attr("stroke-width", 2.5)
        .attr("stroke", "black");

    /*svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 50 + "," + (h - 2 * pointRadius) + ")")
        .attr("stroke-width", 5)
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (padding) + ",0)")
        .attr("stroke-width", 5)
        .call(yAxis);*/

    var link = [];
    for (var i = 0; i < labels.length - 1; i++) {
        var start = [xPos[i], yPos[i]],
            end = [xPos[i + 1], yPos[i + 1]]
        link.push({
            "start": start,
            "end": end
        });
    }

    var links = svg.selectAll("link")
        .data(link)
        .enter()
        .append("line");

    links.attr('x1', function(d) {
            return xScale(d.start[0]) + 50;
        })
        .attr('y1', function(d) {
            return yScale(d.start[1]);
        })
        .attr('x2', function(d) {
            return xScale(d.end[0]) + 50;
        })
        .attr('y2', function(d) {
            return yScale(d.end[1]);
        })
        .attr("stroke", function(d, i) {
            return "black";
        });

    console.log(link);

    var nodes = svg.selectAll("circle")
        .data(labels)
        .enter()
        .append("g");

    nodes.append("circle")
        .attr("r", pointRadius)
        .attr("cx", function(d, i) {
            return xScale(xPos[i]) + 50;
        })
        .attr("cy", function(d, i) {
            return yScale(yPos[i]);
        })
        .attr("fill", function(d, i) {
            return "rgb(0, " + (i * 10) + "," + (i * 10) + ")";
        })
        .on("mouseover", function(d, i) {
            var xPosition = parseFloat(d3.select(this).attr("cx"));
            var yPosition = parseFloat(d3.select(this).attr("cy"));
            console.log(i);
            var info = d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px");
            console.log(d);
            info.select("#postid")
                .text(d.post);
            document.getElementById("link").href = "http://facebook.com/" + d.id;
            info.select("#link")
                .text(d.id);
            info.select("#created_time")
                .text(d.created_time);
            info.select("#type")
                .text(d.type);
            info.select("#message")
                .text(d.message);
            info.select("#likes")
                .text(d.like);
            info.select("#emotions")
                .text(d.emotion);
            info.select("#comments")
                .text(d.comment);
            info.select("#shares")
                .text(d.share);
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function() {

            d3.select("#tooltip").classed("hidden", true);
        });
};

var drawlinechart = function(element, labels, params) {

    var padding = params.padding || 32,
        w = params.w || Math.min(720, document.documentElement.clientWidth - padding),
        h = params.h || w,
        pointRadius = 5;

    var svg = element.append("svg")
        .attr("width", w + 100)
        .attr("height", h + 50);

    var rect = svg.append("rect")
        .attr("x", 50)
        .attr("y", 20)
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "white")
        .attr("stroke-width", 2.5)
        .attr("stroke", "red");

    var posX = [],
        posY = [];

    for (var i = 0; i < labels.length; i++) {
        posX.push(i);
        posY.push(labels[i].comment);
    }

    var link = [];
    for (var i = 0; i < labels.length - 1; i++) {
        var start = [posX[i], posY[i]],
            end = [posX[i + 1], posY[i + 1]]
        link.push({
            "start": start,
            "end": end
        });
    }
    //console.log(posY);

    var xScale = d3.scale.linear()
        .domain([Math.min.apply(null, posX),
            Math.max.apply(null, posX)
        ])
        .range([w - padding, padding]),

        yScale = d3.scale.linear()
        .domain([Math.max.apply(null, posY),
            Math.min.apply(null, posY)
        ])
        .range([padding, h - padding]);

    var links = svg.selectAll("link")
        .data(link)
        .enter()
        .append("line");

    links.attr('x1', function(d) {
            return xScale(d.start[0]) + 50;
        })
        .attr('y1', function(d) {
            return yScale(d.start[1]);
        })
        .attr('x2', function(d) {
            return xScale(d.end[0]) + 50;
        })
        .attr('y2', function(d) {
            return yScale(d.end[1]);
        })
        .attr("stroke", function(d, i) {
            return "black";
        });

    var nodes = svg.selectAll("circle")
        .data(labels)
        .enter()
        .append("g");

    nodes.append("circle")
        .attr("r", pointRadius)
        .attr("cx", function(d, i) {
            return xScale(posX[i]) + 50;
        })
        .attr("cy", function(d, i) {
            return yScale(posY[i]);
        })
        .attr("fill", function(d, i) {
            return "blue";
        })

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(15);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (padding) + ",0)")
        .attr("stroke-width", 5)
        .call(yAxis);

};
