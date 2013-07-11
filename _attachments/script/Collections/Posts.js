MH.Posts = Backbone.Collection.extend({
  model: MH.Post,
  url: "/posts",

  get: function (id, options) {
    var model
    model = Backbone.Collection.prototype.get.call(this, id, options)
    if (model) {
      return model
    } else if (options && options.auto_add) {
      motohacker.db.openDoc( id, { success: function (data) {
        model = new Post(data) 
      }})
    }

    if (model) {
      this.add( model )
      return model
    }
  },

  getRecentPosts: function (number) {
    var that = this
    var posts = []
    motohacker.db.view("motohacker/listBlogPosts", {
      limit: number ? number : 10,
      descending: true,
      success: function (data) {
        _.each( data.rows, function (row) {
          var post = new MH.Post ({
            id: row.value._id,
            date: row.value.date,
            title: row.value.title,
            text: row.value.text,
            tags: row.value.tags,
          })
          posts.push( post )
        })
        that.add( posts )
      } //End success
    }) // End view
  }, // End getRecentPosts

  searchForPosts: function (start_date, end_date, text) {
    var that = this
    var posts = []
    motohacker.db.view("motohacker/listBlogPosts", {
      descending: true,
      startkey: start_date,
      endkey: end_date,
      success: function (data) {
	that.reset()
        _.each( data.rows, function (row) {
          var post = new MH.Post ({
            id: row.value._id,
            date: row.value.date,
            title: row.value.title,
            text: row.value.text,
            tags: row.value.tags,
          })
          posts.push( post )
        })
        that.add( posts )
      } //End success
    }) // End view
  }
})
