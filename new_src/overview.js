(function (overview) {
    overview.distance = function (posts) {
        var distance_matrix = [];
        for (var i = 0; i < posts.length; i++) {
            distance_matrix[i] = [];
            for (var j = 0; j < posts.length; j++) {
                distance_matrix[i][j] = 0;
            }
        }

        for (var i = 0; i < posts.length; i++) {
            for (var j = i + 1; j < posts.length; j++) {


                distance_matrix[i][j] += Math.pow((posts[i].log_comment - posts[j].log_comment), 2);
                distance_matrix[i][j] += Math.pow((posts[i].log_like - posts[j].log_like), 2);
                distance_matrix[i][j] += Math.pow((posts[i].log_share - posts[j].log_share), 2);
                distance_matrix[i][j] += Math.pow((posts[i].message_length - posts[j].message_length), 2);
                distance_matrix[i][j] += Math.pow((posts[i].total_reply - posts[j].total_reply), 2);


                distance_matrix[i][j] = Math.sqrt(distance_matrix[i][j]);
                distance_matrix[j][i] = distance_matrix[i][j];
            }
        }

        //console.log(distance_matrix);

        var Y = mds.classic(distance_matrix);
        //console.log(Y);

        //==========================t-sne==========================================================
        var opt = {}
        opt.epsilon = 10; // epsilon is learning rate (10 = default)
        opt.perplexity = 15; // roughly how many neighbors each point influences (30 = default)
        opt.dim = 2; // dimensionality of the embedding (2 = default)

        var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

        tsne.initDataDist(distance_matrix, Y);


        for (var k = 0; k < 1000; k++) {
            tsne.step(); // every time you call this, solution gets better
        }

        var P = tsne.getSolution(); // Y is an array of 2-D points that you can plot
        //==========================t-sne==========================================================

        //console.log((P));

        //var P = mds.classic(dis_distance);
        var Positions = numeric.transpose(P);

        //console.log(Positions);

        return Positions;
    }

    overview.rander = function (position) {

        var x = position[0],
            y = position[1];

        Xscale = d3.scaleLinear().domain([d3.min(x), d3.max(x)]).range([40, parseInt(overview_svg.style("width"), 10) - 40]);
        Yscale = d3.scaleLinear().domain([d3.max(y), d3.min(y)]).range([40, parseInt(overview_svg.style("height"), 10) - 40]);


        overview_svg.append("g")
            .attr("id", "posts")
            .selectAll("circle")
            .data(posts)
            .enter()
            .append("circle")
            .attr("class", "post_node")
            .attr("cx", function (d, i) {
                return Xscale(position[0][i]);
            })
            .attr("cy", function (d, i) {
                return Yscale(position[1][i]);
            })
            .attr("r", 4)
            .attr("fill", "red")
            .style("opacity", 1)
            .on("mouseover", function (d, i) {

                d3.select("#timecurve")
                    .select("#link_" + d.post + "_" + (d.post + 1))
                    .attr("stroke-width", "4px");

                d3.select("#timecurve")
                    .select("#link_" + (d.post - 1) + "_" + d.post)
                    .attr("stroke-width", "4px");
            })
            .on("mouseout", function () {
                d3.select("#timecurve")
                    .selectAll("path")
                    .attr("stroke-width", "1px");
            });

    }


    overview.timeline = function (position, timeblock) {

        overview_svg.select("#timecurve").remove();

        var time = [];
        for (var i = 0; i < timeblock.length - 1; i++) {
            time.push({
                "start": timeblock[i],
                "end": timeblock[i + 1],
            });
        }

        var color = d3.scaleLinear().domain([1, timeblock.length])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#5D478B"), d3.rgb('#551A8B')]);


        var curve = d3.line()
            .x(function (d) {
                return d.x
            })
            .y(function (d) {
                return d.y
            })
            .curve(d3.curveBasis);


        overview_svg.append("g")
            .attr("id", "timecurve")
            .selectAll("path")
            .data(time)
            .enter()
            .append("path")
            .attr("id", function (d, i) {
                return "link_" + d.start.post + "_" + d.end.post;
            })
            .attr("d", function (d) {
                var start = [Xscale(position[0][d.start.post]), Yscale(position[1][d.start.post])],
                    end = [Xscale(position[0][d.end.post]), Yscale(position[1][d.end.post])],
                    pre = [Xscale(position[0][d.start.post - 1]), Yscale(position[1][d.start.post - 1])],
                    pov = [Xscale(position[0][d.end.post + 1]), Yscale(position[1][d.end.post + 1])];
                var m1 = [(end[0] - pre[0]), (end[1] - pre[1])],
                    m2 = [(start[0] - pov[0]), (start[1] - pov[1])];
                var D = Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2)),
                    MD1 = Math.sqrt(Math.pow(m1[0], 2) + Math.pow(m1[1], 2)),
                    MD2 = Math.sqrt(Math.pow(m2[0], 2) + Math.pow(m2[1], 2));

                //console.log(D);

                var line;

                if (d.start.post == 0) {
                    line = [{
                            "x": Xscale(position[0][d.start.post]),
                            "y": Yscale(position[1][d.start.post])
                        },
                        {
                            "x": end[0] + ((0.15 * D) / MD2) * m2[0],
                            "y": end[1] + ((0.15 * D) / MD2) * m2[1]
                        },
                        {
                            "x": Xscale(position[0][d.end.post]),
                            "y": Yscale(position[1][d.end.post])
                        }
                    ]
                } else if (d.end.post == 595) {
                    line = [{
                            "x": Xscale(position[0][d.start.post]),
                            "y": Yscale(position[1][d.start.post])
                        },
                        {
                            "x": start[0] + ((0.15 * D) / MD1) * m1[0],
                            "y": start[1] + ((0.15 * D) / MD1) * m1[1]
                        },
                        {
                            "x": Xscale(position[0][d.end.post]),
                            "y": Yscale(position[1][d.end.post])
                        }
                    ]
                } else {
                    line = [{
                            "x": Xscale(position[0][d.start.post]),
                            "y": Yscale(position[1][d.start.post])
                        },
                        {
                            "x": start[0] + ((0.15 * D) / MD1) * m1[0],
                            "y": start[1] + ((0.15 * D) / MD1) * m1[1]
                        },
                        {
                            "x": end[0] + ((0.15 * D) / MD2) * m2[0],
                            "y": end[1] + ((0.15 * D) / MD2) * m2[1]
                        },
                        {
                            "x": Xscale(position[0][d.end.post]),
                            "y": Yscale(position[1][d.end.post])
                        }
                    ]
                }

                return curve(line);
            })
            .attr("stroke-width", "1px")
            .attr("stroke", function (d, i) {
                return color(i);
            })
            .attr("fill", "none");

        
        // return time;
    }
})(window.overview = window.overview || {});