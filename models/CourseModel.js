const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    
    title: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },
    
    display: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: 'public'
    },
    
    description: {
        type: String,
        required: true
    },
    
    creationDate: {
        type: Date,
        default: Date
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    
    allowComments: {
        type: Boolean,
        default: false
    },
    
    file: {
        type: String,
        default: ''
    }
    
    
});

module.exports = {Course: mongoose.model('course', CourseSchema )};
