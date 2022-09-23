const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


// change name to userName, and add unique
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email : {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
})

// hashes the password before saving it
userSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }

    next()
})

// compares the given password with the stored password
userSchema.methods.comparePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password)
    return result
}


module.exports = mongoose.model("User", userSchema)