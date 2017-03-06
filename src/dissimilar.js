(function(dissimilar) {
    dissimilar.rank = function(posts, standard) {

        var q = (standard.maxlike - standard.minlike) / 4;
        var like_rank = [standard.minlike, Math.floor(standard.minlike + q), Math.floor(standard.minlike + 2 * q), Math.floor(standard.minlike + 3 * q)];
        q = (standard.maxshare - standard.minshare) / 4;
        var share_rank = [standard.minshare, Math.floor(standard.minshare + q), Math.floor(standard.minshare + 2 * q), Math.floor(standard.minshare + 3 * q)];
        console.log(like_rank);
        console.log(share_rank);

        for (var i = 0; i < posts.length; i++) {
          //============================like============================================
            if (posts[i].like <= like_rank[1] && posts[i].like > like_rank[0]) {
                posts[i].likerank = 1;
            } else if (like_rank[1] < posts[i].like && posts[i].like <= like_rank[2]) {
                posts[i].likerank = 2;
            } else if (like_rank[2] < posts[i].like && posts[i].like <= like_rank[3]) {
                posts[i].likerank = 3;
            } else if (like_rank[3] < posts[i].like) {
                posts[i].likerank = 4;
            }

          //=========================share===========================================
            if (posts[i].share <= share_rank[1] && posts[i].share > share_rank[0]) {
                posts[i].sharerank = 1;
            } else if (share_rank[1] < posts[i].share && posts[i].share <= share_rank[2]) {
                posts[i].sharerank = 2;
            } else if (share_rank[2] < posts[i].share && posts[i].share <= share_rank[3]) {
                posts[i].sharerank = 3;
            } else if (share_rank[3] < posts[i].share) {
                posts[i].sharerank = 4;
            }
          //======================hour==============================================
          var hour = posts[i].created_time.getHours();
          //console.log(hour.getHours());
          if(hour > 8 && hour <= 11){
              posts[i].hour = 2;
          }
          else if(hour > 11 && hour <= 14){
              posts[i].hour = 3;
          }
          else if(hour > 14 && hour <= 17){
              posts[i].hour = 4;
          }
          else{
              posts[i].hour = 1;
          }

          //============day========================================================
          posts[i].day = posts[i].created_time.getDay();

        }

        return posts;
    };


    dissimilar.distance = function(posts, cheak_share, cheak_emotion, cheak_like, cheak_comment) {

        var distance = [];
        for (var i = 0; i < data.length; i++) {
            distance[i] = [];
            for (var j = 0; j < data.length; j++) {
                distance[i][j] = 0
            }
        }

        for (var i = 0; i < posts.length; i++) {
            for (var j = i + 1; j < posts.length; j++) {
                //console.log(data[i].shares - data[j].shares );
                /*
                if (cheak_share) {
                    //distance[i][j] = (share_scale(posts[i].share) - share_scale(posts[j].share)) * (share_scale(posts[i].share) - share_scale(posts[j].share));
                    //distance[i][j] += Math.pow((posts[i].share - posts[j].share)/share_SD, 2);
                    if ((posts[i].share) + (posts[j].share) == 0) {
                        distance[i][j] += Math.abs(posts[i].share - posts[j].share) / (1);
                    } else {
                        distance[i][j] += Math.abs(posts[i].share - posts[j].share) / ((posts[i].share) + (posts[j].share));
                    }
                }

                if (cheak_emotion) {
                    //distance[i][j] += Math.pow((posts[i].emotion - posts[j].emotion)/emotion_SD, 2);
                    distance[i][j] += Math.abs(posts[i].emotion - posts[j].emotion) / ((posts[i].emotion) + (posts[j].emotion));
                }

                if (cheak_like) {
                    //distance[i][j] += (like_scale(posts[i].like) - like_scale(posts[j].like)) * (like_scale(posts[i].like) - like_scale(posts[j].like));
                    //distance[i][j] += Math.pow((posts[i].like - posts[j].like)/like_SD, 2);
                    distance[i][j] += Math.abs(posts[i].like - posts[j].like) / ((posts[i].like) + (posts[j].like));

                }

                if (cheak_comment) {
                    //distance[i][j] += Math.pow((posts[i].comment - posts[j].comment)/comment_SD, 2);
                    var temp;
                    distance[i][j] += Math.abs(posts[i].comment - posts[j].comment) / ((posts[i].comment) + (posts[j].comment));
                    if ((posts[i].comment) + (posts[j].comment) == 0) {
                        distance[i][j] += Math.abs(posts[i].comment - posts[j].comment) / (1);
                        temp = Math.abs(posts[i].comment - posts[j].comment) / (1);
                    } else {
                        distance[i][j] += Math.abs(posts[i].comment - posts[j].comment) / ((posts[i].comment) + (posts[j].comment));
                        temp = Math.abs(posts[i].comment - posts[j].comment) / ((posts[i].comment) + (posts[j].comment));
                    }
                }

                //distance[i][j] = Math.sqrt(distance[i][j]);
                distance[j][i] = distance[i][j];
                */

                distance[i][j] += Math.pow((posts[i].comment - posts[j].comment), 2);
                distance[i][j] += Math.pow((posts[i].likerank - posts[j].likerank), 2);
                distance[i][j] += Math.pow((posts[i].sharerank - posts[j].sharerank), 2);
                distance[i][j] += Math.pow((posts[i].hour - posts[j].hour), 2);
                //distance[i][j] += Math.pow((posts[i].day - posts[j].day), 2);

                distance[i][j] = Math.sqrt(distance[i][j]);
                distance[j][i] = distance[i][j];

            }
        }

        console.log(distance);

        //================================================distance matrix end=========================================================

        return distance;
    };
}(window.dissimilar = window.dissimilar || {}));
