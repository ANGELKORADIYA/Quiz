const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { email, valid } = require('./db')
const quizschema = new mongoose.Schema({
    email: String,
    title: String,
    arr: Array,
    questions: Array,
    answer: Array,
    page: String,
    id:String
})
const quizmodel = mongoose.model('quiz', quizschema)


/*

-----MANUAL-----

Its Exports :-
indexxx ~ upload structure of quiz and checks not same title used in one email
questionsss ~ upload quesion of quiz & answer of quiz and checks not same title used in one email
kitteninfo ~ return array for that email



*/
module.exports.indexxx = async (req) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'Quiz' })
    let auth = await valid(req);
    if (auth == 'faculty') {
        let email2 = await email(req);

        let check = await quizmodel.findOne({ title: req.body.parcel_title, email: email2 })

        if (check) {
            console.log("There is existing email is there.")
            return "There is existing email is there."
        }
        else {

            await quizmodel.create({ email: email2, arr: req.body.parcel, title: req.body.parcel_title, page: auth })
            console.log("Data is Uploaded")

            return true;
        }
    }
}
module.exports.questionsss = async (req) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'Quiz' })
    let auth = await valid(req);
    if (auth == 'faculty') {
        let emaill = await email(req);

        let check = await quizmodel.findOne({ title: req.body.parcel_title, email: emaill, page: auth })
        let { parcel_title, parcel, parcel_answer } = req.body
        if (check) {
            let newvalues = { $set: { questions: parcel, answer: parcel_answer } };
            let infoo = await quizmodel.updateOne({ title: parcel_title, email: emaill }, newvalues);
            await infoo;
            return true
        }
        else {
            console.log("Data not is uploaded")

            return false;
        }
    }
}
module.exports.answerfromstudent = async (req) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'Quiz' })
    let auth = await valid(req);
    if (auth == 'student') {
        let emaill = await email(req);
        let answer=[],ret=[];
        let check = await quizmodel.findOne({ title: req.body.parcel_title, email: emaill, page: auth })
        let { parcel_title, parcel } = req.body
        let x = await quizmodel.findOne({page:"faculty",title:req.body.parcel_title},{answer:true ,title:true,_id:false}).exec();
        console.log(x)
        x=x.answer
            for (let i = 0; i < parcel.length; i++) {
                answer[i]=[]
                for (let j = 0; j < parcel[i].length; j++) {

                    
                    answer[i][j]=0
                }
                
                
            }
            for (let i = 0; i < parcel.length; i++) {
                for (let j = 0; j < parcel[i].length; j++) {
                    if(parcel[i][j]==x[i][j]){
                        answer[i][j]++;
                    }
                    
                }
                
            }
            for (let i = 0; i < answer.length; i++) {
                const element = answer[i];
                let sum=0;
                for (let j = 0; j < element.length; j++) {
                    sum+=element[j]
                }
                ret[i]=sum;
            }
        if (!check) {
            await quizmodel.create({ email: emaill, answer:ret, title: parcel_title, page: auth });
            return true
        }
        else {
            console.log("Data not is uploaded")

            return false;
        }
    }
}
module.exports.response = async (req) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'Quiz' })
    let auth = await valid(req);
    let infoo;
    if (auth == 'faculty') {
        infoo = await loginmodel.find({ name: "login", id:parcel,page:'student'}).exec();}
    for(let i=0;i<infoo.length;i++){}
    infoo=infoo.map(({ login_id,answer})=>{ 

        return { login_id,answer};
      
      });
      console.log(infoo)
    return infoo
    }

module.exports.kitteninfo = async (req) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'Quiz' })
    let auth = await valid(req);
    if (auth == 'faculty') {
        let email2 = await email(req);
        let ret = new Array;
        let check = await quizmodel.find({ page: "faculty", email: email2 }, { title: true, _id: false, arr: true }, { lean: true }).exec();
        for (let i = 0; i < check.length; i++) {
            const element = check[i];
            ret.push(element)
        }
        if (check) {
            return ret
        }
    }
    else if (auth == "student") {
        let emaill = await email(req);
        let ret = new Array;
        let check = await quizmodel.find({ page: "faculty" }, { title: true, _id: false, questions: true }, { lean: true }).exec();
        for (let i = 0; i < check.length; i++) {
            if (await quizmodel.findOne({ page: "student", email: emaill,title:check[i].title })) { 
                
            }
            else {
                const element = check[i];
                ret.push(element)
            }
        }

        if (check) {
            return ret
        }
    }
}

module.exports.responseinfo = async (req) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'Quiz' })
    let auth = await valid(req);
    if (auth == 'faculty') {
        let email2 = await email(req);
        let ret = new Array;
        let check = await quizmodel.find({ page: "student"}, { title: true, _id: false, answer:true ,email:true}, { lean: true }).exec();
        let x = await quizmodel.find({page:"faculty",email:email2},{title:true,_id:false})

        for (let i = 0; i < check.length; i++) {
            for (let j = 0; j < x.length; j++) {
                if(check[i].title==x[j].title){
                const element = check[i];
                ret.push(element)}
                
            }
            }
            
        
        if (check) {
            return ret
        }
    }
    
}

