const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name:{type:String, trim:true, required:true},
    email:{type:String, trim:true, required:true, unique:true},
    password:{type:String, trim:true, required:true},
    picture : {type:String, trim:true, required:true, default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} // the reason we took it as a string is to store the link of the image so it can be rendered
}, {timestamps:true})

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// this denotes or tells the work that is to be performed right before saving the data after creating it
userSchema.pre('save',async function(next){

    // console.log(this.password)
    if(!this.isModified){   // this is to check if the password has been modified while saving
        next();
    }
    const salt = await bcrypt.genSalt(10)   // this function is used to generate salt which is more like random characters for hashing and more the value of salt the longer to hash and safer
    this.password = await bcrypt.hash(this.password, salt)
    // console.log(this.password)
})

const User = mongoose.model("User", userSchema);

module.exports = User;