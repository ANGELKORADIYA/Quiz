const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginSchema = new mongoose.Schema({
    email:String,
    password:String,
    page:String,
})
const loginModel = mongoose.model('login',loginSchema)
require('dotenv').config({ path: 'config.env' });
const DBurl=process.env.DB_URL;
const secretKey = process.env.SECRET_KEY
const PASSWORD_KEY = Number(process.env.PASSWORD_KEY);
/*
-----MANUAL-----

Its Exports :-

signup ~ upload sign up details and checks same password and not have exitting email and hash password
login ~ login means jwt token create and provide in cookie and checks hashes password
valid ~ checks logged or not with jwt verify and checks id existing and return page
email ~ same as valid but return email of logged person

*/
module.exports.signup= async(signup_data)=>{
    let a = await mongoose.connect(DBurl,{
        dbName:'Quiz'
    })
    if(signup_data.password==signup_data.confirm_password){
        let check = await loginModel.findOne({email:signup_data.email})
    
        if(check){
            console.log("There is existing email is there.")

            return {success: false, error: "An account with this email already exists"}
        }
        else{
       
        loginModel.create({email:signup_data.email,password:await bcrypt.hash(signup_data.password,PASSWORD_KEY),page:signup_data.page})
        console.log("Data is Uploaded")
        return {success: true};
    }
    }
    
    else{        

        return {success: false, error: "Passwords do not match"}
    }
}
module.exports.login= async(login_data,res)=>{
    await mongoose.connect(DBurl,{
        dbName:'Quiz'
    })
    let check = await loginModel.findOne({email:login_data.email})
    if(check){
        if(await bcrypt.compare(login_data.password,check.password)){
            // Auto-detect user type from database instead of requiring it from form
            let token = jwt.sign({"email":check._id},secretKey)
            res.cookie("token",token, { maxAge: 1000000, httpOnly: true });
            return {success: true, page: check.page} // Return user type
        }
        else{
            return {success: false, error: "Invalid password"}
        }
    }
    else{
        return {success: false, error: "No account found with this email"}
    }
    
}
module.exports.valid = async(req)=>{
    await mongoose.connect(DBurl,{
        dbName:'Quiz'
    })
    const valid = jwt.verify(req.cookies.token,secretKey);
    let id = await loginModel.findById(valid.email) 
    if (id){
        return id.page
    }
    else{
        return false
    }
}

module.exports.email = async(req)=>{
    await mongoose.connect(DBurl,{
        dbName:'Quiz'
    })
    let auth =await this.valid(req);
    const valid = jwt.verify(req.cookies.token,secretKey);

    let id = await loginModel.findById(valid.email)
    return id.email; 

}