function(doc) {
  if (doc.type == "blog_post" && doc.date)
    emit( doc._id, doc )
}
