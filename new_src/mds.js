(function(mds) {
    "use strict";
    /// given a matrix of distances between some points, returns the
    /// point coordinates that best approximate the distances using
    /// classic multidimensional scaling
    mds.classic = function(distances, dimensions) {
        dimensions = dimensions || 2;

        // square distances
        var Metrix = numeric.mul(-0.5, numeric.pow(distances, 2));
        // double centre the rows/columns
        
        console.log(Metrix.length);

        function mean(A) {
            return numeric.div(numeric.add.apply(null, A), A.length);
        }

        var rowMeans = mean(Metrix),
            colMeans = mean(numeric.transpose(Metrix)),
            totalMean = mean(rowMeans);
            
        for (var i = 0; i < Metrix.length; ++i) {
            for (var j = 0; j < Metrix[0].length; ++j) {
                Metrix[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

        // take the SVD of the double centred matrix, and return the
        // points from it
        var ret = numeric.svd(Metrix),
            eigenValues = numeric.sqrt(ret.S);
        return ret.U.map(function(row) {
            return numeric.mul(row, eigenValues).splice(0, dimensions);
        });
    };

}(window.mds = window.mds || {}));
