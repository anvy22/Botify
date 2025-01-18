const mongoose = require('mongoose');
const bcrpt = require('bcrypt');
const jwt  = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [1, 'Last name must be at least 1 character long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    chatbotIds: {
        type: [String],
        default: [],
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'pro', 'enterprise'],
        default: 'free',
    },
    totalRequestCount: {
        type: Number,
        default: 0,
    },
    credit: {
        type: Number,
        default: 20,
    },
    domain: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
}, { timestamps: true });

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrpt.compare(password, this.password);
}   

userSchema.statics.hashPassword = async function(password) {    
    return await bcrpt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;