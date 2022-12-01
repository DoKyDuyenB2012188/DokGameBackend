const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    refreshToken:{
        type: String,
        default: "",
    }
    ,
    cart:{
        apps: [
            {
              appId: {
                type: Schema.Types.ObjectId,
                ref: "apps",
                required: true,
              },
            }
        ],
    }
});

module.exports = mongoose.model('users', UserSchema);