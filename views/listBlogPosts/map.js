function(doc) {
  if (doc.type == "blog_post" && doc.date)
    emit( doc.date, doc )
}
