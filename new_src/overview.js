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
})(window.overview = window.overview || {});