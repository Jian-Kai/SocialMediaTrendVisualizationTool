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
                var endX = (root.r * x1 - line_scale(d.log_attribute.comment) * (x1 - (time_position.position[d.created_time.getMonth()][0] + root.x))) / root.r,
                    endY = (root.r * y1 - line_scale(d.log_attribute.comment) * (y1 - (time_position.position[d.created_time.getMonth()][1] + root.y))) / root.r;
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

    timeblock.stackcal = function (block_posts, attribute) {

        var max = d3.max(stack, function (d) {
            return d3.max(d, function (i, j) {

                var temp = 0;
                for (var k = 0; k < i.length; k++) {
                    temp += i[k][attribute];
                }

                return temp;
            })
        })

        var min = d3.min(stack, function (d) {
            return d3.min(d, function (i, j) {

                var temp = 0;
                for (var k = 0; k < i.length; k++) {
                    temp += i[k][attribute];
                }

                return temp;
            })
        })

        return [min, max];
    }

    timeblock.pie = function (time_position, block_posts) {
        var date = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        var colckline = []
        for (var i = 0; i < block_posts.length; i++) {
            var mon = block_posts[i][0].created_time.getMonth(),
                year = block_posts[i][0].created_time.getFullYear();
            colckline[i] = [];
            for (var j = 0; j < date[mon]; j++) {
                var d = new Date(year + "-" + (mon + 1) + "-" + (j + 1));
                //console.log(d.getDay());

                if (d.getDay() == 0 || j == 0) {
                    colckline[i].push(d);
                }
            }
        }

        console.log(colckline);

        var range = timeblock.stackcal(block_posts, "nor_comment");
        //pie(stack[0]);

        radio = d3.scaleLinear().domain(range).range([15, (time_position.timeblock_width * 0.5)]);

        arc = d3.arc()
            .startAngle(function (d) {
                var angle = 360 / date[d.created_time.getMonth()];
                return ((d.created_time.getDate() - 1) * angle) * (Math.PI / 180);
            })
            .endAngle(function (d) {
                var angle = 360 / date[d.created_time.getMonth()];
                return ((d.created_time.getDate()) * angle) * (Math.PI / 180);
            })
            .innerRadius(function (d, i, attribute) {
                var mon = (d.created_time.getMonth() + (d.created_time.getFullYear() - 2016) * 12) - block_posts[0][0].created_time.getMonth(),
                    date = d.created_time.getDate() - 1;
                //console.log(mon);
                if (i == 0) {
                    return 15;
                } else {
                    var temp = 0;
                    for (var j = 0; j < i; j++) {
                        temp += (stack[mon][date][j][attribute]);
                    }
                    //return (i - 1) * 15 + 20;

                    return radio(temp);
                }
            })
            .outerRadius(function (d, i, attribute) {
                var mon = (d.created_time.getMonth() + (d.created_time.getFullYear() - 2016) * 12) - block_posts[0][0].created_time.getMonth(),
                    date = d.created_time.getDate() - 1;
                //console.log(i);
                if (i == 0) {
                    //return 20;
                    return radio(d[attribute]);
                } else {
                    var temp = 0;
                    for (var j = 0; j < i; j++) {
                        temp += (stack[mon][date][j][attribute]);
                    }
                    //return i * 15 + 20;
                    return radio(temp + d[attribute]);;
                }

            });

        timeblock_svg.selectAll(".block")
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
            .style("stroke", "black")
            .on("click", function (d, i) {
                if (!mode) {
                    //console.log(block_posts[i])
                    overview_svg.select("#posts").selectAll("circle").style("opacity", 0.2).attr("r", 4).attr("fill", function (d, i) {
                        return "orange";
                        //return color_scale(d.log_attribute[colorbtn]);
                    }).attr("stroke", "black");
                    timeblock_svg.selectAll("g").select("#postsunburst").selectAll("g").selectAll("path").style("opacity", 0.2).attr("fill", function (d, i) {
                        return "orange";
                        //return color_scale(d.log_attribute[colorbtn]);
                    });
                    overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px");

                    timeblock_svg.selectAll(".block").selectAll(".blockinfo").attr("fill", "white");


                    if (time_block.length < 2) {
                        time_block.push(i);
                    } else {
                        time_block[0] = time_block[1]
                        time_block[1] = i;
                    }

                    for (var k = 0; k < time_block.length; k++) {
                        for (var j = 0; j < block_posts[time_block[k]].length; j++) {
                            overview_svg.select("#posts").select("#post_" + block_posts[time_block[k]][j].post).style("opacity", 1);

                            if (k == 0) {
                                overview_svg.select("#posts").select("#post_" + block_posts[time_block[k]][j].post).attr("stroke", "red");

                            } else {
                                overview_svg.select("#posts").select("#post_" + block_posts[time_block[k]][j].post).attr("stroke", "blue");
                            }
                        }

                        if (k == 0) {
                            timeblock_svg.selectAll(".block").select("#blockinfo" + time_block[k]).attr("fill", "red");
                        } else {
                            timeblock_svg.selectAll(".block").select("#blockinfo" + time_block[k]).attr("fill", "blue");
                        }

                        timeblock_svg.select("#block" + (time_block[k])).select("#postsunburst").selectAll("g").selectAll("path").style("opacity", 1);

                    }

                    timeblock.atten();

                    var frequent = compare.frequent();
                    compare.render(frequent);

                }
            });

        //======================block info=========================================================

        timeblock_svg.selectAll(".block")
            .append("rect")
            .attr("id", function (d, i) {
                return "blockinfo" + i;
            })
            .attr("class", "blockinfo")
            .attr("x", function (d, i) {
                return d[0] + 5;
            })
            .attr("y", function (d, i) {
                return d[1] + 10;
            })
            .attr("width", time_position.timeblock_width - 10)
            .attr("height", 20)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "1.5px");

        timeblock_svg.selectAll(".block")
            .append("rect")
            .attr("id", function (d, i) {
                return "timeinfo" + i;
            })
            .attr("x", function (d) {
                return d[0] + 7;
            })
            .attr("y", function (d) {
                return d[1] + 12;
            })
            .attr("width", (time_position.timeblock_width - 10) * 0.7)
            .attr("height", 16)
            .attr("fill", "lightblue");

        timeblock_svg.selectAll(".block")
            .append("text")
            .attr("id", "dayinfo")
            .attr("x", function (d) {
                return (d[0] + 8);
            })
            .attr("y", function (d) {
                return d[1] + 12 + 14;
            })
            .attr("font-size", 12)
            .text(function (d, i) {
                var first_day = block_posts[i][0].created_time,
                    end_day = block_posts[i][block_posts[i].length - 1].created_time;
                var first_day_string = first_day.getFullYear() + '-' + (first_day.getMonth() + 1) + '-' + first_day.getDate(),
                    end_day_string = end_day.getFullYear() + '-' + (end_day.getMonth() + 1) + '-' + end_day.getDate();
                return first_day_string +'~' + end_day_string;
            });

        timeblock_svg.selectAll(".block")
            .append("text")
            .attr("id", "postnuminfo")
            .attr("x", function (d) {
                return (d[0] + 10) + (time_position.timeblock_width - 10) * 0.7;
            })
            .attr("y", function (d) {
                return d[1] + 12 + 14;
            })
            .attr("font-size", 12)
            .text(function (d, i) {
                return block_posts[i].length + " posts";
            })

        var calender = timeblock_svg
            .selectAll(".block")
            .append("g")
            .attr("id", function (d, i) {
                return "calender" + i;
            });

        calender.append("circle")
            .attr("id", "clockcir")
            .attr("cx", function (d) {
                return d[0] + (time_position.timeblock_width / 2);
            })
            .attr("cy", function (d) {
                return d[1] + (time_position.timeblock_height / 2);
            })
            .attr("r", 12)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        calender.selectAll("#clockline")
            .data(function (d, i) {
                return colckline[i];
            })
            .enter()
            .append("line")
            .attr("id", "clockline")
            .attr("x1", function (d, i) {
                var mon = (d.getMonth() + (d.getFullYear() - 2016) * 12) - block_posts[0][0].created_time.getMonth()
                return time_position.position[mon][0] + (time_position.timeblock_width / 2);
            })
            .attr("y1", function (d, i) {
                var mon = (d.getMonth() + (d.getFullYear() - 2016) * 12) - block_posts[0][0].created_time.getMonth()
                return time_position.position[mon][1] + (time_position.timeblock_height / 2);
            })
            .attr("x2", function (d, i) {
                var angle = 360 / date[d.getMonth()];
                var pos = 12 * Math.cos(((d.getDate() - 1) * angle + (270 + angle / 2)) * (Math.PI / 180));
                var mon = (d.getMonth() + (d.getFullYear() - 2016) * 12) - block_posts[0][0].created_time.getMonth()
                return time_position.position[mon][0] + (time_position.timeblock_width / 2) + pos;
            })
            .attr("y2", function (d, i) {
                var angle = 360 / date[d.getMonth()];
                var pos = 12 * Math.sin(((d.getDate() - 1) * angle + (270 + angle / 2)) * (Math.PI / 180));
                var mon = (d.getMonth() + (d.getFullYear() - 2016) * 12) - block_posts[0][0].created_time.getMonth()
                return time_position.position[mon][1] + (time_position.timeblock_height / 2) + pos;
            })
            .attr("stroke", function (d, i) {
                if (d.getDate() == 1) {
                    return "orange";
                } else
                    return "black";
            })
            .attr("stroke-width", "1.5px");





        //======================pie=========================================================

        timeblock_svg.selectAll(".block")
            .append("g")
            .attr("transform", function (d, i) {
                return "translate(" + (d[0] + (time_position.timeblock_width / 2)) + "," + (d[1] + (time_position.timeblock_height / 2)) + ")"
            })
            .attr("id", "postsunburst")
            .selectAll(".date")
            .data((d, i) => {
                return stack[i];
            })
            .enter()
            .append("g")
            .attr("id", function (d, i) {
                return "Date" + i;
            })
            .attr("class", "date")
            .selectAll("path")
            .data(function (d, i) {
                //console.log(d)
                return d;
            })
            .enter()
            .append("path")
            .attr("d", function (d, i) {
                //console.log(i);
                return arc(d, i, "nor_comment");
            })
            .attr("id", function (d, i) {
                return "post_" + d.post;
            })
            .attr("fill", function (d, i) {
                return "orange";
                //return color_scale(d.log_attribute.comment);
            })
            .attr("stroke", "black")
            .on("click", function (d, i) {
                console.log(d3.select(this));
                console.log(d);
                //console.log(i)
                if (mode) {
                    if (d3.select(this).style("opacity") != 0.2) {

                        var postcir = overview_svg.select("#posts");

                        postcir.selectAll("circle").attr("r", 4).style("opacity", 0.2);


                        for (var i = 0; i < brush_select.length; i++) {
                            d3.select(brush_select[i].post).style("opacity", 1);
                        }

                        overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px")

                        postcir.select("#post_" + d.post).attr("r", 8);
                        postcir.select("#post_" + (d.post - 1)).attr("r", 8).style("opacity", 1);
                        postcir.select("#post_" + (d.post + 1)).attr("r", 8).style("opacity", 1);


                        overview_svg.select("#timecurve")
                            .select("#link_" + d.post + "_" + (d.post + 1))
                            .attr("stroke-width", "4px");

                        overview_svg.select("#timecurve")
                            .select("#link_" + (d.post - 1) + "_" + d.post)
                            .attr("stroke-width", "4px");

                        button.detial([posts[d.post - 1], d, posts[d.post + 1]]);

                    }
                }
            });

    }

    timeblock.atten = function () {
        //console.log(time_block);
        brush_block = []
        for (var i = 0; i < time_block.length; i++) {
            for (var j = 0; j < block_posts[time_block[i]].length; j++) {
                brush_block.push({
                    "post": block_posts[time_block[i]][j],
                    "index": i
                })
            }
        }

        console.log(brush_block);

        button.Attention();
    }

    timeblock.calenderview = function (time_position, block_posts) {

        var range = timeblock.stackcal(block_posts, "nor_comment");

        var max = d3.max(stack, function (d) {
            return d3.max(d, function (i, j) {

                var temp = 0;
                for (var k = 0; k < i.length; k++) {
                    temp += i[k].log_attribute.comment;
                }

                return temp;
            })
        })

        var min = d3.min(stack, function (d) {
            return d3.min(d, function (i, j) {

                var temp = 0;
                for (var k = 0; k < i.length; k++) {
                    temp += i[k].log_attribute.comment;
                }

                return temp;
            })
        })

        var scale = d3.scaleLinear()
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#FFC1E0"), d3.rgb('#D9006C')])
            //.range([ "yellow", "red"])
            .domain([min, max]);

        timeblock_svg.selectAll(".block")
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
            .style("stroke", "black")

        console.log(stack);

        var first_day = []
        for (var i = 0; i < stack.length; i++) {
            var day = new Date("2016-" + (i + 1) + "-01");
            first_day.push(day.getDay());
        }
        console.log(first_day);

        var day_edge_len = (time_position.timeblock_width * 0.8) / 7;
        console.log(time_position.timeblock_width * 0.1);

        timeblock_svg.selectAll(".block")
            .selectAll("#day")
            .data(function (d, i) {
                return stack[i];
            })
            .enter()
            .append("rect")
            .attr("id", "day")
            .attr("x", function (d, i) {
                var month = d3.select(this.parentNode).attr("id")
                month = month.slice(5, month.length);
                //console.log(month);
                var date = new Date("2016-" + (parseInt(month) + 1) + "-" + (i + 1));
                //console.log(date);

                var day = date.getDay();
                //console.log(day);

                return (time_position.timeblock_width * 0.1) + time_position.position[parseInt(month)][0] + (day_edge_len * day);
            })
            .attr("y", function (d, i) {
                var month = d3.select(this.parentNode).attr("id")
                month = month.slice(5, month.length);
                var date = new Date("2016-" + (parseInt(month) + 1) + "-" + (i + 1)).getDate();

                //console.log(Math.ceil((date + first_day[month]) / 7));

                return 40 + time_position.position[parseInt(month)][1] + (20 * Math.ceil((date + first_day[month]) / 7));
            })
            .attr("width", day_edge_len - 3)
            .attr("height", day_edge_len - 3)
            .attr("fill", function (d) {

                var temp = 0;
                for (var i = 0; i < d.length; i++) {
                    temp += d[i].log_attribute.comment;
                }

                return scale(temp);
            })
            .style("stroke-width", "1px")
            .style("stroke", function (d, i) {
                var month = d3.select(this.parentNode).attr("id")
                month = month.slice(5, month.length);
                var day = new Date("2016-" + (parseInt(month) + 1) + "-" + (i + 1)).getDay();

                if (day == 0 || day == 6) {
                    return "red";
                } else return "black";
            })
        var day = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"];

        timeblock_svg.selectAll(".block")
            .selectAll("#dayname")
            .data(day)
            .enter()
            .append("text")
            .attr("id", "dayname")
            .attr("text-anchor", "middle")
            .attr("transform", function (d, i) {
                var month = d3.select(this.parentNode).attr("id");
                month = month.slice(5, month.length);

                var x = (time_position.timeblock_width * 0.1) + time_position.position[parseInt(month)][0] + (day_edge_len * i),
                    y = 40 + time_position.position[parseInt(month)][1];

                return "translate( " + (x + day_edge_len / 2) + ", " + (y + day_edge_len / 2) + ")";
            })
            .attr("font-size", "8px")
            .text(function (d) {
                return d;
            });


    }

})(window.timeblock = window.timeblock || {});