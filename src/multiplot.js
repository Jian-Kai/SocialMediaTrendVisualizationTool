(function (multiplot) {
    multiplot.plot = function (pos, classify, position) {
        console.log(pos);
        var start = 300;

        var root = {
            "x": 75,
            "y": 75,
            "r": 60
        };

        var month = new Array(12);
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
            .attr("name", function (d, i) {
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
                    avgshare += classify[i][j].post.share;
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
                        if (select_rect.length == 2)
                            d3.select(this).attr("fill", "blue");
                        else
                            d3.select(this).attr("fill", "red");

                        multiplot.selerect(select_rect, classify);
                        multiplot.wordcloud(select_rect, classify);
                        //multiplot.statistical(select_rect, classify);
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

                    multiplot.selerect(select_rect, classify);
                    multiplot.wordcloud(select_rect, classify);
                    //multiplot.statistical(select_rect, classify);

                }
                console.log(select_rect);

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
                .attr("r", 2.5)
                .attr("fill", function (d) {
                    //return (seven_color[d.post.created_time.getDay()]);
                    return "gray";
                })
                .on("click", function (d) {
                    console.log(d);
                });


            for (var k = 0; k < classify[i].length; k++) {
                comment_count.push(classify[i][k].post.log_comment);
                like_count.push(classify[i][k].post.log_like);
                share_count.push(classify[i][k].post.log_share);
                mes_count.push(classify[i][k].post.message_length);
            }

            line_scale = d3.scaleLinear()
                .range([0, 35])
                .domain([d3.min(comment_count), d3.max(comment_count)]);

            d3.select("#svg2")
                .selectAll("path" + i)
                .data(classify[i])
                .enter()
                .append("path")
                .attr("d", function (d, j) {
                    var start = "M " + (Math.cos((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].x + root.x) + " " + (Math.sin((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].y + root.y);
                    var x1 = (Math.cos((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].x + root.x),
                        y1 = (Math.sin((j * (360 / classify[i].length)) * (Math.PI / 180)) * root.r + pos[i].y + root.y);
                    var endX = (root.r * x1 - line_scale(d.post.log_comment) * (x1 - (pos[i].x + root.x))) / root.r,
                        endY = (root.r * y1 - line_scale(d.post.log_comment) * (y1 - (pos[i].y + root.y))) / root.r;
                    var end = "L " + endX + " " + endY;
                    var road = start + " " + end;
                    return road;
                })
                .attr("id", "path" + i)
                .style("stroke-width", 2)
                .style("stroke", function (d) {
                    return "gray";
                    //return color(assignments[d.index]);
                    //return (seven_color[d.post.created_time.getDay()]);
                });

        }

    }

    multiplot.selerect = function (select_rect, classify) {
        if (select_rect.length <= 0) {
            //alert("No select");
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

        var svg1_circle = d3.select("#svg1").selectAll("circle")._groups[0],
            change = [];

        for (var i = 0; i < svg1_circle.length; i++) {
            change[i] = false;
            for (var j = 0; j < seleposts.length; j++) {
                if (svg1_circle[i].__data__.id == seleposts[j].id) {
                    change[i] = true;
                }
            }
        }

        /*
        d3.select("#svg1").selectAll("circle")
            .attr("fill", function (d, i) {
                if (change[i]) {
                    return "red";
                } else {
                    return "green";
                }
            }).style('opacity', function (d, i) {
                if (change[i]) {
                    return 1;
                } else {
                    return 0.3;
                }
            })
        */

        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var x = d3.scaleLinear()
            .range([25, (window_height / 2) * 9 / 10 - 25])
            .domain([Math.min.apply(null, P[0]), Math.max.apply(null, P[0])]);

        var y = d3.scaleLinear()
            .range([25, (window_height / 2) * 9 / 10 - 25])
            .domain([Math.max.apply(null, P[1]), Math.min.apply(null, P[1])]);


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
            .on("mouseover", function (d, i) {
                console.log(d);
                var xPosition = parseFloat(d3.select(this).attr("cx"));
                var yPosition = parseFloat(d3.select(this).attr("cy")) + (window_height / 2);

                if (yPosition > (window_height / 4 * 3)) {
                    yPosition -= 100;
                }

                var tooltip = d3.select("#tooltip2")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px");


                tooltip.select("#time")
                    .text(d.created_time);
                tooltip.select("#like")
                    .text(d.like);
                tooltip.select("#share")
                    .text(d.share);
                tooltip.select("#comment")
                    .text(d.comment);
                tooltip.select("#keyword")
                    .text(d.word[0]);

                d3.select("#tooltip2").classed("hidden", false);

            })
            .on("mouseout", function () {

                //Hide the tooltip
                d3.select("#tooltip2").classed("hidden", true);

            });
    }

    multiplot.wordcloud = function (select_rect, classify) {

        if (select_rect.length <= 0) {
            //alert("No select");
            d3.select("#svg3").selectAll("text").remove();
            return;
        }

        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var seleposts = [];
        var M = classify[select_rect[0]].length;

        for (var i = 0; i < select_rect.length; i++) {
            for (var j = 0; j < classify[select_rect[i]].length; j++) {
                seleposts.push(classify[select_rect[i]][j].post);
            }
        }

        //console.log(seleposts);

        console.log("word");

        var wordcloud = [];

        for (var i = 0; i < seleposts.length; i++) {
            var word = seleposts[i].word;
            var count = 0;
            for (var j = 0; j < word.length; j++) {
                /*if (word[j].weight > 30 && isNaN(parseInt(word[j].word))) {
                    count = 1;
                    wordcloud.push({
                        "text": word[j].word,
                        "size": word[j].weight
                    });

                }*/
                if (j == word.length - 1 && count == 0) {
                    wordcloud.push({
                        "text": word[0].word,
                        "size": (seleposts[i].log_comment + seleposts[i].log_like + seleposts[i].log_share)
                        
                    });

                }
            }
        }

        console.log(wordcloud);

        d3.layout.cloud()
            .size([(window_height / 2) * 9 / 10, (window_height / 2) * 9 / 10])
            .words(wordcloud)
            .padding(1)
            .rotate(function () {
                return 0;
                //return ~~(Math.random() * 4) * 30;
            })
            .text(function (d) {
                return d.text;
            })
            .fontSize(function (d) {
                return (d.size);
            })
            .on("end", draw)
            .start();



        function draw(words) {
            console.log(words);
            d3.select("#svg3").selectAll("text").remove();

            var word = [],
                xpos = [],
                ypos = [],
                size = [];

            for (var i = 0; i < wordcloud.length; i++) {
                word.push({
                    "x": wordcloud[i].x,
                    "y": wordcloud[i].y,
                    "size": wordcloud[i].size,
                    "text": wordcloud[i].text,
                    "rotate": wordcloud[i].rotate,
                    "post": seleposts[i]
                });

                xpos.push(words[i].x);
                ypos.push(words[i].y);
                size.push(wordcloud[i].size);
            }

            var x = d3.scaleLinear()
                .range([20, ((window_height / 2) * 9 / 10) - 20])
                .domain([Math.min.apply(null, xpos), Math.max.apply(null, xpos)]);

            var y = d3.scaleLinear()
                .range([20, ((window_height / 2) * 9 / 10) - 20])
                .domain([Math.max.apply(null, ypos), Math.min.apply(null, ypos)]);

            d3.select("#svg3")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-family", "sans-serif")
                .attr("text-anchor", "middle")
                .style("font-size", function (d) {
                    return (d.size) + "px";
                })
                .style("fill", function (d, i) {
                    if (i < M) {
                        return 'red';
                    } else {
                        return 'blue';
                    }
                    //return color(seleposts[i].created_time.getMonth());
                })
                .attr("transform", function (d) {
                    return "translate(" + [(x(d.x) + 750), y(d.y)] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                });
        }


    }

    multiplot.statistical = function (select_rect, classify) {

        if (select_rect.length <= 0) {
            //alert("No select");
            d3.select("#svg3").selectAll("#keytext").remove();
            d3.select("#svg3").selectAll("#keycircle").remove();
            return;
        }

        var seleposts = [];
        var keys = [],
            frequence = [];
        var M = classify[select_rect[0]].length;

        for (var i = 0; i < select_rect.length; i++) {
            for (var j = 0; j < classify[select_rect[i]].length; j++) {
                seleposts.push(classify[select_rect[i]][j].post);
            }
        }

        console.log("count");

        console.log(seleposts);

        for (var i = 0; i < seleposts.length; i++) {
            for (var j = 0; j < seleposts[i].word.length; j++) {
                if (frequence[seleposts[i].word[j].word] == null && seleposts[i].word[j].weight > 20) {
                    frequence[seleposts[i].word[j].word] = 1;
                    keys.push(seleposts[i].word[j].word);
                } else {
                    frequence[seleposts[i].word[j].word]++;
                }
            }

        }

        console.log(keys.length);

        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        keys.forEach(function (fre, index) {
            keys[index] = {
                "id": index,
                "text": fre,
                "r": frequence[fre]
            }
        })

        var circles = d3.select("svg").selectAll("circle").data(keys).enter().append("circle").attr("id", "keycircle");



        /*
        d3.select("#svg3").selectAll("#keytext").remove();

        d3.select("#svg3").selectAll("#keytext")
            .data(keys)
            .enter()
            .append("text")
            .attr("id", "keytext")
            .attr("x", ((window_height / 2) * 9 / 10) + ((window_height / 2) * 9 / 10)*2 /3 )
            .attr("y", function(d, i){
                return 5 + i * 5;
            })
            .style("font-size", "10px")
            .attr("text-anchor", "middle")
            .text(function(d){
                return d.text;
            })
        */

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
        var center = d3.select("#svg2").selectAll("#center")._groups[0];
        var size = d3.select("#svg2").selectAll("#center")._groups[0][0].attributes.r.value;
        var color = d3.select("#svg2").selectAll("#center")._groups[0][0].attributes.fill.value;
        d3.select("#svg2").selectAll("circle").attr("r", 2.5).attr("fill", "gray");

        for (var i = 0; i < center.length; i++) {
            var color = d3.select("#svg2").selectAll("#center")._groups[0][i].attributes.fill.value;
            d3.select(center[i]).attr("fill", color).attr("r", size);
        }


        //console.log(high);

        for (var i = 0; i < select.length; i++) {
            for (var j = 0; j < high.length; j++) {
                if (select[i].__data__ === high[j].__data__.post) {
                    d3.select(high[j]).attr("r", 5).attr("fill", "red");
                }
            }
        }
    }

}(window.multiplot = window.multiplot || {}));