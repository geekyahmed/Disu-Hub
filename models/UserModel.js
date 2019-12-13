const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    fullname: {
        type: String,
        required: true
    },
    
    username: {
        type: String,
        required: true
    },

    country: {
      type: String,
      },
      
      pic: {
          type: String,
          default: "/public/img/client/client-3.png"
      },
  bio: {
    type: String,
	},

    email: {
        type: String,
        required: true
	},

	role: {
        type: Schema.Types.ObjectId,
        ref: 'role'
    },
    
    password: {
        type: String,
        required: true
    }


});

module.exports = {User: mongoose.model('user', UserSchema )};