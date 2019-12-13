const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({

    title: {
        type: String,
        required: true
    }


});

module.exports = {Role: mongoose.model('role', RoleSchema )};