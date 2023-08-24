const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
var bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

// const fs = require("fs")
require('dotenv').config({ path: 'config.env' });
const DBurl=process.env.DB_URL;
const secretKey = process.env.SECRET_KEY
const PASSWORD_KEY = Number(process.env.PASSWORD_KEY);

// Example usage

const { signup, login, valid } = require("./db")
const { indexxx, kitteninfo, questionsss, answerfromstudent,responseinfo ,response,resultinfo} = require("./dbquiz")

const baseUrl = "https://quiz-3hxz.onrender.com/";
const goHomeBtn = `<br><br><br><button style="font-size:25px" onclick="window.location='${baseUrl}'">Click Here to go Home Page</button>`
const port = 8383;
const app = express();

app.use(express.json())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
// app.use()


/*

-----MANUAL-----

Its answer for get requests:-


/ ~ provide login page and if cookies has token then checks and redirect to baseUrl/logined/:page & provide page page which is student or faculty
/baseUrl/logined/:pagee/create ~ checks login and provide faculty/page = / of faculty
/baseUrl/logined/:pagee ~ checks login and provide faculty/page = / of faculty
/baseUrl/logined/:pagee/update ~ provide faculty_update and check login

/baseUrl/logined/:pagee/update/kitten ~ checks login and provide array of quiz structure which is in db for that email 
/baseUrl/logined/student/quizinfo ~ checks login and provide array of quiz structure which is in db for that email 


Its answer for post requests:-
/baseUrl/logined/faculty/create/indexxx ~ upload structure of quiz by use of indexxx
/baseUrl/logined/faculty/update/questionsss ~ upload question and answer of quiz by use of questionsss
/baseUrl/login ~ upload login data and checks by login
/baseUrl/signup ~ upload sign data and checks by signup
/baseUrl/logined/logout ~ clear cookie and go to home page

Its answer for post requests:-


*/
app.get("/", async (req, res) => {
    if (req.cookies.token) {
        let page = await valid(req);
        if(page=="faculty"){
            res.redirect(baseUrl + "logined/" + page +"/create")

        }
        else if(page=="student"){
        res.redirect(baseUrl + "logined/" + page)
        }
    }
    else {
        res.sendFile(path.join(__dirname, "public", "login.html"));
    }
})

app.post("/logined/faculty/create/indexxx", async (req, res) => {
    let page = await valid(req);
    if (page == 'faculty') {
        let sucess = await indexxx(req);
        if (sucess === true) {
            res.status(200).end();
            // res.redirect(baseUrl+"logined/"+page+'/update');
        }
        else {
            res.status(401).send("<h1>login first <br>" + sucess + "</h1>" + goHomeBtn)
        }



    } else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)

    }
})
app.post("/logined/faculty/update/questionsss", async (req, res) => {
    let page = await valid(req);
    if (page == 'faculty') {
        let sucess = await questionsss(req);
        if (sucess === true) {
            res.status(200).end();
            // res.redirect(baseUrl+"logined/"+page+'/update');
        }
        else {
            res.status(401).send("<h1>login first <br>" + sucess + "</h1>" + goHomeBtn)
        }



    } else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)

    }
})

app.post("/logined/:pagee/answerrr", async (req, res) => {
    let page = await valid(req)
    if (page == req.params.pagee) {
        let sucess = await answerfromstudent(req);
        if (sucess == true) {

            res.status(200).end();

        }
        else {
            res.status(401).send("<h1>login first <br>" + sucess + "</h1>" + goHomeBtn)
        }
    } else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)

    }
})

app.get("/logined/:pagee/create", async (req, res) => {
    if (req.cookies.token) {
        let page = await valid(req);
        if (page == req.params.pagee) {
            res.status(200).sendFile(path.join(__dirname, "public", `${page}.html`))
        }
        else {
            res.status(404).send("<h1>your not access to the site</h1>" + goHomeBtn)
        }
    }
    else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)
    }
})





app.get("/logined/:pagee/update/kitten", async (req, res) => {
    let page = await valid(req)
    if (page == req.params.pagee) {
        res.status(200).json(await kitteninfo(req))
    }

})

