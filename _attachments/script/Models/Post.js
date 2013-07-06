MH.Post = Backbone.Model.extend({
  defaults: function () {
    return { 
             text: "Default text",
             tags: "",
             date: null,
             title: "Default title"
    }
  }(),
})
