(function (timeblock) {
    timeblock.multi = function () {
        var timeblock_width, timeblock_height, padding = 10;
        var window_width = parseInt(timeblock_svg.style("width"), 10) - (padding * 2),
            window_height = parseInt(timeblock_svg.style("height"), 10) - (padding * 2);

        timeblock_width = (window_width - 5 * padding) / 6,
            timeblock_height = (window_height - padding) / 2;

        var position = [];

        for (var i = 0; i < 12; i++) {
            if (i < 6) {
                position[i] = [padding + (i * (timeblock_width + padding)), padding];
            } else {
                position[i] = [padding + ((i - 6) * (timeblock_width + padding)), padding + (timeblock_height + padding)];
            }
        }

        //console.log(position);
        return {
            "position": position,
            "timeblock_width": timeblock_width,
            "timeblock_height": timeblock_height
        };
    }

    timeblock.block = function (time_position, block_posts) {

        var root = {
            "x": time_position.timeblock_width / 2,
            "y": time_position.timeblock_height / 2,
            "r": time_position.timeblock_width / 2 - 10
        };

        timeblock_svg.selectAll("g")
            .data(time_position.position)
            .enter()
            .append("g")
            .attr("id", function (d, i) {
                return "block" + i;
            })
            .attr("class", "block")
            .append("rect")
            .attr("x", function (d) {
                return d[0];
            })
            .attr("y", function (d) {
                return d[1];
            })
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", time_position.timeblock_width)
            .attr("height", time_position.timeblock_height)
            .attr("fill", "white")
            .style("stroke-width", "1px")
            .style("stroke", "black");

        timeblock_svg.selectAll("g")
            .append("circle")
            .attr("id", "blockcenter")
            .attr("cx", function (d) {
                return d[0] + (time_position.timeblock_width / 2);
            })
            .attr('cy', function (d) {
                return d[1] + (time_position.timeblock_height / 2);
            })
            .attr("r", 20)
            .attr("fill", "gray")
            .on("click", function (d, i) {

                overview_svg.select("#posts").attr('transform', "translate(0, 0)");

                timeblock_svg.selectAll("#blockcenter").attr("fill", "gray");
                timeblock_svg.select("#block" + i).select("#blockcenter").attr("fill", "red");

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .style("opacity", function (d) {
                        if (d.created_time.getMonth() == i) {
                            return 1;
                        } else {
                            return 0.2;
                        }
                    })
                    .attr("fill", function (d) {
                        if (d.created_time.getMonth() == i) {
                            return "green";
                        } else {
                            return "red";
                        }
                    });
                overview.timeline(position, block_posts[i]);
                $("#overview").find("#posts").insertAfter($("#overview").find("#timecurve"));
                overview.daybar(block_posts[i]);
            });


        timeblock_svg.selectAll(".block")
            .append("g")
            .attr("id", "posts")
            .selectAll("circle")
            .data(function (d, i) {
                return block_posts[i];
            })
            .enter()
            .append("circle")
            .attr("id", function (d) {
                return "block_posts" + d.id;
            })
            .attr("cx", function (d, j) {
                return Math.cos((j * (360 / block_posts[d.created_time.getMonth()].length)) * (Math.PI / 180)) * root.r + time_position.position[d.created_time.getMonth()][0] + root.x;
            })
            .attr("cy", function (d, j) {
                return Math.sin((j * (360 / block_posts[d.created_time.getMonth()].length)) * (Math.PI / 180)) * root.r + time_position.position[d.created_time.getMonth()][1] + root.y;
            })
            .attr("r", 2.5)
            .attr("fill", function (d) {
                //return (seven_color[d.post.created_time.getDay()]);
                return "gray";
            })
            .on("mouseover", function (d, i) {
                d3.select("#timecurve")
                    .select("#link_" + d.post + "_" + (d.post + 1))
                    .attr("stroke", "yellow")
                    .attr("stroke-width", "4px");

                d3.select("#timecurve")
                    .select("#link_" + (d.post - 1) + "_" + d.post)
                    .attr("stroke", "yellow")
                    .attr("stroke-width", "4px");
            })
            .on("mouseout", function () {
                d3.select("#timecurve")
                    .selectAll("path")
                    .attr("stroke", "green")
                    .attr("stroke-width", "0px");
            });

        timeblock_svg.selectAll(".block")
            .append("g")
            .attr("id", "paths")
            .selectAll("path")
            .data(function (d, i) {
                return block_posts[i];
            })
            .enter()
            .append("path")
            .attr("id", function (d) {
                return "block_path" + d.id;
            })
            .attr("d", function (d, j) {
                var x1 = Math.cos((j * (360 / block_posts[d.created_time.getMonth()].length)) * (Math.PI / 180)) * root.r + time_position.position[d.created_time.getMonth()][0] + root.x,
                    y1 = Math.sin((j * (360 / block_posts[d.created_time.getMonth()].length)) * (Math.PI / 180)) * root.r + time_position.position[d.created_time.getMonth()][1] + root.y;
                var start = "M " + x1 + " " + y1;
                var endX = (root.r * x1 - line_scale(d.log_comment) * (x1 - (time_position.position[d.created_time.getMonth()][0] + root.x))) / root.r,
                    endY = (root.r * y1 - line_scale(d.log_comment) * (y1 - (time_position.position[d.created_time.getMonth()][1] + root.y))) / root.r;
                var end = "L " + endX + " " + endY;
                var road = start + " " + end;
                return road;
            })
            .style("stroke-width", 2)
            .style("stroke", function (d) {
                return "gray";
                //return color(assignments[d.index]);
                //return (seven_color[d.post.created_time.getDay()]);
            }).on("mouseover", function (d, i) {
                d3.select("#timecurve")
                    .select("#link_" + d.post + "_" + (d.post + 1))
                    .attr("stroke-width", "4px")
                    .attr("stroke", "yellow");

                d3.select("#timecurve")
                    .select("#link_" + (d.post - 1) + "_" + d.post)
                    .attr("stroke-width", "4px")
                    .attr("stroke", "yellow");
            })
            .on("mouseout", function () {
                d3.select("#timecurve")
                    .selectAll("path")
                    .attr("stroke-width", "0px")
                    .attr("stroke", "green");
            });



    }

    timeblock.pie = function (time_position, block_posts) {
        var date = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var stack = [];

        //console.log(block_posts);

        for (var i = 0; i < block_posts.length; i++) {
            let array = new Array(date[i]);
            for (var j = 0; j < array.length; j++) {
                array[j] = [];
            }
            for (var j = 0; j < block_posts[i].length; j++) {
                array[block_posts[i][j].created_time.getDate() - 1].push(block_posts[i][j]);
            }

            stack.push(array);
        }

        var max = d3.max(stack, function (d) {
            return d3.max(d, function (i, j) {

                var temp = 0;
                for (var k = 0; k < i.length; k++) {
                    temp += i[k].log_comment;
                }

                return temp;
            })
        })

        var min = d3.min(stack, function (d) {
            return d3.min(d, function (i, j) {

                var temp = 0;
                for (var k = 0; k < i.length; k++) {
                    temp += i[k].log_comment;
                }

                return temp;
            })
        })

        //pie(stack[0]);
        //console.log(stack);

        var radio = d3.scaleLinear().domain([min, max]).range([10, (time_position.timeblock_width * 0.5)]);

        var arc = d3.arc()
            .startAngle(function (d) {
                var angle = 360 / date[d.created_time.getMonth()];
                return ((d.created_time.getDate() - 1) * angle) * (Math.PI / 180);
            })
            .endAngle(function (d) {
                var angle = 360 / date[d.created_time.getMonth()];
                return ((d.created_time.getDate()) * angle) * (Math.PI / 180);
            })
            .innerRadius(function (d, i) {
                var mon = d.created_time.getMonth(),
                    date = d.created_time.getDate() - 1;

                if (i == 0) {
                    return 10;
                } else {
                    var temp = 0;
                    for (var j = 0; j < i; j++) {
                        temp += (stack[mon][date][j].log_comment);
                    }
                    //return (i - 1) * 15 + 20;
                    return radio(temp);
                }
            })
            .outerRadius(function (d, i) {
                var mon = d.created_time.getMonth(),
                    date = d.created_time.getDate() - 1;
                //console.log(i);
                if (i == 0) {
                    //return 20;
                    return radio(d.log_comment);
                } else {
                    var temp = 0;
                    for (var j = 0; j < i; j++) {
                        temp += (stack[mon][date][j].log_comment);
                    }
                    //return i * 15 + 20;
                    return radio(temp + d.log_comment);;
                }

            });

        timeblock_svg.selectAll("g")
            .data(time_position.position)
            .enter()
            .append("g")
            .attr("id", function (d, i) {
                return "block" + i;
            })
            .attr("class", "block")
            .append("rect")
            .attr("x", function (d) {
                return d[0];
            })
            .attr("y", function (d) {
                return d[1];
            })
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", time_position.timeblock_width)
            .attr("height", time_position.timeblock_height)
            .attr("fill", "white")
            .style("stroke-width", "1px")
            .style("stroke", "black");


        timeblock_svg.selectAll(".block")
            .append("g")
            .attr("transform", function (d, i) {
                return "translate(" + (d[0] + (time_position.timeblock_width / 2)) + "," + (d[1] + (time_position.timeblock_height / 2)) + ")"
            })
            .attr("id", "postsunbust")
            .selectAll("g")
            .data(function (d, i) {
                return (stack[i]);
            })
            .enter()
            .append("g")
            .attr("id", function (d, i) {
                return "Date" + i;
            })
            .selectAll("path")
            .data(function (d, i) {
                //console.log(d)
                return d;
            })
            .enter()
            .append("path")
            .attr("d", function (d, i) {
                //console.log(i);
                return arc(d, i);
            })
            .attr("fill", function (d, i) {
                return color_scale(d.log_comment);
            })
            .attr("stroke", "black")
            .on("click", function (d, i) {
                //console.log(d);
                //console.log(i)

                d3.select("#timecurve").selectAll("path").attr("stroke-width", "0px")

                var postcir = overview_svg.select("#posts");

                postcir.selectAll("circle").attr("r", 4).style("opacity", 0.2);

                postcir.select("#post_" + d.post).attr("r", 8).style("opacity", 1);
                postcir.select("#post_" + (d.post - 1)).attr("r", 8).style("opacity", 1);
                postcir.select("#post_" + (d.post + 1)).attr("r", 8).style("opacity", 1);

                d3.select("#timecurve")
                    .select("#link_" + d.post + "_" + (d.post + 1))
                    .attr("stroke-width", "4px")

                d3.select("#timecurve")
                    .select("#link_" + (d.post - 1) + "_" + d.post)
                    .attr("stroke-width", "4px")

                button.detial(d);


            })

    }
})(window.timeblock = window.timeblock || {});