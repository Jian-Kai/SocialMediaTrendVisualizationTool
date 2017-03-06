var drawD3ScatterPlot = function (element, xPos, yPos, labels, params) {
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

    d3.select("#nodelink").remove();
    console.log("remove")

    var svg = element.append("svg")
        .attr("id", "nodelink")
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

    links.attr('x1', function (d) {
            return xScale(d.start[0]) + 50;
        })
        .attr('y1', function (d) {
            return yScale(d.start[1]);
        })
        .attr('x2', function (d) {
            return xScale(d.end[0]) + 50;
        })
        .attr('y2', function (d) {
            return yScale(d.end[1]);
        })
        .attr("stroke", function (d, i) {
            return "black";
        });

    console.log(link);

    var nodes = svg.selectAll("circle")
        .data(labels)
        .enter()
        .append("g");

    nodes.append("circle")
        .attr("r", pointRadius)
        .attr("cx", function (d, i) {
            return xScale(xPos[i]) + 50;
        })
        .attr("cy", function (d, i) {
            return yScale(yPos[i]);
        })
        .attr("fill", function (d, i) {
            return "rgb(0, " + (i * 10) + "," + (i * 10) + ")";
        })
        .on("mouseover", function (d, i) {
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
        .on("mouseout", function () {

            d3.select("#tooltip").classed("hidden", true);
        });
};

var drawlinechart = function (element, labels, params, standard) {

    var padding = params.padding || 32,
        w = params.w || Math.min(720, document.documentElement.clientWidth - padding),
        h = params.h || w,
        pointRadius = 5;

    var q = (standard.maxlike - standard.minlike) / 4;
    var like_rank = [standard.minlike, Math.floor(standard.minlike + q), Math.floor(standard.minlike + 2 * q), Math.floor(standard.minlike + 3 * q), standard.maxlike];
    q = (standard.maxshare - standard.minshare) / 4;
    var share_rank = [standard.minshare, Math.floor(standard.minshare + q), Math.floor(standard.minshare + 2 * q), Math.floor(standard.minshare + 3 * q), standard.maxshare];
    console.log(like_rank);
    console.log(share_rank);


    d3.select("#linechart").remove();
    console.log("remove")
    h = h - 20;
    var svg = element.append("svg")
        .attr("id", "linechart")
        .attr("width", w + 100)
        .attr("height", h + 10);

    /*var rect = svg.append("rect")
        .attr("x", 50)
        .attr("y", 20)
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "white")
        .attr("stroke-width", 2.5)
        .attr("stroke", "red");*/

    var barstack = [like_rank, share_rank];

    var colors = d3.scale.category10();

    var like_scale = d3.scale.linear()
        .domain([standard.minlike, standard.maxlike])
        .range([(h - 20), 0]);

    var bar = svg.selectAll("likebar");
    var text = svg.selectAll("text");
    
    for (var n = 0; n < barstack.length; n++) {
        bar.data(barstack[n])
            .enter()
            .append("rect")
            .attr("x", function () {
                return (n + 1) * 120;
            })
            .attr("y", function (d, i) {
                return (h - ((i) * ((h - 20) / 4) + ((h - 20) / 4))) - 5;
            })
            .attr("width", 40)
            .attr("height", function (d, i) {
                if (i != 4) {
                    return (h - 20) / 4;
                }
                return 0;
            })
            .attr("fill", function (d, i) {
                return colors(i);
            })
            .on("click", function (d, i) {
                console.log(i);
            });

        text.data(barstack[n])
            .enter()
            .append("text")
            .text(function (d, i) {
                console.log(d);
                return d;
            })
            .attr("x", function () {
                return (n + 1) * 120 - 40;
            })
            .attr("y", function (d, i) {
                return (h - ((i) * ((h - 20) / 4)));
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "blzck");

    }

};