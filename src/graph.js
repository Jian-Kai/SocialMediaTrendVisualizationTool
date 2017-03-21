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
        .range([h - padding, padding]);

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

    /*var links = svg.selectAll("link")
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
        */
    console.log(link);

    var nodes = svg.selectAll("circle")
        .data(labels)
        .enter();

    nodes.append("circle")
        .attr("r", pointRadius)
        .attr("cx", function (d, i) {
            return xScale(xPos[i]) + 50;
        })
        .attr("cy", function (d, i) {
            return yScale(yPos[i]);
        })
        .attr("fill", function (d, i) {
            return "blue";
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

    var q_pos = [];
    q_pos[0] = (labels.length + 1) / 4;
    q_pos[1] = (labels.length + 1) / 2;
    q_pos[2] = 3 * (labels.length + 1) / 4;

    labels.sort(function (a, b) {
        return new Date(a.like) - new Date(b.like);
    });

    var like_rank = [];
    like_rank[0] = standard.minlike;
    like_rank[4] = standard.maxlike + 1;
    for (var i = 0; i < q_pos.length; i++) {
        var ind = Math.floor(q_pos[i]),
            per = q_pos[i] % 1;
        console.log(ind);
        like_rank[i + 1] = labels[ind].like + ((labels[ind + 1].like - labels[ind].like) * per);
    }

    labels.sort(function (a, b) {
        return new Date(a.share) - new Date(b.share);
    });

    var share_rank = [];
    share_rank[0] = standard.minshare;
    share_rank[4] = standard.maxshare + 1;
    for (var i = 0; i < q_pos.length; i++) {
        var ind = Math.floor(q_pos[i]),
            per = q_pos[i] % 1;
        console.log(ind);
        share_rank[i + 1] = labels[ind].share + ((labels[ind + 1].share - labels[ind].share) * per);
    }

    var hour_rank = [7, 11, 14, 17, 20, 24];

    d3.select("#linechart").remove();
    console.log("remove")
    h = h - 20;
    var svg = element.append("svg")
        .attr("id", "linechart")
        .attr("width", w + 100)
        .attr("height", h + 10);


    //=======================bar struct=============================
    var likebar = [],
        sharebar = [],
        hourbar = [];

    for (var i = 0; i < like_rank.length; i++) {
        likebar.push({
            "down": like_rank[i],
            "top": like_rank[i + 1],
            "type": "like"
        });
    }
    for (var i = 0; i < share_rank.length; i++) {
        sharebar.push({
            "down": share_rank[i],
            "top": share_rank[i + 1],
            "type": "share"
        });
    }

    var barstack = [likebar, sharebar];
    //===============================================================

    var colors = d3.scale.category10();

    var bar = svg.selectAll("rect");
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
                //console.log(d.down);
                //console.log(d.top);

                /*console.log(d3.select(this));
                d3.select(this)
                  .attr("fill", "white");*/

                var node = d3.select("#nodelinkSvg")
                    .selectAll("circle");
                var down = d.down,
                    top = d.top;
                var count = false;
                console.log(node);
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].type == d.type) {
                        count = true;
                    }
                }
                if (!count) {
                    temp.push({
                        "type": d.type
                    });
                }

                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].type == d.type) {
                        temp[i].down = down;
                        temp[i].top = top;
                    }
                }


                for (var i = 0; i < node[0].length; i++) {
                    var color = [0, 0, 0];
                    for (var j = 0; j < temp.length; j++) {
                        if (temp[j].type == ('like')) {
                            if ((node[0][i].__data__.like - 1) < temp[j].top && (node[0][i].__data__.like - 1) >= temp[j].down) {
                                //console.log(d3.select(node[0][i])[0][0].attributes.fill.value); 
                                color[0] = 255;
                            }
                        }
                        if (temp[j].type == ('share')) {
                            if ((node[0][i].__data__.share - 1) < temp[j].top && (node[0][i].__data__.share - 1) >= temp[j].down) {
                                //console.log(d3.select(node[0][i])[0][0].attributes.fill.value);
                                color[1] = 255;
                            }
                        }
                    }
                    d3.select(node[0][i])
                        .attr("fill", "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")");
                }
            });

        text.data(barstack[n])
            .enter()
            .append("text")
            .text(function (d, i) {
                return d.down;
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

    var pie = d3.layout.pie()
                .value(function(d){
                    return d.value;
                });

    for (var i = 0; i < hour_rank.length; i++) {
        if (i != 0) {
            hourbar.push({
                "value" : hour_rank[i] - hour_rank[i - 1],
                "start" : hour_rank[i - 1], 
                "end" : hour_rank[i]
            });
        } else {
             hourbar.push({
                "value" : 7,
                "start" : hour_rank[hour_rank.length - 1], 
                "end" : hour_rank[i]
            });
        }
    }


    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius((h - 20) / 3);

    hourbar = pie(hourbar);

    var arcs = svg.selectAll("g")
        .data(hourbar)
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + ((h - 20) / 3 + 3 * 120) + "," + ((h - 20) / 2) + ")");

    arcs.append("path")
        .attr("fill", function (d, i) {
            return colors(i);
        })
        .attr("d", arc)
        .on("click", function (d, i) {
            console.log(d);
        });
};