app.get("/logined/:pagee/response/kitten", async (req, res) => {
    let page = await valid(req)
    if (page == req.params.pagee) {
        res.status(200).json(await responseinfo(req))
    }

})
app.get("/logined/:pagee/resulttttss", async (req, res) => {
    let page = await valid(req)
    if (page == req.params.pagee) {
        res.status(200).json(await resultinfo(req))
    }

})
app.get("/logined/:pagee/quizinfo", async (req, res) => {
    let page = await valid(req)
    if (page == req.params.pagee) {
        res.status(200).json(await kitteninfo(req))

    }
    else {
            res.status(404).send("<h1>your not access to the site</h1>" + goHomeBtn)
        }

})
app.get("/logined/:pagee/update", async (req, res) => {
    if (req.cookies.token) {
        let page = await valid(req);
        if (page == req.params.pagee) {
            res.status(200).sendFile(path.join(__dirname, "public", `${page}_update.html`))
        }
        else {
            res.status(404).send("<h1>your n    ot access to the site</h1>" + goHomeBtn)
        }
    }
    else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)
    }
})
app.get("/logined/:pagee/response", async (req, res) => {
    if (req.cookies.token) {
        let page = await valid(req);
        if (page == req.params.pagee) {
            res.status(200).sendFile(path.join(__dirname, "public", `response.html`))
        }
        else {
            res.status(404).send("<h1>your not access to the site</h1>" + goHomeBtn)
        }
    }
    else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)
    }
})
app.get("/logined/:pagee/result",async(req,res)=>{
    if (req.cookies.token) {
        let page = await valid(req);
        if (page == req.params.pagee) {
                res.status(200).sendFile(path.join(__dirname, "public", `${"result"}.html`))
            }
            else {
                res.status(404).send("<h1>your not access to the site</h1>" + goHomeBtn)
            }
        }
        else {
            res.status(404).send("<h1>login first</h1>" + goHomeBtn)
        }
})
app.get("/logined/:pagee", async (req, res) => {
    if (req.cookies.token) {
        let page = await valid(req);
        if (page == req.params.pagee) {
            res.status(200).sendFile(path.join(__dirname, "public", `${page}.html`))
        }
        else {
            res.status(404).send("<h1>your not access to the site</h1>" + goHomeBtn)
        }
    }
    else {
        res.status(404).send("<h1>login first</h1>" + goHomeBtn)
    }
})

app.post("/login", async (req, res) => {
    const sucess = await login(req.body, res);
    if (sucess === true) {
        //max age
        res.status(200).send(`<script>window.location="/"</script>`)
    }
    else {
        res.status(404).send("<h1>" + sucess + "</h1>" + goHomeBtn);
    }


})

app.post("/signup", async (req, res) => {
    const sucess = await signup(req.body);
    if (sucess === true) {
        res.status(200).send(`<script>window.location="/"</script>`)
    }
    else {
        res.status(404).send("<h1>" + sucess + "</h1>" + goHomeBtn);
    }
})
app.post("/logined/logout", async (req, res) => {
    res.status(200).cookie("token", "", { expires: new Date() }).send(`<script>window.location="/"</script>`)
})


app.listen(port, () => {
    console.log(`Server is Running on ${baseUrl} at ${port}`)
})

// app.get("/faculty.html",async(req,res)=>{
//     if(req.cookies.token){
//         let page = await valid(req);
//         if(page=='faculty'){
//         res.status(200).sendFile(path.join(__dirname,"public",`${page}.html`))}
//         else{
//             res.status(404).send("your not access to the site")
//         }
// }
// })
// app.get("/student.html",async(req,res)=>{
//     if(req.cookies.token){
//         let page = await valid(req);
//         if(page=='student'){
//         res.status(200).sendFile(path.join(__dirname,"public",`${page}.html`))}
//         else{
//             res.status(404).send("your not access to the site")
//         }
// }
// })
// app.get("/logined/faculty/create",async(req,res)=>{
//     // if(req.cookies.token){
//     //     let page = await valid(req);
//     //     if(page==req.params.pagee){
//     //     res.status(200).sendFile(path.join(__dirname,"public",`${page}.html`))}
//     //     else{
//     //         res.status(404).send("<h1>your not access to the site</h1>"+goHomeBtn)
//     //     }
//     // }
//     // else{
//     //     res.status(404).send("<h1>login first</h1>"+goHomeBtn)
//     // }
//     res.status(200).send("fad")

// })
