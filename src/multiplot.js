(function (multiplot) {
    multiplot.plot = function (pos, classify, position) {
        console.log(pos);
        var start = 300;

        var root = {
            "x": 75,
            "y": 75,
            "r": 60
        };

        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";


        xScale.range([10, 140]);
        yScale.range([10, 140]);

        d3.select("#svg2").selectAll("rect")
            .data(pos)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return d.x;
            })
            .attr("y", function (d, i) {
                return d.y;
            })
            .attr("id", function (d, i) {
                return "month" + i;
            })
            .attr("width", 150)
            .attr("height", 150)
            .attr("fill", "white");

        d3.select("#svg2").selectAll("#center")
            .data(pos)
            .enter()
            .append("circle")
            .attr("id", "center")
            .attr("cx", function (d) {
                return d.x + root.x;
            })
            .attr("cy", function (d) {
                return d.y + root.y;
            })
            .attr("name", function(d, i){
                return "center" + i;
            })
            .attr("r", 20)
            .attr("fill", "gray")
            .on("mouseover", function (d, i) {
                console.log(classify[i].length);

                //===========================AVG==========================================================
                var avglike = 0,
                    avgshare = 0,
                    avgcomment = 0;

                for (var j = 0; j < classify[i].length; j++) {
                    avglike += classify[i][j].post.like;
                    avgshare += classify[i][j].post.share; {}
                    avgcomment += classify[i][j].post.comment;
                }

                avglike = Math.round(avglike / classify[i].length);
                avgshare = Math.round(avgshare / classify[i].length);
                avgcomment = Math.round(avgcomment / classify[i].length);
                //===========================AVG==========================================================

                if (i == 11 || i == 5) {
                    var xPosition = d.x + root.x + 250 - 125;
                    var yPosition = d.y + root.y
                } else {
                    //Get this bar's x/y values, then augment for the tooltip
                    var xPosition = d.x + root.x + 250;
                    var yPosition = d.y + root.y;
                }


                //Update the tooltip position and value
                var tooltip = d3.select("#tooltip")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px");

                tooltip.select("#month")
                    .text(month[i])
                tooltip.select("#value")
                    .text(classify[i].length + " posts.");
                tooltip.select("#like")
                    .text(avglike);
                tooltip.select("#share")
                    .text(avgshare);
                tooltip.select("#comment")
                    .text(avgcomment);

                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);

            })
            .on("mouseout", function () {

                //Hide the tooltip
                d3.select("#tooltip").classed("hidden", true);

            })
            .on("click", function (d, i) {

                console.log(i);
                if (!select[i]) {
                    if (select_rect.length < 2) {
                        select[i] = true;
                        select_rect.push(i);
                        if(select_rect.length == 2)
                            d3.select(this).attr("fill", "blue");
                        else
                            d3.select(this).attr("fill", "red");
                    }
                } else {
                    select[i] = false;
                    for (var j = 0; j < select_rect.length; j++) {
                        if (select_rect[j] == i) {
                            select_rect.splice(j, 1);
                        }
                    }
                    d3.select(this).attr("fill", "gray");
                    var center = d3.selectAll("#center")._groups;
                    //console.log(center[0][select_rect[0]]);
                    d3.select(center[0][select_rect[0]]).attr("fill", "red");
                        
                }
                console.log(select_rect);
                multiplot.selerect(select_rect, classify, position);
            });


        for (var i = 0; i < pos.length; i++) {
            /*
            d3.select("#svg2")
                .selectAll("#circle" + i)
                .data(classify[i])
                .enter()
                .append("circle")
                .attr("id", "#circle" + i)
                .attr("cx", function (d) {
                    return xScale(position[0][d.index]) + pos[i].x;
                })
                .attr("cy", function (d) {
                    return yScale(position[1][d.index]) + pos[i].y;
                })
                .attr("r", 2)
                .attr("fill", function (d) {
                    return color(assignments[d.index]);
                })
                .on("click", function (d) {
                    console.log(d);
                })
            */

            d3.select("#svg2")
                .selectAll("#circle" + i)
                .data(classify[i])
                .enter()
                .append("circle")
                .attr("id", "#circle" + i)
                .attr("cx", function (d, j) {
                    return Math.cos((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].x + root.x;
                })
                .attr("cy", function (d, j) {
                    return Math.sin((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].y + root.y;
                })
                .attr("r", 2)
                .attr("fill", function (d) {
                    //return color(assignments[d.index]);
                    return "gray";
                })
                .on("click", function (d) {
                    console.log(d);
                })
            var count = [];
            for (var k = 0; k < classify[i].length; k++) {
                count.push(classify[i][k].post.log_comment);
            }

            var scale = d3.scaleLinear()
                .range([0, 35])
                .domain([d3.min(count), d3.max(count)]);

            d3.select("#svg2")
                .selectAll("path" + i)
                .data(classify[i])
                .enter()
                .append("path")
                .attr("d", function (d, j) {
                    var start = "M " + (Math.cos((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].x + root.x) + " " + (Math.sin((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].y + root.y);
                    var x1 = (Math.cos((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].x + root.x),
                        y1 = (Math.sin((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].y + root.y);
                    var endX = (root.r * x1 - scale(d.post.log_comment) * (x1 - (pos[i].x + root.x))) / root.r,
                        endY = (root.r * y1 - scale(d.post.log_comment) * (y1 - (pos[i].y + root.y))) / root.r;
                    var end = "L " + endX + " " + endY;
                    var road = start + " " + end;
                    return road;
                })
                .attr("id", "path" + i)
                .style("stroke-width", 2)
                .style("stroke", function (d) {
                    //return color(assignments[d.index]);
                    return "gray";
                });

        }

    }

    multiplot.selerect = function (select_rect, classify, position) {
        if (select_rect.length <= 0) {
            alert("No select");
            d3.select("#svg3").selectAll("circle").remove();
            return;
        }
        var seleposts = [];
        var M = classify[select_rect[0]].length;

        for (var i = 0; i < select_rect.length; i++) {
            for (var j = 0; j < classify[select_rect[i]].length; j++) {
                seleposts.push(classify[select_rect[i]][j].post);
            }
        }
        console.log(seleposts);
        var dis = dissimilar.distance(seleposts, null);
        console.log(dis);

        var P = mds.classic(dis);
        P = numeric.transpose(P);
        console.log(P);

        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var x = d3.scaleLinear()
            .range([25, (window_height / 2) * 9 / 10 - 25])
            .domain([Math.min.apply(null, P[0]), Math.max.apply(null, P[0])]);

        var y = d3.scaleLinear()
            .range([25, (window_height / 2) * 9 / 10 - 25])
            .domain([Math.min.apply(null, P[1]), Math.max.apply(null, P[1])]);


        var svg = d3.select("#svg3");

        svg.selectAll("circle").remove();

        svg.selectAll("circle")
            .data(seleposts)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return x(P[0][i]) + 300;
            })
            .attr("cy", function (d, i) {
                return y(P[1][i]);
            })
            .attr("r", 2.5)
            .attr("fill", function (d, i) {
                if (i < M) {
                    return 'red';
                } else {
                    return 'blue';
                }
            })
    }



    multiplot.multi = function (pagging, posts, width, height) {


        console.log(pagging);
        console.log(posts);
        var length = posts.length;

        var h = 150,
            w = 150;

        var pos = [];

        for (var j = 0; j < 2; j++) {
            for (var i = 0; i < length / 2; i++) {
                var x, y;

                x = i * (w + pagging) + pagging;
                y = j * (h + pagging);

                pos.push({
                    "x": x,
                    "y": y
                });
                select.push(false);
            }
        }

        return pos;
    }

    multiplot.highlight = function (select) {
        console.log("select");
        var high = d3.select("#svg2").selectAll("circle")._groups[0];
        d3.select("#svg2").selectAll("circle").attr("fill", "gray").attr("r", 2.5);
        d3.select("#svg2").selectAll("#center").attr("fill", "gray").attr("r", 20);
        //console.log(high);
        for (var i = 0; i < select.length; i++) {
            for (var j = 0; j < high.length; j++) {
                if (select[i].__data__ === high[j].__data__.post) {
                    d3.select(high[j]).attr("fill", "red").attr("r", 3.5);
                }
            }
        }
    }

}(window.multiplot = window.multiplot || {}));