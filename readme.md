RESTful routes

name	url				verb	description											Mongoose Method
=====================================================================================================
Index	/dogs			GET		Display a list of all dogs							Dog.find()
New		/dogs/new		GET		Display form to make a new dog						N/A
Create	/dogs			POST	Add new dog to DB									Dog.create()
Show	/dogs/:id		GET		Show info about one dog								Dog.findById()
Edit	/dogs/:id/edit	GET		Show edit form for one dog							Dog.findById()
Update	/dogs/:id		PUT		Update a particular dog, then redirect somewhere	Dog.findByIdAndUpdate()
Destroy	/dogs/:id		DELETE	Delete a particular dog, then redirect somewhere	Dog.findByIdANdRemove()