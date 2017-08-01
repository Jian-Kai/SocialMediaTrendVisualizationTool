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
            return word.count > 1;
        })
        //console.log(exist);
        return exist;
    }

    compare.render = function (frequent) {
        compare_svg.selectAll("text").remove();

        var height = parseInt(compare_svg.style("height"), 10),
            width = parseInt(compare_svg.style("width"), 10);
        console.log(frequent.length);
        var temp = 0;
        compare_svg.selectAll("text")
            .data(frequent)
            .enter()
            .append("text")
            .attr("x", function (d, i) {
                if((i + 1) * (9) >= height){
                    return width * 0.6;
                }
                else{
                    return width * 0.3;
                }
            })
            .attr("y", function (d, i) {
                if ((i + 1) * (9) < height) {
                    temp = i;
                    return (i + 1) * (9);
                }
                else{
                    //temp = true;
                    return (i - temp) * (9);
                }
            })
            .style("font-size", "8px")
            .text(function (d, i) {
                return d.word + " " + i;
            })
    }
        
})(window.compare = window.compare || {});