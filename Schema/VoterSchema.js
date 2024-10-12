const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const votingUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    VoterId: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    nomineeName: {
        type: String,
        required: true
    },
    nomineeType: {
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
    },
    votingChance: {
        type: Boolean,
        required: true,
        default: true
    }
});
votingUserSchema.pre('save',async function (next){
    if(!this.isModified('password')) next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    } catch (error) {
        return next(error);
    }
})
votingUserSchema.methods.comparePassword = async function(candidatePassword){
  try{
      // Use bcrypt to compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
  }catch(err){
      throw err;
  }
}
const VoterSchema = mongoose.model('user', votingUserSchema);

module.exports = VoterSchema;
