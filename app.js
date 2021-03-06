var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	seedDB 			= require("./seeds");

// requiring routes
var commentRoutes 	= require("./routes/comments"),
	campgroundRoutes= require("./routes/campgrounds"),
	indexRoutes		= require("./routes/index");

// mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(function(){
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR: ", err.message);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// local version
// app.listen(3000, function() {
// 	 console.log("Server has started!!");
// });

// deploy version
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	 console.log("Server has started!!");
});