const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    votes: {
        type:Number,
        default:0
    },
    candidateId: {  // Changed from VoterId to candidateId
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    party: {  // Changed from nomineeName to party
        type: String,
        required: true
    },
    position: {  // Changed from nomineeType to position
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

candidateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        return next(error);
    }
});

candidateSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

const Candidate = mongoose.model('candidate', candidateSchema);

module.exports = Candidate;
