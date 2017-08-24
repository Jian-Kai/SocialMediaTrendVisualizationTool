(function (compare) {
    compare.frequent = function () {
        console.log(brush_block.length);
        var wordbuffer = [];
        for (var i = 0; i < brush_block.length; i++) {
            for (var j = 0; j < brush_block[i].post.word.length; j++) {
                var word = brush_block[i].post.word[j];
                wordbuffer.push({
                    "word": word.word,
                    "weight": word.weight,
                    "postid": brush_block[i].post.post,
                    "index": brush_block[i].index
                });
            }
        }
        console.log("wordbuffer");
        console.log(wordbuffer)
        console.log("frequent");
        var exist = [],
            buffer = [],
            c = 0;
        for (var i = 0; i < wordbuffer.length; i++) {
            if (buffer[wordbuffer[i].word] == null) {
                buffer[wordbuffer[i].word] = c;
                c++;
                exist.push({
                    "word": wordbuffer[i].word,
                    "count": 1,
                    "posts": [{
                        "postid": wordbuffer[i].postid,
                        "index": wordbuffer[i].index
                    }]
                });
            } else {
                exist[buffer[wordbuffer[i].word]].count++;
                exist[buffer[wordbuffer[i].word]].posts.push({
                    "postid": wordbuffer[i].postid,
                    "index": wordbuffer[i].index
                });
            }
        }
        exist = exist.filter(function (word) {
            return word.count > 3;
        })

        exist.sort(function (a, b) {
            return b.count - a.count
        });


        //console.log(exist);
        return exist;
    }

    compare.render = function (frequent) {
        compare_svg.select("#frequent").remove();

        var height = parseInt(compare_svg.style("height"), 10),
            width = parseInt(compare_svg.style("width"), 10);

        var text_height = (height - 20) / 2,
            text_width = 40;

        var bar_height = (height - 20) / 2;

        console.log(width / 40);

        if (frequent.length > 25) {
            frequent.splice(25, frequent.length - 25);
        }

        console.log(frequent.length);

        var temp = 0;
        var count = [];
        var min = 100000000,
            max = 0;
        for (var i = 0; i < frequent.length; i++) {
            var fir = 0,
                sec = 0;
            for (var j = 0; j < frequent[i].posts.length; j++) {
                if (frequent[i].posts[j].index == 0) {
                    fir++;
                } else {
                    sec++;
                }
            }
            if (max < d3.max([fir, sec])) {
                max = d3.max([fir, sec]);
            }
            if (min > d3.min([fir, sec])) {
                min = d3.min([fir, sec]);
            }

            count.push({
                "word": frequent[i].word,
                "fir": fir,
                "sec": sec
            })
        }

        //console.log(count);
        // console.log(max)
        // console.log(min);

        var rect_scale = d3.scaleLinear().domain([min, max]).range([0, (bar_height - 10)]);

        var frequent_bar = compare_svg.append("g").attr("id", "frequent");

        frequent_bar.selectAll("#textblock")
            .data(count)
            .enter()
            .append("rect")
            .attr("id", function (d, i) {
                return "textblock";
            })
            .attr("x", function (d, i) {
                return i * 40;
            })
            .attr("y", text_height)
            .attr("height", 20)
            .attr("width", 40)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "1.5px");

        frequent_bar.selectAll("#textword")
            .data(count)
            .enter()
            .append("text")
            .attr("id", "textword")
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("transform", function (d, i) {
                return "translate( " + ((i * 40) + 20) + ", " + (text_height + 15) + ")";
            })
            .text(function (d) {
                return d.word;
            });

        frequent_bar.selectAll("#redbar")
            .data(count)
            .enter()
            .append("rect")
            .attr("id", "redbar")
            .attr("x", function (d, i) {
                return (i * 40) + 10;
            })
            .attr("y", function (d, i) {
                return bar_height - rect_scale(d.fir);
            })
            .attr("width", 20)
            .attr("height", function (d, i) {
                return rect_scale(d.fir);
            })
            .attr("fill", "red");


        frequent_bar.selectAll("#bluebar")
            .data(count)
            .enter()
            .append("rect")
            .attr("id", "bluebar")
            .attr("x", function (d, i) {
                return (i * 40) + 10;
            })
            .attr("y", function (d, i) {
                return bar_height + 20;
            })
            .attr("width", 20)
            .attr("height", function (d, i) {
                return rect_scale(d.sec);
            })
            .attr("fill", "blue");

    }

})(window.compare = window.compare || {});