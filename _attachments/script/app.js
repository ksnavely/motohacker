var MH = function () {
  // friendly helper http://tinyurl.com/6aow6yn
  $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name]) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              // Remove the script tags from the text
              o[this.name].push( this.value.replace(/<script[^>]*>.*?<\/script>/gi,'') || '' );
          } else {
              // Remove the script tags from the text
              o[this.name] = ( this.value.replace(/<script[^>]*>.*?<\/script>/gi,'') || '' );
          }
      });
      return o;
  }
  $("#account").couchLogin()
  // Check the rewrite.json for more info
  this.db = $.couch.db("motohacker")

  // Events
  $("#new-post-a")[0].addEventListener("click", this.renderNewMessageArea)

  // Load posts
  this.renderLastPost()
  this.renderRecentPosts()
}

MH.prototype.renderPost = function (post_id) {
  this.db.view("motohacker/listBlogPostsById", {
    keys: [post_id],
    success: function (data) {
      if (data.rows.length == 0) {
        alert("The blog post with _id: " + post_id + " could not be opened.")
      }
      data = { 
        id: '"' + data.rows[0].value._id + '"',
        date: data.rows[0].value.date,
        title: data.rows[0].value.title,
        text: data.rows[0].value.text,
        tags: data.rows[0].value.tags,
      };
      var html = $.mustache($("#current-post-template").html(), data)
      $("#current-post-area").html( html )
      window.scrollTo(0,0)
    },
    error: function (status) {
      alert("The blog post with _id: " + post_id + " could not be opened.")
    }
  });
},

MH.prototype.renderLastPost =  function () {
  this.db.view("motohacker/listBlogPosts", {
    limit: 1,
    descending: true,
    success: function (data) {
      data = { 
        id: '"' + data.rows[0].value._id + '"',
        date: data.rows[0].value.date,
        title: data.rows[0].value.title,
        text: data.rows[0].value.text,
        tags: data.rows[0].value.tags,
      };
      var html = $.mustache($("#current-post-template").html(), data)
      $("#current-post-area").html( html )
    },
  });
}

MH.prototype.renderRecentPosts =  function () {
  this.db.view("motohacker/listBlogPosts", {
    limit: 10,
    descending: true,
    success: function (data) {
      var posts = []
      _.each( data.rows, function (row) {
        var post = {
          id: '"' + row.value._id + '"',
          date: row.value.date,
          title: row.value.title,
          text: $( $.parseHTML( row.value.text ) ).text().substring(0,199) + "...",
          tags: row.value.tags,
        }
        posts.push( post )
      });
      var html = $.mustache($("#recent-posts-template").html(), {"posts":posts})
      $("#recent-posts-area").html( html )
      $("#recent-posts-area .recent-post-title").click( function (e) {
        mh.renderPost( e.target.id )
      })
    },
  });
}

MH.prototype.renderNewMessageArea = function () {
  $("#new-post-area").html( $("#new-post-template").html() )
  $("#new-post-submit")[0].addEventListener("click", mh.submitNewMessage)
  $("#new-post-cancel")[0].addEventListener("click", location.reload)
}

MH.prototype.submitNewMessage = function () {
  var post = $("#new-post-form").serializeObject()
  post.type = "blog_post"
  post.date = new Date()
  mh.db.saveDoc( post, {
    success: function(response, textStatus, jqXHR){
          console.log(response);
          window.location.reload()
   },
    error: function(jqXHR, textStatus, errorThrown){
          console.log(errorThrown);
   },
  })
}
