(function (button) {
    button.switchbtn = function () {

        var height = parseInt(overview_svg.style("height"), 10);
        var width = parseInt(overview_svg.style("width"), 10);


        overview_svg.append("ellipse")
            .attr("id", "switch")
            .attr("cx", width - 30)
            .attr("cy", 15)
            .attr("rx", 15)
            .attr("ry", 10)
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .attr("stroke-width", "1.5px")
            .on("click", function () {

                overview_svg.select("#posts").selectAll("circle").style("opacity", 1).attr("r", 4).attr("fill", function (d, i) {
                    if (d.from.name === fanpage[0]) {
                        return "orange";
                    } else {
                        return "green";
                    }
                }).attr("stroke", "black");
                overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px");
                timeblock_svg.selectAll("g").select("#postsunburst").selectAll("g").selectAll("path")
                    .style("opacity", 1)
                    .attr("fill", function (d, i) {
                        //return "orange";
                        return color_scale(d.log_attribute[colorbtn]);
                    }).attr("stroke", "black");

                timeblock_svg.selectAll(".block").selectAll(".blockinfo").attr("fill", "white");

                if (mode) {
                    compare_svg.selectAll("text").remove();
                    compare_svg.selectAll("rect").remove();
                    overview_svg.select(".brush").remove();
                    d3.select(this).attr("fill", "yellow");
                    mode = false;
                } else {
                    overview.brush();
                    d3.select(this).attr("fill", "lightblue");
                    mode = true;
                }
            })
        /*
        //===================save button ==========================================

        overview_svg.append("ellipse")
            .attr("id", "save")
            .attr("cx", width - 60)
            .attr("cy", 15)
            .attr("rx", 15)
            .attr("ry", 10)
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .attr("stroke-width", "1.5px")
            .on("click", function () {

                var log = {
                    "mode": mode,
                    "colorbtn": colorbtn,
                    "brushes": []
                }
                console.log(brushes);
                if (brushes.length > 1) {
                    for (var i = 0; i < brushes.length - 1; i++) {
                        var brushsel = document.getElementById('brush-' + brushes[i].id);
                        if (d3.brushSelection(brushsel)) {
                            var extent = d3.brushSelection(brushsel);
                            log.brushes.push({
                                "id": brushes[i].id,
                                "brush": {
                                    "x": extent[0][0],
                                    "y": extent[0][1],
                                    "height": extent[1][1] - extent[0][1],
                                    "width": extent[1][0] - extent[0][0]
                                },
                                "color": d3.select(brushsel).select(".selection").attr("fill")
                            })
                        }
                    }

                    //console.log(JSON.stringify(log));

                    download(new Blob([JSON.stringify(log)]), "log.json", "text/plain");
                }

                //console.log(location);
                return true;
            })

        overview_svg.append("ellipse")
            .attr("id", "load")
            .attr("cx", width - 90)
            .attr("cy", 15)
            .attr("rx", 15)
            .attr("ry", 10)
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .attr("stroke-width", "1.5px")
            .on("click", function () {
                var xPosition = parseFloat(d3.select("#load").attr("cx"));
                var yPosition = parseFloat(d3.select("#load").attr("cy")) + 10;


                var tooltip = d3.select("#tooltip2")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px");

                d3.select("#tooltip2").classed("hidden", false);
            })

        */


        var detial_height = parseInt(detial_svg.style("height"), 10);
        var detial_width = parseInt(detial_svg.style("width"), 10);


        detial_svg.append("rect")
            .attr("id", "likeback")
            .attr("x", 10)
            .attr("y", 10)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("height", 20)
            .attr("width", 30)
            .style("stroke-width", "1px")
            .style("stroke", "black")
            .attr("fill", "white");

        detial_svg.append("rect")
            .attr("id", "commentback")
            .attr("x", 40)
            .attr("y", 10)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("height", 20)
            .attr("width", 30)
            .style("stroke-width", "1px")
            .style("stroke", "black")
            .attr("fill", "lightblue");

        detial_svg.append("rect")
            .attr("id", "shareback")
            .attr("x", 70)
            .attr("y", 10)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("height", 20)
            .attr("width", 30)
            .style("stroke-width", "1px")
            .style("stroke", "black")
            .attr("fill", "white");

        detial_svg.append("image")
            .attr("xlink:href", "img/like2.png")
            .attr("id", "likebtn")
            .attr("x", 10)
            .attr("y", 10)
            .attr("height", 20)
            .attr("width", 30)
            .on("click", function () {
                colorbtn = "like";
                color_scale.domain([d3.min(like_count), d3.max(like_count)]);

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_attribute.like);
                    });

                var range = timeblock.stackcal(block_posts, "nor_" + colorbtn);
                radio.domain(range);

                timeblock_svg.selectAll(".block")
                    .selectAll("#postsunburst")
                    .selectAll(".date")
                    .selectAll("path")
                    .attr("d", function (d, i) {
                        return arc(d, i, "nor_" + colorbtn);
                    })
                    .transition()
                    .duration(1500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_attribute.like);
                    });

                detial_svg.select("#color").select("#min").text(d3.min(normalize_temp, function (d) {
                    return d.like
                }));

                detial_svg.select("#color").select("#max").text(d3.max(normalize_temp, function (d) {
                    return d.like
                }));

                overview.bar(accumulation, "like");

                detial_svg.select("#likeback").attr("fill", "lightblue");
                detial_svg.select("#shareback").attr("fill", "white");
                detial_svg.select("#commentback").attr("fill", "white");

            });



        detial_svg.append("image")
            .attr("xlink:href", "img/comment.png")
            .attr("id", "commentbtn")
            .attr("x", 40)
            .attr("y", 10)
            .attr("height", 20)
            .attr("width", 30)
            .on("click", function () {
                colorbtn = "comment";
                color_scale.domain([d3.min(comment_count), d3.max(comment_count)]);

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .transition()
                    .duration(1500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_attribute.comment);
                    });

                var range = timeblock.stackcal(block_posts, "nor_" + colorbtn);
                radio.domain(range);

                timeblock_svg.selectAll(".block")
                    .selectAll("#postsunburst")
                    .selectAll(".date")
                    .selectAll("path")
                    .attr("d", function (d, i) {
                        return arc(d, i, "nor_" + colorbtn);
                    })
                    .transition()
                    .duration(1500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_attribute.comment);
                    });

                detial_svg.select("#color").select("#min").text(d3.min(normalize_temp, function (d) {
                    return d.comment
                }));

                detial_svg.select("#color").select("#max").text(d3.max(normalize_temp, function (d) {
                    return d.comment
                }));

                overview.bar(accumulation, "comment");

                detial_svg.select("#likeback").attr("fill", "white");
                detial_svg.select("#shareback").attr("fill", "white");
                detial_svg.select("#commentback").attr("fill", "lightblue");


            });

        detial_svg.append("image")
            .attr("xlink:href", "img/share.png")
            .attr("id", "sharebtn")
            .attr("x", 70)
            .attr("y", 10)
            .attr("height", 20)
            .attr("width", 30)
            .on("click", function () {
                colorbtn = "share";
                color_scale.domain([d3.min(share_count), d3.max(share_count)]);

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_attribute.share);
                    });

                var range = timeblock.stackcal(block_posts, "nor_" + colorbtn);
                radio.domain(range);

                timeblock_svg.selectAll(".block")
                    .selectAll("#postsunburst")
                    .selectAll(".date")
                    .selectAll("path")
                    .attr("d", function (d, i) {
                        return arc(d, i, "nor_" + colorbtn);
                    })
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_attribute.share);
                    });


                detial_svg.select("#color").select("#min").text(d3.min(normalize_temp, function (d) {
                    return d.share
                }));

                detial_svg.select("#color").select("#max").text(d3.max(normalize_temp, function (d) {
                    return d.share
                }));

                overview.bar(accumulation, "share");

                detial_svg.select("#likeback").attr("fill", "white");
                detial_svg.select("#shareback").attr("fill", "lightblue");
                detial_svg.select("#commentback").attr("fill", "white");

            });




    }

    button.detial = function (postarray) {

        var post = postarray[1];

        detial_svg.select("#detialinfo").remove();

        var height = parseInt(detial_svg.style("height"), 10) - 45;
        var width = (parseInt(detial_svg.style("width"), 10) / 2) - 30;

        var detialinfo = detial_svg.append("g")
            .attr("id", "detialinfo")
            .attr("transform", "translate( 0, " + (height / 2) + ")");

        detialinfo.append("text")
            .attr("id", "post")
            .attr("transform", "translate( 10, 50)")
            .text("Id: " + post.post);


        detialinfo.append("text")
            .attr("id", "postid")
            .attr("transform", "translate( 10, 70)")
            .text("Postid: " + post.id);

        detialinfo.append("text")
            .attr("id", "time")
            .attr("transform", "translate( 10, 90)")
            .text("Time: " + post.created_time);

        detialinfo.append("text")
            .attr("id", "message")
            .attr("transform", "translate( 10, 110)")
            .text("Message: " + post.message);

        detialinfo.append("text")
            .attr("id", "like")
            .attr("transform", "translate( 10, 130)")
            .attr("fill", function () {
                if (colorbtn == "log_like") {
                    return "red";
                } else {
                    return "black";
                }

            })
            .text("Like: " + post.like);

        detialinfo.append("text")
            .attr("id", "comment")
            .attr("transform", "translate( 10, 150)")
            .attr("fill", function () {
                if (colorbtn == "log_comment") {
                    return "red";
                } else {
                    return "black";
                }

            })
            .text("Comment: " + post.comment);

        detialinfo.append("text")
            .attr("id", "share")
            .attr("transform", "translate( 10, 170)")
            .attr("fill", function () {
                if (colorbtn == "log_share") {
                    return "red";
                } else {
                    return "black";
                }

            })
            .text("Share: " + post.share);

        detialinfo.append("text")
            .attr("id", "reaction")
            .attr("transform", "translate( 10, 190)")
            .attr("fill", function () {
                return "black";
            })
            .text("Reaction: " + post.reactions.love + " " + post.reactions.haha + " " + post.reactions.wow + " " + post.reactions.sad + " " + post.reactions.angry);


        var selectblock = detialinfo.append("g").attr("id", "selectblock");

        selectblock.selectAll("#postmark")
            .data(postarray)
            .enter()
            .append("circle")
            .attr("id", "postmark")
            .attr("cx", function (d, i) {
                return (width / 2) + ((i - 1) * 22);
            })
            .attr("cy", 210)
            .attr("r", 10)
            .attr("fill", function (d, i) {
                if (i == 1) {
                    return "gray"
                } else {
                    return "lightgray"
                }
            })
            .attr("stroke", "black")
            .on("click", function (d, i) {

                detial_svg.selectAll("#postmark").attr("fill", function (d, j) {
                    if (j == i) {
                        return "gray";
                    } else {
                        return "lightgray";
                    }
                })
                detialinfo.select("#post").text("Id: " + postarray[i].post);
                detialinfo.select("#postid").text("Postid: " + postarray[i].id);
                detialinfo.select("#time").text("Time: " + postarray[i].created_time);
                detialinfo.select("#message").text("Message: " + postarray[i].message);
                detialinfo.select("#like").text("Like: " + postarray[i].like);
                detialinfo.select("#comment").text("Comment: " + postarray[i].comment);
                detialinfo.select("#share").text("Share: " + postarray[i].share);
                detialinfo.select("#reaction").text("Reaction: " + postarray[i].reactions.love + " " + postarray[i].reactions.haha + " " + postarray[i].reactions.wow + " " + postarray[i].reactions.sad + " " + postarray[i].reactions.angry);
            })
    }

    button.colorbar = function () {

        var bar_scale = d3.scaleLinear()
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#FFC1E0"), d3.rgb('#D9006C')])
            .domain([0, 400]);

        var bar = detial_svg.append("g").attr("id", "color");
        bar.selectAll("#colorbar")
            .data(d3.range(400), function (d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("id", "colorbar")
            .attr("width", 1)
            .attr("height", 15)
            .attr("x", function (d, i) {
                return i + 125;
            })
            .attr("y", 10)
            .attr("fill", function (d, i) {
                return bar_scale(d);
            });

        bar.append("text")
            .attr("id", "min")
            .attr("transform", "translate( 125, 40)")
            .attr("text-anchor", "middle")
            .text(d3.min(normalize_temp, function (d) {
                return d.comment
            }));

        bar.append("text")
            .attr("id", "max")
            .attr("transform", "translate( 525, 40)")
            .attr("text-anchor", "middle")
            .text(d3.max(normalize_temp, function (d) {
                return d.comment
            }));
    }

    button.hierarchical = function () {
        var month_feature = [];
        var distance = [];
        for (var i = 0; i < block_posts.length; i++) {
            distance[i] = [];
            var total_like = 0,
                total_share = 0,
                total_comment = 0,
                avg_like = 0,
                avg_share = 0,
                avg_comment = 0;
            var post_count = block_posts[i].length;
            for (var j = 0; j < block_posts[i].length; j++) {
                total_comment += block_posts[i][j].comment;
                total_like += block_posts[i][j].like;
                total_share += block_posts[i][j].share;
            }
            month_feature.push({
                "total_comment": total_comment,
                "total_like": total_like,
                "total_share": total_share,
                "post_count": post_count,
                "avg_comment": total_comment / post_count,
                "avg_like": total_like / post_count,
                "avg_share": total_share / post_count,
                "posts": block_posts[i]
            });
        }

        console.log(month_feature);

        for (var i = 0; i < month_feature.length; i++) {
            for (var j = 0; j < month_feature.length; j++) {
                distance[i][j] = Math.pow(month_feature[i].avg_comment - month_feature[j].avg_comment, 2);
                distance[i][j] += Math.pow((month_feature[i].avg_like - month_feature[j].avg_like) * 0.01, 2);
                distance[i][j] += Math.pow((month_feature[i].avg_share - month_feature[j].avg_share) * 0.05, 2);

                distance[i][j] += Math.pow((month_feature[i].total_comment - month_feature[j].total_comment) * 0.01, 2);
                distance[i][j] += Math.pow((month_feature[i].total_like - month_feature[j].total_like) * 0.0001, 2);
                distance[i][j] += Math.pow((month_feature[i].total_comment - month_feature[j].total_comment) * 0.001, 2);

                distance[i][j] = Math.sqrt(distance[i][j]);
            }
        }

        console.log(distance);

        var Y = mds.classic(distance);

        console.log(Y);

        var line = [];

        for (var i = 0; i < Y.length - 1; i++) {
            line.push([Y[i], Y[i + 1]])
        }

        var Positions = numeric.transpose(Y);

        var x = d3.scaleLinear().domain([d3.min(Positions[0]), d3.max(Positions[0])]).range([70, parseInt(compare_svg.style("width"), 10) - 70]);
        var y = d3.scaleLinear().domain([d3.max(Positions[1]), d3.min(Positions[1])]).range([60, parseInt(compare_svg.style("height"), 10) - 60]);

        compare_svg.selectAll("line")
            .data(line)
            .enter()
            .append("line")
            .attr("id", function (d, i) {
                return "link" + i;
            })
            .attr("x1", function (d) {
                return x(d[0][0]);
            })
            .attr("y1", function (d) {
                return y(d[0][1]);
            })
            .attr("x2", function (d) {
                return x(d[1][0]);
            })
            .attr("y2", function (d) {
                return y(d[1][1]);
            })
            .attr("stroke", "black")

        compare_svg.selectAll("circle")
            .data(month_feature)
            .enter()
            .append("circle")
            .attr("id", function (d, i) {
                return "month" + i;
            })
            .attr("cx", function (d, i) {
                return x(Positions[0][i]);
            })
            .attr("cy", function (d, i) {
                return y(Positions[1][i]);
            })
            .attr("r", 10)
            .attr("fill", "red")
            .attr("stroke", "black")
            .on("click", function (d, i) {
                compare_svg.selectAll("circle").attr("r", 10).attr("fill", "red");
                d3.select(this).attr("r", 50).attr("fill", "white");

                var pos = [d3.select(this).attr("cx"), d3.select(this).attr("cy")];
                var month = compare_svg.selectAll("circle")._groups[0];

                for (var p = 0; p < month.length; p++) {
                    if (p != i) {
                        var dis = Math.sqrt(Math.pow(d3.select(month[p]).attr("cx") - pos[0], 2) + Math.pow(d3.select(month[p]).attr("cy") - pos[1], 2));

                        if (dis <= 60) {

                        }
                    }
                }

                //console.log(month);

                var weekposts = week(d.posts);
                console.log(i);
            });

        function week(D) {
            console.log(D);

            var temp = 1,
                count = 1,
                temparr = [],
                array = [];

            for (var i = 0; i < D.length; i++) {
                var date = D[i].created_time.getDate();
                //console.log(date);

                if (date - temp != 0) {
                    count += (date - temp);
                    temp = date;
                    if (count > 7) {
                        count = 1;
                        array.push(temparr);
                        temparr = [];
                    }
                }

                temparr.push(D[i]);

                if (i == D.length - 1) {
                    array.push(temparr);
                }

            }

            console.log(array);

            return array;
        }


    }

    button.Attention = function () {

        var redbrush = {
                "avglike": 0,
                "avgshare": 0,
                "avgcomment": 0,
                "avgmessagelength": 0,
                "avglove": 0,
                "avghaha": 0,
                "avgwow": 0,
                "avgsad": 0,
                "avgangry": 0
            },
            bluebrush = {
                "avglike": 0,
                "avgshare": 0,
                "avgcomment": 0,
                "avgmessagelength": 0,
                "avglove": 0,
                "avghaha": 0,
                "avgwow": 0,
                "avgsad": 0,
                "avgangry": 0
            };

        var redbrushcount = 0,
            bluebrushcount = 0;

        for (var i = 0; i < brush_block.length; i++) {
            if (brush_block[i].index === fanpage[0]) {
                redbrush.avglike += brush_block[i].post.like;
                redbrush.avgshare += brush_block[i].post.share;
                redbrush.avgcomment += brush_block[i].post.comment;
                redbrush.avgmessagelength += brush_block[i].post.message.length;
                redbrush.avglove += brush_block[i].post.reactions.love;
                redbrush.avghaha += brush_block[i].post.reactions.haha;
                redbrush.avgwow += brush_block[i].post.reactions.wow;
                redbrush.avgsad += brush_block[i].post.reactions.sad;
                redbrush.avgangry += brush_block[i].post.reactions.angry;
                redbrushcount++;
            } else {
                bluebrush.avglike += brush_block[i].post.like;
                bluebrush.avgshare += brush_block[i].post.share;
                bluebrush.avgcomment += brush_block[i].post.comment;
                bluebrush.avgmessagelength += brush_block[i].post.message.length;
                bluebrush.avglove += brush_block[i].post.reactions.love;
                bluebrush.avghaha += brush_block[i].post.reactions.haha;
                bluebrush.avgwow += brush_block[i].post.reactions.wow;
                bluebrush.avgsad += brush_block[i].post.reactions.sad;
                bluebrush.avgangry += brush_block[i].post.reactions.angry;
                bluebrushcount++;
            }
        }

        if (redbrushcount > 0) {
            redbrush.avglike /= redbrushcount;
            redbrush.avgshare /= redbrushcount;
            redbrush.avgcomment /= redbrushcount;
            redbrush.avgmessagelength /= redbrushcount;

            redbrush.avglove /= redbrushcount;
            redbrush.avghaha /= redbrushcount;
            redbrush.avgwow /= redbrushcount;
            redbrush.avgsad /= redbrushcount;
            redbrush.avgangry /= redbrushcount;
        }

        if (bluebrushcount > 0) {
            bluebrush.avglike /= bluebrushcount;
            bluebrush.avgshare /= bluebrushcount;
            bluebrush.avgcomment /= bluebrushcount;
            bluebrush.avgmessagelength /= bluebrushcount;

            bluebrush.avglove /= bluebrushcount;
            bluebrush.avghaha /= bluebrushcount;
            bluebrush.avgwow /= bluebrushcount;
            bluebrush.avgsad /= bluebrushcount;
            bluebrush.avgangry /= bluebrushcount;
        }

        console.log(redbrush)
        console.log(bluebrush)

        console.log(AvgStack);

        detial_svg.select("#attention").remove();

        var height = parseInt(detial_svg.style("height"), 10) - 45,
            width = (parseInt(detial_svg.style("width"), 10) / 2) - 30;

        var atten = detial_svg.append("g").attr("id", "attention");

        atten.append("rect")
            .attr("id", "redbrush")
            .attr("x", 10)
            .attr("y", 50)
            .attr("width", width / 2)
            .attr("height", height / 2 - 15)
            .attr("fill", "white")
            .attr("stroke", "red")
            .attr("stroke-width", "1.5px")

        atten.append("rect")
            .attr("id", "bluebrush")
            .attr("x", width / 2 + 20)
            .attr("y", 50)
            .attr("width", width / 2)
            .attr("height", height / 2 - 15)
            .attr("fill", "white")
            .attr("stroke", "blue")
            .attr("stroke-width", "1.5px")

        //=======================red======================================

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( 13, 65)")
            .text("Total Posts : ");

        atten.append("text")
            .attr("id", "redtotalpost")
            .attr("transform", "translate( 116.17, 65)")
            .text(redbrushcount);

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( 13, 85)")
            .text("AvgLike : ");

        atten.append("text")
            .attr("id", "redavglike")
            .attr("transform", "translate( 90.11, 85)")
            .attr("fill", function () {
                if (redbrush.avglike > AvgStack.like)
                    return "red";
                else
                    return "black";
            })
            .text(redbrush.avglike.toFixed(2));

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( 13, 105)")
            .text("AvgShare : ");

        atten.append("text")
            .attr("id", "redavgshare")
            .attr("transform", "translate( 102.17, 105)")
            .attr("fill", function () {
                if (redbrush.avgshare > AvgStack.share)
                    return "red";
                else
                    return "black";
            })
            .text(redbrush.avgshare.toFixed(2));

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( 13, 125)")
            .text("AvgComment : ");

        atten.append("text")
            .attr("id", "redavgcomment")
            .attr("transform", "translate( 132.08, 125)")
            .attr("fill", function () {
                if (redbrush.avgcomment > AvgStack.comment)
                    return "red";
                else
                    return "black";
            })
            .text(redbrush.avgcomment.toFixed(2));

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( 13, 145)")
            .text("AvgMessageLen : ");

        atten.append("text")
            .attr("id", "redavgmessage")
            .attr("transform", "translate( 154.33, 145)")
            .attr("fill", function () {
                if (redbrush.avgmessagelength > AvgStack.messagelen)
                    return "red";
                else
                    return "black";
            })
            .text(redbrush.avgmessagelength.toFixed(2));
        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( 13, 165)")
            .text("Love  Haha  Wow  Sad  Angry");

        atten.append("text")
            .attr("id", "redavgreaction")
            .attr("transform", "translate( 13, 185)")
            .text(redbrush.avglove.toFixed(2) + " " + redbrush.avghaha.toFixed(2) + " " + redbrush.avgwow.toFixed(2) + " " + redbrush.avgsad.toFixed(2) + " " + redbrush.avgangry.toFixed(2));

        //=======================blue======================================

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 65)")
            .text("Total Posts : ");

        atten.append("text")
            .attr("id", "bluetotalpost")
            .attr("transform", "translate( " + (width / 2 + 126.17) + ", 65)")
            .text(bluebrushcount);

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 85)")
            .text("AvgLike : ");

        atten.append("text")
            .attr("id", "blueavglike")
            .attr("transform", "translate( " + (width / 2 + 100.11) + ", 85)")
            .attr("fill", function () {
                if (bluebrush.avglike > AvgStack.like)
                    return "blue";
                else
                    return "black";
            })
            .text(bluebrush.avglike.toFixed(2));

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 105)")
            .text("AvgShare : ");

        atten.append("text")
            .attr("id", "blueavgshare")
            .attr("transform", "translate( " + (width / 2 + 112.17) + ", 105)")
            .attr("fill", function () {
                if (bluebrush.avgshare > AvgStack.share)
                    return "blue";
                else
                    return "black";
            })
            .text(bluebrush.avgshare.toFixed(2));

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 125)")
            .text("AvgComment : ");

        atten.append("text")
            .attr("id", "blueavgcomment")
            .attr("transform", "translate( " + (width / 2 + 142.08) + ", 125)")
            .attr("fill", function () {
                if (bluebrush.avgcomment > AvgStack.comment)
                    return "blue";
                else
                    return "black";
            })
            .text(bluebrush.avgcomment.toFixed(2));

        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 145)")
            .text("AvgMessageLen : ");

        atten.append("text")
            .attr("id", "blueavgmessage")
            .attr("transform", "translate( " + (width / 2 + 164.33) + ", 145)")
            .attr("fill", function () {
                if (bluebrush.avgmessagelength > AvgStack.messagelen)
                    return "blue";
                else
                    return "black";
            })
            .text(bluebrush.avgmessagelength.toFixed(2));
        atten.append("text")
            .attr("class", "font_bold")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 165)")
            .text("Love  Haha  Wow  Sad  Angry");

        atten.append("text")
            .attr("id", "redavgreaction")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 185)")
            .text(bluebrush.avglove.toFixed(2) + " " + bluebrush.avghaha.toFixed(2) + " " + bluebrush.avgwow.toFixed(2) + " " + bluebrush.avgsad.toFixed(2) + " " + bluebrush.avgangry.toFixed(2));


        console.log(brush_block);
    }

})(window.button = window.button || {});