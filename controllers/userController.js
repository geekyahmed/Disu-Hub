const Course = require('../models/CourseModel').Course;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const {isEmpty} = require('../config/customFunctions');

module.exports = {

    index: (req, res) => {
        res.render('user/index');

    },


    /* ADMIN POSTS ENDPOINTS */


    getCourses: (req, res) => {
        Course.find()
            .populate('category')
            .then(courses => {
                res.render('user/courses/index', {courses: courses});
            });
    },


    getCreateCoursePage: (req, res) => {
        Category.find().then(cats => {

            res.render('user/courses/create', {categories: cats});
        });

                     
    },

    submitCreateCoursePage: (req, res) => {

        const commentsAllowed = !!req.body.allowComments;

        // Check for any input file
        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }

        let displayname = '';

        if (!isEmpty(req.files)) {
            let display = req.files.uploadedPic;
            displayname = display.name;
            let uploadDir = './public/uploads/';

            display.mv(uploadDir + displayname, (err) => {
                if (err)
                    throw err;
            });
        }

        const newCourse = new Course({
            title: req.body.title,
            desc: req.body.desc,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`,
            user: req.user.id,
            display: `/uploads/${displayname}`

        });

        newCourse.save().then(post => {
            req.flash('success-message', 'Course created successfully.');
            res.redirect('/user/courses');
        });
    },

    getEditCoursePage: (req, res) => {
        const id = req.params.id;

        Course.findById(id)
            .then(course => {
                Category.find().then(cats => {
                    res.render('user/courses/edit', {course: courses, categories: cats});
                });
            });
    },

    submitEditCoursePage: (req, res) => {
        const commentsAllowed = !!req.body.allowComments;
        const id = req.params.id;
        Course.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.desc = req.body.desc;
                post.status = req.body.status;
                post.allowComments = commentsAllowed;
                post.description = req.body.description;
                post.category = req.body.category;


                post.save().then(updatePost => {
                    req.flash('success-message', `The Course ${updatePost.title} has been updated.`);
                    res.redirect('/user/posts');
                });
            });
    },

    deleteCourse: (req, res) => {

        Course.findByIdAndDelete(req.params.id)
            .then(deletedCourse => {
                req.flash('success-message', `The post ${deletedCourse.title} has been deleted.`);
                res.redirect('/user/courses');
            });
    },

    /* COMMENT ROUTE SECTION*/
    getComments: (req, res) => {
        Comment.find()
            .populate('user')
            .then(comments => {
                res.render('user/comments/index', {comments: comments});
            })
    },
    
    approveComments: (req, res) => {
        var data = req.body.data;
        var commentId = req.body.id;
        
        console.log(data, commentId);

        Comment.findById(commentId).then(comment => {
            comment.commentIsApproved = data;
            comment.save().then(saved => {
                res.status(200).send('OK');
            }).catch(err => {
                res.status(201).send('FAIL');
            });
        });
    }


};

