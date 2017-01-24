(function(mds) {
    "use strict";
    /// given a matrix of distances between some points, returns the
    /// point coordinates that best approximate the distances using
    /// classic multidimensional scaling
    mds.classic = function(distances, dimensions) {
        dimensions = dimensions || 2;

        // square distances
        var M = numeric.mul(-0.5, numeric.pow(distances, 2));

        // double centre the rows/columns
        function mean(A) {
            return numeric.div(numeric.add.apply(null, A), A.length);
        }
        var rowMeans = mean(M),
            colMeans = mean(numeric.transpose(M)),
            totalMean = mean(rowMeans);

        for (var i = 0; i < M.length; ++i) {
            for (var j = 0; j < M[0].length; ++j) {
                M[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

        // take the SVD of the double centred matrix, and return the
        // points from it
        var ret = numeric.svd(M),
            eigenValues = numeric.sqrt(ret.S);
        return ret.U.map(function(row) {
            return numeric.mul(row, eigenValues).splice(0, dimensions);
        });
    };

    /// draws a scatter plot of points, useful for displaying the output
    /// from mds.classic etc
    mds.drawD3ScatterPlot = function(element, xPos, yPos, labels, params) {
        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);
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
            .attr("stroke-width", 5)
            .attr("stroke", "red");

        /*svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 50 + "," + (h - 2 * pointRadius) + ")")
            .attr("stroke-width", 5)
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (padding) + ",0)")
            .attr("stroke-width", 5)
            .call(yAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 50 + "," + (2 * pointRadius) + ")")
            .attr("stroke-width", 5)
            .call(top_xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (w + padding) + ",0)")
            .attr("stroke-width", 5)
            .call(right_yAxis);*/

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
            .attr("stroke", function(d, i){
              console.log(i);
              return "rgb(" + (i*5) + ","+ (i*5) +",0)"
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
            .attr("fill", function(d) {
                if (d.created_time == "2016-11-19T04:00:00+0000") {
                    console.log(d.created_time);
                    return "red";
                } else {
                    return "blue";
                }
            })
            .on("click", function(d, i) {
                var info = d3.select("#tooltip");
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
                info.select("#comments")
                    .text(d.comment);
                info.select("#shares")
                    .text(d.share);
            });



    };
}(window.mds = window.mds || {}));
