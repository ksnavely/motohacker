MH.MHRouter = Backbone.Router.extend({
  routes: {
    "post/:post_id": "openPost"
  },

  openPost: function (post_id) {
    motohacker.currentPostView.render( post_id ) 
  }
})
