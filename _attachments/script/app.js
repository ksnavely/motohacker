window.MH = function () {
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

  // Application singletons
  this.mhRouter = new MH.MHRouter()
  this.posts = new MH.Posts()
  this.recentPostsView = new MH.RecentPostsView({"el": $("#recent-posts-area"), "collection": this.posts})
  this.currentPostView = new MH.CurrentPostView({"el": $("#current-post-area")})
  Backbone.history.start()
}

MH.prototype.init = function () {
  // Events
  $("#new-post-a")[0].addEventListener("click", this.renderNewMessageArea)
  $("#search-link-a")[0].addEventListener("click", this.renderSearchArea)
  // Load posts
  this.posts.getRecentPosts(10)
  this.currentPostView.render()
}

MH.prototype.renderSearchArea = function () {
  $("#top-area").html( $("#search-template").html() )
  $("#start-date").datepicker()
  $("#end-date").datepicker()
  $("#search-cancel")[0].addEventListener("click", function () {$("#top-area").empty()})
  $("#search-submit")[0].addEventListener("click", function () {
    // Setup the date range
    var start_date = $("#start-date").val()
    var end_date = $("#end-date").val()
    start_date = (start_date === "") ? new Date( "01/01/2013" ) : new Date( start_date )
    end_date = (end_date === "") ? new Date() : new Date( end_date )
    motohacker.posts.searchForPosts( start_date.toISOString(), end_date.toISOString(), [] )
  })
}

MH.prototype.renderNewMessageArea = function () {
  $("#top-area").html( $("#new-post-template").html() )
  $("#new-post-submit")[0].addEventListener("click", motohacker.submitNewMessage)
  $("#new-post-cancel")[0].addEventListener("click", function () {$("#top-area").empty()})
}

MH.prototype.submitNewMessage = function () {
  var post = $("#new-post-form").serializeObject()
  post.type = "blog_post"
  post.date = new Date()
  post.tags = post.tags.split(" ")
  // Event context!!!
  motohacker.db.saveDoc( post, {
    success: function(response, textStatus, jqXHR){
          console.log(response);
          window.location.reload()
   },
    error: function(jqXHR, textStatus, errorThrown){
          console.log(errorThrown);
   },
  })
}
