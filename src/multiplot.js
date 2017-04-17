(function (multiplot) {
    multiplot.plot = function (pos, classify, position) {
        console.log(pos);
        var start = 300;

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
            .attr("fill", "white")
            .on("click", function (d, i) {
                console.log(i);
                select_rect.push(i);
                console.log(select_rect);
                d3.select("#svg2").select("#month" + i).attr("fill", "lightgray");
            });

        for (var i = 0; i < pos.length; i++) {

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

        }
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
            }
        }

        return pos;
    }

}(window.multiplot = window.multiplot || {}));