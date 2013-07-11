MH.CurrentPostView = Backbone.View.extend({
  render: function (post_id) {
    var that = this
    if (post_id) {
      var p = motohacker.posts.get(post_id, {auto_add: true}).toJSON()
      var html = $.mustache($("#current-post-template").html(), p)
      $(this.el).html(html)
      window.scrollTo(0,0)
    } else { // render last post
      motohacker.db.view("motohacker/listBlogPosts", {
        limit: 1,
        descending: true,
        success: function (data) {
          if (data.rows.length > 0) {
						data = { 
							id: '"' + data.rows[0].value._id + '"',
							date: data.rows[0].value.date,
							title: data.rows[0].value.title,
							text: data.rows[0].value.text,
							tags: data.rows[0].value.tags,
						};
						var html = $.mustache($("#current-post-template").html(), data)
						$(that.el).html( html )
					}
        },
      });
    }
  }
})
