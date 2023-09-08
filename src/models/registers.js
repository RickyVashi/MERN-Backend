const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bookingsSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
    },
    email :{
        type:String,
        required : true,
        unique : true
    },
   password :{
        type:String,
        required : true,
    },
    repeatpassword :{
        type:String,
        required : true,
    },
    tokens:[{
        token:{
            type:String,
            required : true,
        }
    }]
})

bookingsSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        this.repeatpassword= await bcrypt.hash(this.password,10);
    }

    next();
})

bookingsSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});

        await this.save();
        //console.log(token);
        
    } catch (error) {
        res.send("Error Part");
    }
}

//now we need to create a collections
const Register = new mongoose.model("Register",bookingsSchema);
module.exports = Register;