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
        compare_svg.selectAll("text").remove();
        compare_svg.selectAll("rect").remove();

        var height = parseInt(compare_svg.style("height"), 10),
            width = parseInt(compare_svg.style("width"), 10);

        if(frequent.length > 50){
            frequent.splice(51, frequent.length - 51);
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

        var rect_scale = d3.scaleLinear().domain([min, max]).range([1, 21]);


        compare_svg.selectAll("text")
            .data(frequent)
            .enter()
            .append("text")
            .attr("x", function (d, i) {
                if ((i + 1) * (11) >= height) {
                    return width * 0.6;
                } else {
                    return width * 0.2;
                }
            })
            .attr("y", function (d, i) {
                if ((i + 1) * (11) < height) {
                    temp = i;
                    return (i + 1) * (11);
                } else {
                    //temp = true;
                    return (i - temp) * (11);
                }
            })
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text(function (d, i) {
                return d.word;
            })


        compare_svg.append("g")
            .attr("id", "firstbrush")
            .selectAll("rect")
            .data(count)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                if ((i + 1) * (11) >= height) {
                    return width * 0.6 - 20 - rect_scale(d.fir);
                } else {
                    return width * 0.2 - 20 - rect_scale(d.fir);
                }
            })
            .attr("y", function (d, i) {
                if ((i + 1) * (11) < height) {
                    temp = i;
                    return (i) * (11) + 2.5;
                } else {
                    //temp = true;
                    return (i - 1 - temp) * (11) + 2.5;
                }
            })
            .attr("height", function () {
                return 10;
            })
            .attr("width", function (d) {
                return rect_scale(d.fir);
            })
            .attr("fill", "red");


        compare_svg.append("g")
            .attr("id", "secondbrush")
            .selectAll("rect")
            .data(count)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                if ((i + 1) * (11) >= height) {
                    return width * 0.6 + 20;
                } else {
                    return width * 0.2 + 20;
                }
            })
            .attr("y", function (d, i) {
                if ((i + 1) * (11) < height) {
                    temp = i;
                    return (i) * (11) + 2.5;
                } else {
                    //temp = true;
                    return (i - 1 - temp) * (11) + 2.5;
                }
            })
            .attr("height", function () {
                return 10;
            })
            .attr("width", function (d) {
                return rect_scale(d.sec);
            })
            .attr("fill", "blue");

    }

})(window.compare = window.compare || {});