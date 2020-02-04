var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var mongoose = require("mongoose");
var middleware = require("../middleware");

mongoose.set('useFindAndModify', false);
// index route
router.get("/", function(req, res){ 
	
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// Create route
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.create(req.body.campground, function(err, newlyCreated){
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// New route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// Show route
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "Campground not found");
			return res.redirect("back");
		} else {
			// console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});	
		}
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, function(err){
				if (err) {
					console.log(err);
				} else {
					res.redirect("/campgrounds");
				}
			});
		}
	});
});


module.exports = router;