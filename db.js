const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginSchema = new mongoose.Schema({
    email:String,
    password:String,
    page:String,
})
const loginModel = mongoose.model('login',loginSchema)
/*
-----MANUAL-----

Its Exports :-

signup ~ upload sign up details and checks same password and not have exitting email and hash password
login ~ login means jwt token create and provide in cookie and checks hashes password
valid ~ checks logged or not with jwt verify and checks id existing and return page
email ~ same as valid but return email of logged person

*/
module.exports.signup= async(signup_data)=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/',{
        dbName:'Quiz'
    })
    if(signup_data.password==signup_data.confirm_password){
        let check = await loginModel.findOne({email:signup_data.email})
    
        if(check){
            console.log("There is existing email is there.")
            return "There is existing email is there."
        }
        else{
       
        loginModel.create({email:signup_data.email,password:await bcrypt.hash(signup_data.password,10),page:signup_data.page})
        console.log("Data is Uploaded")
        
        return true;
    }
    }
    
    else{        
        return "password does not match"
    }
}
module.exports.login= async(login_data,res)=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/',{
        dbName:'Quiz'
    })
    let check = await loginModel.findOne({email:login_data.email})
    if(check){
        if(await bcrypt.compare(login_data.password,check.password)){
            if(login_data.page==check.page){
                let token = jwt.sign({"email":check._id},"dada")
                res.cookie("token",token, { maxAge: 1000000, httpOnly: true });
                return true
            }
            else{
            return "Not Acess"
        }
        }
        else{
            return "email or password is wrong"
        }
    }
    else{
        return "no email found"
    }
    
}
module.exports.valid = async(req)=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/',{
        dbName:'Quiz'
    })
    const valid = jwt.verify(req.cookies.token,"dada");
    let id = await loginModel.findById(valid.email) 
    if (id){
        return id.page
    }
    else{
        return false
    }
}

module.exports.email = async(req)=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/',{
        dbName:'Quiz'
    })
    let auth =await this.valid(req);
    const valid = jwt.verify(req.cookies.token,"dada");

    let id = await loginModel.findById(valid.email)
    return id.email; 

}