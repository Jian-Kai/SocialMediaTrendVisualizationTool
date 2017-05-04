(function (multiplot) {
    multiplot.plot = function (pos, classify, position) {
        console.log(pos);
        var start = 300;

        var root = {
            "x": 75,
            "y": 75,
            "r": 60
        };


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
                if (!select[i]) {
                    if (select_rect.length < 2) {
                        select[i] = true;
                        select_rect.push(i);
                        d3.select("#svg2").select("#month" + i).attr("fill", "lightgray");
                    }

                } else {
                    select[i] = false;
                    for (var j = 0; j < select_rect.length; j++) {
                        if (select_rect[j] == i)
                            select_rect.splice(j, 1);
                    }
                    d3.select("#svg2").select("#month" + i).attr("fill", "white");
                }
                console.log(select_rect);
                multiplot.selerect(select_rect, classify, position);
            });

        d3.select("#svg2").selectAll("text")
            .data(pos)
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.x + root.x;
            })
            .attr("y", function (d) {
                return d.y + 20;
            })
            .text(function (d, i) {
                return classify[i].length + " posts"
            })
            .attr("fill", "gray")
            .style("opacity", 0.3);


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
                    return color(assignments[d.index]);
                })
                .on("click", function (d) {
                    console.log(d);
                })
            var count = [];
            for (var k = 0; k < classify[i].length; k++) {
                count.push(classify[i][k].post.log_comment);
            }

            var scale = d3.scaleLinear()
                .range([0, 50])
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
                    return color(assignments[d.index]);
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
            .attr("fill", function(d, i){
                if(i < M){
                    return 'red';
                }
                else{
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

}(window.multiplot = window.multiplot || {}));