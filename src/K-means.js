(function (K_means) {

    K_means.getDataRanges = function (extremes) {
        var ranges = [];

        for (var dimension in extremes) {
            ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
        }

        return ranges;

    }

    K_means.getDataExtremes = function (points) {
        
        var extremes = [];

        for (var i in points) {
            var point = points[i];

            for (var dimension in point) {
                if (!extremes[dimension]) {
                    extremes[dimension] = {
                        min: 1000,
                        max: 0
                    };
                }

                if (point[dimension] < extremes[dimension].min) {
                    extremes[dimension].min = point[dimension];
                }

                if (point[dimension] > extremes[dimension].max) {
                    extremes[dimension].max = point[dimension];
                }
            }
        }

        return extremes;

    }

    K_means.initMeans = function (k, dataExtremes, dataRange) {

        if (!k) {
            k = 3;
        }

        while (k--) {
            var mean = [];

            for (var dimension in dataExtremes) {
                mean[dimension] = dataExtremes[dimension].min + (Math.random() * dataRange[dimension]);
            }

            means.push(mean);
        }

        return means;

    };

    K_means.makeAssignments = function (points) {

        for (var i in points) {
            var point = points[i];
            var distances = [];

            for (var j in means) {
                var mean = means[j];
                var sum = 0;

                for (var dimension in point) {
                    var difference = point[dimension] - mean[dimension];
                    difference *= difference;
                    sum += difference;
                }

                distances[j] = Math.sqrt(sum);
            }

            assignments[i] = distances.indexOf(Math.min.apply(null, distances));
        }
    }

    K_means.moveMeans = function(points) {

        K_means.makeAssignments(points);

        var sums = Array(means.length);
        var counts = Array(means.length);
        var moved = false;
        console.log("moved");
        for (var j in means) {
            counts[j] = 0;
            sums[j] = Array(means[j].length);
            for (var dimension in means[j]) {
                sums[j][dimension] = 0;
            }
        }

        for (var point_index in assignments) {
            //console.log(point_index);
            var mean_index = assignments[point_index];
            var point = points[point_index];
            var mean = means[mean_index];

            counts[mean_index]++;

            for (var dimension in mean) {
                sums[mean_index][dimension] += point[dimension];
            }
        }

        for (var mean_index in sums) {
            console.log(counts[mean_index]);
            if (0 === counts[mean_index]) {
                sums[mean_index] = means[mean_index];
                console.log("Mean with no points");
                console.log(sums[mean_index]);

                for (var dimension in dataExtremes) {
                    sums[mean_index][dimension] = dataExtremes[dimension].min + (Math.random() * dataRange[dimension]);
                }
                continue;
            }

            for (var dimension in sums[mean_index]) {
                sums[mean_index][dimension] /= counts[mean_index];
            }
        }

        if (means.toString() !== sums.toString()) {
            moved = true;
        }

        means = sums;

        return moved;

    }

    K_means.run = function (points) {

        var moved = K_means.moveMeans(points);

        if (moved) {
            K_means.run(points);
        }

    }

}(window.K_means = window.K_means || {}));