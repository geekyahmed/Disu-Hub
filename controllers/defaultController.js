const Course = require("../models/CourseModel").Course;
const Category = require("../models/CategoryModel").Category;
const Comment = require("../models/CommentModel").Comment;
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel").User;

module.exports = {
  index: async (req, res) => {
    const courses = await Course.find();
    const categories = await Category.find();
    res.render("default/index", { courses: courses, categories: categories });
  },

  NotFoundGet: (req, res) => {
    res.render("default/404", { message: req.flash("error") });
  },

  /* LOGIN ROUTES */
  loginGet: (req, res) => {
    res.render("default/login", { message: req.flash("error") });
  },

  loginPost: (req, res) => {},

  /* REGISTER ROUTES*/

  registerGet: (req, res) => {
    res.render("default/register");
  },

  registerPost: (req, res) => {
    let errors = [];

    let picname = '';

    if ((req.files)) {
        let pic = req.files.uploadedImg;
        picname = pic.name;
        let uploadDir = './public/uploads/';

        pic.mv(uploadDir + picname, (err) => {
            if (err)
                throw err;
        });
    }


    if (!req.body.fullname) {
      errors.push({ message: "Fullname is mandatory" });
    }
    if (!req.body.username) {
      errors.push({ message: "Username is mandatory" });
    }
    if (!req.body.email) {
      errors.push({ message: "Email field is mandatory" });
    }
    if (!req.body.pic ) {
      errors.push({ message: "Picture field is mandatory" });
    }
    if (!req.body.password || !req.body.passwordConfirm) {
      errors.push({ message: "Password field is mandatory" });
    }
    if (req.body.password !== req.body.passwordConfirm) {
      errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
      res.render("default/register", {
        errors: errors,
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email
      });
    } else {
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          req.flash("error-message", "Email already exists, try to login.");
          res.redirect("/login");
        } else {
          const newUser = new User(req.body);

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              newUser.save().then(user => {
                req.flash("success-message", "You are now registered");
                res.redirect("/login");
              });
            });
          });
        }
      });
    }
  },

  getSingleCourse: (req, res) => {
    const id = req.params.id;
    const courses =  Course.find();
    const categories =  Category.find();

    Course.findById(id)
      .populate({ path: "comments", populate: { path: "user", model: "user" } })
      .then(course => {
        if (!course) {
          res.status(404).redirect("/404");
        } else {
          res.render("default/singlePost", {
            course: course,
            comments: course.comments,
            courses: courses, categories: categories
          });
        }
      });
  },

  submitComment: (req, res) => {
    if (req.user) {
      Course.findById(req.body.id).then(course => {
        const newComment = new Comment({
          user: req.user.id,
          body: req.body.comment_body
        });

        course.comments.push(newComment);
        course.save().then(savedPost => {
          newComment.save().then(savedComment => {
            req.flash(
              "success-message",
              "Your comment was submitted for review."
            );
            res.redirect(`/course/${course.id}`);
          });
        });
      });
    } else {
      req.flash("error-message", "Login first to comment");
      res.redirect("/login");
    }
  }
};
