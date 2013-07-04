MH.RecentPostsView = Backbone.View.extend({

  initialize: function (options) {
    this.collection.on("add", this.render, this)
    this.collection.on("remove", this.render, this)
  },

  render: function () {
    var posts = [] 
    _.each( this.collection.toJSON(), function (post) {
      var p = post
      p.text = $( $.parseHTML( p.text ) ).text().substring(0,199) + "..."
      posts.push(p)
    })
    var html = $.mustache($("#recent-posts-template").html(), {"posts":posts})
    $(this.el).html( html )
  } // End render
})
