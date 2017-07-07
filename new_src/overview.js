(function (overview) {
    overview.distance = function (posts) {
        var distance_matrix = [];
        for (var i = 0; i < posts.length; i++) {
            distance_matrix[i] = [];
            for (var j = 0; j < posts.length; j++) {
                distance_matrix[i][j] = 0;
            }
        }

        for (var i = 0; i < posts.length; i++) {
            for (var j = i + 1; j < posts.length; j++) {


                distance_matrix[i][j] += Math.pow((posts[i].log_comment - posts[j].log_comment), 2);
                distance_matrix[i][j] += Math.pow((posts[i].log_like - posts[j].log_like), 2);
                distance_matrix[i][j] += Math.pow((posts[i].log_share - posts[j].log_share), 2);
                distance_matrix[i][j] += Math.pow((posts[i].message_length - posts[j].message_length), 2);
                distance_matrix[i][j] += Math.pow((posts[i].total_reply - posts[j].total_reply), 2);


                distance_matrix[i][j] = Math.sqrt(distance_matrix[i][j]);
                distance_matrix[j][i] = distance_matrix[i][j];
            }
        }

        //console.log(distance_matrix);

        var Y = mds.classic(distance_matrix);
        //console.log(Y);

        //==========================t-sne==========================================================
        var opt = {}
        opt.epsilon = 10; // epsilon is learning rate (10 = default)
        opt.perplexity = 15; // roughly how many neighbors each point influences (30 = default)
        opt.dim = 2; // dimensionality of the embedding (2 = default)

        var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

        tsne.initDataDist(distance_matrix, Y);


        for (var k = 0; k < 1000; k++) {
            tsne.step(); // every time you call this, solution gets better
        }

        var P = tsne.getSolution(); // Y is an array of 2-D points that you can plot
        //==========================t-sne==========================================================

        //console.log((P));

        //var P = mds.classic(dis_distance);
        var Positions = numeric.transpose(P);

        //console.log(Positions);

        return Positions;
    }
    overview.rander = function (position) {

        var x = (position)[0],
            y = (position)[1];

        var Xscale = d3.scaleLinear().domain([d3.min(x), d3.max(x)]).range([10, parseInt(overview_svg.style("width"), 10) - 10]);
        var Yscale = d3.scaleLinear().domain([d3.max(y), d3.min(y)]).range([10, parseInt(overview_svg.style("height"), 10) - 10]);


        overview_svg.append("g")
            .selectAll("circle")
            .data(posts)
            .enter()
            .append("circle")
            .attr("class", "post_node")
            .attr("cx", function (d, i) {
                return Xscale(position[0][i]);
            })
            .attr("cy", function (d, i) {
                return Yscale(position[1][i]);
            })
            .attr("r", 2.5)
            .attr("fill", "red");

    }
})(window.overview = window.overview || {});