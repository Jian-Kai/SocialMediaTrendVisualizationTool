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
                    return color_scale(d[colorbtn]);
                });
                overview_svg.select("#timecurve").selectAll("path").attr("stroke-width", "0px");
                timeblock_svg.selectAll("g").select("g").selectAll("g").selectAll("path").style("opacity", 1).attr("fill", function (d, i) {
                    return color_scale(d[colorbtn]);
                });

                if (mode) {
                    compare_svg.selectAll("text").remove();
                    compare_svg.selectAll("rect").remove();
                    overview_svg.select(".brushes").remove();
                    d3.select(this).attr("fill", "yellow");
                    mode = false;
                } else {
                    overview.multibrush();
                    d3.select(this).attr("fill", "lightblue");
                    mode = true;
                }
            })

        var detial_height = parseInt(detial_svg.style("height"), 10);
        var detial_width = parseInt(detial_svg.style("width"), 10);

        detial_svg.append("image")
            .attr("xlink:href", "img/like.png")
            .attr("id", "likebtn")
            .attr("x", 10)
            .attr("y", 10)
            .attr("height", 20)
            .attr("width", 30)
            .on("click", function () {
                colorbtn = "log_like";
                color_scale.domain([d3.min(like_count), d3.max(like_count)]);

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_like);
                    });

                var range = timeblock.stackcal(block_posts, colorbtn);
                radio.domain(range);

                timeblock_svg.selectAll(".block")
                    .selectAll("#postsunburst")
                    .selectAll(".date")
                    .selectAll("path")
                    .attr("d", function (d, i) {
                        return arc(d, i, colorbtn);
                    })
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_like);
                    });

                detial_svg.select("#color").select("#min").text(d3.min(normalize_temp, function (d) {
                    return d.like
                }));

                detial_svg.select("#color").select("#max").text(d3.max(normalize_temp, function (d) {
                    return d.like
                }));

                overview.bar(accumulation, "like");

            });



        detial_svg.append("image")
            .attr("xlink:href", "img/comment.png")
            .attr("id", "commentbtn")
            .attr("x", 40)
            .attr("y", 10)
            .attr("height", 20)
            .attr("width", 30)
            .on("click", function () {
                colorbtn = "log_comment";
                color_scale.domain([d3.min(comment_count), d3.max(comment_count)]);

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_comment);
                    });

                var range = timeblock.stackcal(block_posts, colorbtn);
                radio.domain(range);

                timeblock_svg.selectAll(".block")
                    .selectAll("#postsunburst")
                    .selectAll(".date")
                    .selectAll("path")
                    .attr("d", function (d, i) {
                        return arc(d, i, colorbtn);
                    })
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_comment);
                    });

                detial_svg.select("#color").select("#min").text(d3.min(normalize_temp, function (d) {
                    return d.comment
                }));

                detial_svg.select("#color").select("#max").text(d3.max(normalize_temp, function (d) {
                    return d.comment
                }));

                overview.bar(accumulation, "comment");


            });

        detial_svg.append("image")
            .attr("xlink:href", "img/share.png")
            .attr("id", "sharebtn")
            .attr("x", 70)
            .attr("y", 10)
            .attr("height", 20)
            .attr("width", 30)
            .on("click", function () {
                colorbtn = "log_share";
                color_scale.domain([d3.min(share_count), d3.max(share_count)]);

                overview_svg.select("#posts")
                    .selectAll("circle")
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_share);
                    });

                var range = timeblock.stackcal(block_posts, colorbtn);
                radio.domain(range);

                timeblock_svg.selectAll(".block")
                    .selectAll("#postsunburst")
                    .selectAll(".date")
                    .selectAll("path")
                    .attr("d", function (d, i) {
                        return arc(d, i, colorbtn);
                    })
                    .transition()
                    .duration(500)
                    .attr("fill", function (d, i) {
                        return color_scale(d.log_share);
                    });


                detial_svg.select("#color").select("#min").text(d3.min(normalize_temp, function (d) {
                    return d.share
                }));

                detial_svg.select("#color").select("#max").text(d3.max(normalize_temp, function (d) {
                    return d.share
                }));

                overview.bar(accumulation, "share");



            });




    }

    button.detial = function (post) {

        detial_svg.select("#detialinfo").remove();

        var height = parseInt(detial_svg.style("height"), 10) - 45;

        var detialinfo = detial_svg.append("g")
            .attr("id", "detialinfo")
            .attr("transform", "translate( 0, " + (height / 2) + ")");

        detialinfo.append("text")
            .attr("id", "post")
            .attr("transform", "translate( 10, 50)")
            .text("Id: " + post.post);


        detialinfo.append("text")
            .attr("id", "post")
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
            .text("Like: " + post.like + " (" + post.log_like + ")");

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
            .text("Comment: " + post.comment + " (" + post.log_comment + ")");

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
            .text("Share: " + post.share + " (" + post.log_share + ")");

        detialinfo.append("text")
            .attr("id", "reaction")
            .attr("transform", "translate( 10, 190)")
            .attr("fill", function () {
                return "black";
            })
            .text("Reaction: " + post.reactions.love + " " + post.reactions.haha + " " + post.reactions.wow + " " + post.reactions.sad + " " + post.reactions.angry);
    }

    button.colorbar = function () {

        var bar_scale = d3.scaleLinear()
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#f9d423"), d3.rgb('#f83600')])
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
                "avgcomment": 0
            },
            bluebrush = {
                "avglike": 0,
                "avgshare": 0,
                "avgcomment": 0
            };

        var redbrushcount = 0,
            bluebrushcount = 0;

        for (var i = 0; i < brush_block.length; i++) {
            if (brush_block[i].index == 0) {
                redbrush.avglike += brush_block[i].post.like;
                redbrush.avgshare += brush_block[i].post.share;
                redbrush.avgcomment += brush_block[i].post.comment;
                redbrushcount++;
            } else {
                bluebrush.avglike += brush_block[i].post.like;
                bluebrush.avgshare += brush_block[i].post.share;
                bluebrush.avgcomment += brush_block[i].post.comment;
                bluebrushcount++;
            }
        }

        if (redbrushcount > 0) {
            redbrush.avglike /= redbrushcount;
            redbrush.avgshare /= redbrushcount;
            redbrush.avgcomment /= redbrushcount;
        }

        if (bluebrushcount > 0) {
            bluebrush.avglike /= bluebrushcount;
            bluebrush.avgshare /= bluebrushcount;
            bluebrush.avgcomment /= bluebrushcount;
        }

        console.log(redbrush)
        console.log(bluebrush)

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

        atten.append("text")
            .attr("id", "redavglike")
            .attr("transform", "translate( 13, 65)")
            .text("AvgLike : " + redbrush.avglike.toFixed(2));

        atten.append("text")
            .attr("id", "redavgshare")
            .attr("transform", "translate( 13, 85)")
            .text("AvgShare : " + redbrush.avgshare.toFixed(2));

        atten.append("text")
            .attr("id", "redavgcomment")
            .attr("transform", "translate( 13, 105)")
            .text("AvgComment : " + redbrush.avgcomment.toFixed(2));



         atten.append("text")
            .attr("id", "blueavglike")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 65)")
            .text("AvgLike : " + bluebrush.avglike.toFixed(2));

        atten.append("text")
            .attr("id", "blueavgshare")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 85)")
            .text("AvgShare : " + bluebrush.avgshare.toFixed(2));

        atten.append("text")
            .attr("id", "blueavgcomment")
            .attr("transform", "translate( " + (width / 2 + 23) + ", 105)")
            .text("AvgComment : " + bluebrush.avgcomment.toFixed(2));


        console.log(brush_block);
    }


})(window.button = window.button || {});