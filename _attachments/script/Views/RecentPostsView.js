MH.RecentPostsView = Backbone.View.extend({
  render: function () {
    var that = this
    motohacker.db.view("motohacker/listBlogPosts", {
      limit: 10,
      descending: true,
      success: function (data) {
        var posts = []
        _.each( data.rows, function (row) {
          var post = {
            url: '#post/' + row.value._id,
            date: row.value.date,
            title: row.value.title,
            text: $( $.parseHTML( row.value.text ) ).text().substring(0,199) + "...",
            tags: row.value.tags,
          }
          posts.push( post )
        });
        var html = $.mustache($("#recent-posts-template").html(), {"posts":posts})
        $(that.el).html( html )
      },
    });
  } // End render
})
