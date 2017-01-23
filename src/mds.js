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
            .range([padding, w - padding]),

            yScale = d3.scale.linear().
        domain(yDomain)
            .range([padding, h - padding]),

            xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(params.xTicks || 7),

            yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(params.yTicks || 7);

        var svg = element.append("svg")
            .attr("width", w + 50)
            .attr("height", h);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 50 + "," + (h - padding + 2 * pointRadius) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (padding - 2 * pointRadius + 50) + ",0)")
            .call(yAxis);

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
            .on("click", function(d, i) {
                var info = d3.select("#tooltip");
                console.log(d);
                info.select("#postid")
                    .text(d.post);
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
