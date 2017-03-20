(function(dissimilar) {
    dissimilar.rank = function(posts, standard) {

        for (var i = 0; i < posts.length; i++) {
      
          //======================hour==============================================
          var hour = posts[i].created_time.getHours();
          //console.log(hour.getHours());
          if(hour > 7   && hour <= 11){
              posts[i].hour = 2;
          }
          else if(hour > 11 && hour <= 14){
              posts[i].hour = 3;
          }
          else if(hour > 14 && hour <= 17){
              posts[i].hour = 4;
          }
          else if(hour > 17 && hour <= 20){
              posts[i].hour = 5;
          }
          else if(hour > 20 && hour <= 24){
              posts[i].hour = 6;
          }
          else{
              posts[i].hour = 1;
          }

          //============day========================================================
          posts[i].day = posts[i].created_time.getDay();

        }

        //============================like rnak============================================
        posts.sort(function (a, b) {
                return new Date(a.like) - new Date(b.like);
            });

        var q_pos = [];
        q_pos[0] = (posts.length + 1) / 4;
        q_pos[1] = (posts.length + 1) / 2;
        q_pos[2] = 3 * (posts.length + 1) / 4;

        console.log(q_pos);
        console.log(q_pos[0] / 1.0);

        like_rank = [];

        for(var i = 0; i < q_pos.length; i++){
            var ind = Math.floor(q_pos[i]), per = q_pos[i] % 1;
            console.log(ind);
            like_rank[i] = posts[ind].like + ((posts[ind + 1].like - posts[ind].like) * per);
        }

        console.log(like_rank);
        for (var i = 0; i < posts.length; i++) {

            if (posts[i].like < like_rank[0]) {
                posts[i].likerank = 1;
            } else if (posts[i].like < like_rank[1] && posts[i].like >= like_rank[0]) {
                posts[i].likerank = 2;
            } else if (posts[i].like < like_rank[2] && posts[i].like >= like_rank[1]) {
                posts[i].likerank = 3;
            } else if (posts[i].like > like_rank[2]) {
                posts[i].likerank = 4;
            }

        }

        //============================share rank============================================

        posts.sort(function (a, b) {
                return new Date(a.share) - new Date(b.share);
            });

        share_rank = [];

        for(var i = 0; i < q_pos.length; i++){
            var ind = Math.floor(q_pos[i]), per = q_pos[i] % 1;
            console.log(ind);
            share_rank[i] = posts[ind].share + ((posts[ind + 1].share - posts[ind].share) * per);
        }

        console.log(share_rank);
        for (var i = 0; i < posts.length; i++) {

            if (posts[i].share < share_rank[0]) {
                posts[i].sharerank = 1;
            } else if (posts[i].share < share_rank[1] && posts[i].share >= share_rank[0]) {
                posts[i].sharerank = 2;
            } else if (posts[i].share < share_rank[2] && posts[i].share >= share_rank[1]) {
                posts[i].sharerank = 3;
            } else if (posts[i].share > share_rank[2]) {
                posts[i].sharerank = 4;
            }

        }

        return posts;
    };


    dissimilar.distance = function(posts, standard) {

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
                //distance[i][j] += Math.pow((posts[i].like - posts[j].like), 2) * (1 / standard.maxlike);
                //distance[i][j] += Math.pow((posts[i].share - posts[j].share), 2) * (1 / standard.maxshare);
                //distance[i][j] += Math.pow((posts[i].hour - posts[j].hour), 2);
                distance[i][j] += Math.pow((posts[i].likerank - posts[j].likerank), 2);
                distance[i][j] += Math.pow((posts[i].sharerank - posts[j].sharerank), 2);
                distance[i][j] += Math.pow((posts[i].reactions.love - posts[j].reactions.love), 2);
                distance[i][j] += Math.pow((posts[i].reactions.haha - posts[j].reactions.haha), 2);
                distance[i][j] += Math.pow((posts[i].reactions.wow - posts[j].reactions.wow), 2);
                distance[i][j] += Math.pow((posts[i].reactions.angry - posts[j].reactions.angry), 2);
                distance[i][j] += Math.pow((posts[i].reactions.sad - posts[j].reactions.sad), 2);
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
