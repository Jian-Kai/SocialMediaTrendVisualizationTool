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
        for (var i = 0; i < posts.length; i++) {
            distance[i] = [];
            for (var j = 0; j < posts.length; j++) {
                distance[i][j] = 0
            }
        }

        for (var i = 0; i < posts.length; i++) {
            for (var j = i + 1; j < posts.length; j++) {

                
                distance[i][j] += Math.pow((posts[i].log_comment - posts[j].log_comment), 2) ;
                distance[i][j] += Math.pow((posts[i].log_like - posts[j].log_like), 2);
                distance[i][j] += Math.pow((posts[i].log_share - posts[j].log_share), 2);
                distance[i][j] += Math.pow((posts[i].message_length - posts[j].message_length), 2);
                
                
                /*
                distance[i][j] += Math.pow((posts[i].comment - posts[j].comment), 2) ;
                distance[i][j] += Math.pow((posts[i].like - posts[j].like), 2);
                distance[i][j] += Math.pow((posts[i].share - posts[j].share), 2);
                distance[i][j] += Math.pow((posts[i].message_length - posts[j].message_length), 2);
                */

               /*
                //distance[i][j] += Math.pow((posts[i].reactions.love - posts[j].reactions.love), 2);
                distance[i][j] += Math.pow((posts[i].reactions.haha - posts[j].reactions.haha), 2);
                //distance[i][j] += Math.pow((posts[i].reactions.wow - posts[j].reactions.wow), 2);
                distance[i][j] += Math.pow((posts[i].reactions.angry - posts[j].reactions.angry), 2);
                distance[i][j] += Math.pow((posts[i].reactions.sad - posts[j].reactions.sad), 2);
               */

                //distance[i][j] += Math.pow((posts[i].created_time.getDay() - posts[j].created_time.getDay()), 2);

                distance[i][j] = Math.sqrt(distance[i][j]);
                distance[j][i] = distance[i][j];
            }
        }

        console.log(distance);

        //================================================distance matrix end=========================================================

        return distance;
    };
}(window.dissimilar = window.dissimilar || {}));
