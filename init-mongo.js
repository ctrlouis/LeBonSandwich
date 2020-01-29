db.createUser({
  user: "catalogue_lbs",
  pwd: "catalogue_lbs",
  roles: [{
    role: "readWrite",
    db: "catalogue_lbs"
  }]
})
