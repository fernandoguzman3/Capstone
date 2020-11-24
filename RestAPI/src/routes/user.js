
const { Router } = require('express');
var nodemailer  = require('nodemailer');
const users = require('../users.json');
const randomstring = require('randomstring');
const dao  = require('../DAO/user_dao');



//Authentication with Database
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'colmena66@tucaminoempresarial2',
    host: 'tucaminoempresarial2.postgres.database.azure.com',
    database: 'capstone',
    password: '6rrz9afwZ1994!@',
    port: 5432,
})

const router = Router();


let transporter = nodemailer.createTransport({
    service: 'gmail',
 auth: {
        user: 'capstonehelix@gmail.com',
        pass: 'zybcev-reRfac-0vikpo'
    }
});

router.post('/user/changePassword', (req, res) => {

    const email = req.body.email;
    console.log(email);
    passwordtoken = randomstring.generate();
    host=req.get('host');
    link="http://"+req.get('host')+"/newPassword/user/" +email+ "?id="+passwordtoken;
    mailOptions={
        from: 'fernan3119@gmail.com',
        to : email,
        subject : "Cambio de contraseña",
        html : "<br> Presione el enlace para cambiar su contraseña.<br><a href="+link+">Presione aqui.</a>" 
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, response) => {
        if(error){
            console.log(error);
            res.send("error");
        }
        else{
            console.log("Message sent: " + response.message);
            res.send("sent");
        }
});
});


router.get('/newPassword/user/:email',(req,res) =>{
    //console.log(email)
    //console.log(req);
    console.log(req.query.id);
    const email = req.params.body;   
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        
        if(req.query.id==passwordtoken)
        {
            console.log("email is verified");
            res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        }
        else
        {       
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});


router.put('user/password', (req,res) => {

});



router.get('/verifyEmail',function(req,res){

    token = randomstring.generate();
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+token;
    mailOptions={
        from: 'fernan3119@gmail.com',
        to : 'fernando.guzman2@upr.edu',
        subject : "Favor de confirmar su correo electronico",
        html : "<br> Presione el enalce para confirmar su cuenta.<br><a href="+link+">Click here to verify</a>" 
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.send("error");
        }
        else{
            console.log("Message sent: " + response.message);
            res.send("sent");
        }
    });
});

router.get('/verify',function(req,res){
    
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==token)
        {
            dao.verify(true);
            //console.log("email is verified");
            //res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        }
        else
        {       
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});




router.post('/register', (req, res) => {

    const {firstname, lastname, business_status, email, phone_number, requested_assistance, password} = req.body;

    if (firstname && lastname && business_status && email && password){
        //insert query should be here


        if(phone_number){
            
            if(validName(firstname) && validName(lastname) && validEmail(email) && validPhone(phone_number)){
                dao.createUser(firstname,lastname,email,password, true, phone_number, null, null, 1, 0);
                token = randomstring.generate();
                host=req.get('host');
                link="http://"+req.get('host')+"/verify?id="+token;
                mailOptions={
                    from: 'capstonehelix@gmail.com',
                    to : email,
                    subject : "Favor de confirmar su correo electronico",
                    html : "<br> Presione el enalce para confirmar su cuenta.<br><a href="+link+">Click here to verify</a>" 
                }
                console.log(mailOptions);
                transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                        res.send("error");
                    }
                    else{
                        console.log("Message sent: " + response.message);
                        res.send("sent");
                    }
                });

                res.status(200).send("User registered");
            }
            else{
                res.status(400).send("Error");
            }
        }
        
    }
    else{
        res.status(400).send("Error");
    }

    
});

router.get('/users', async (req,res) =>{

    const users = await dao.getUsers()
    console.log(users)
    
   res.send(users)
});

router.post('/login', (req,res) => {

    console.log(req.body);
    const {email, password} = req.body;
   
    if(email && password){
        if(validEmail(email)){
            res.status(200).send(users[0]);
        }
        else{
            res.status(400).send("error");
        }

        
    }
    else{
        res.status(400).send("error");
    }
});

router.get('/user/:userId', (req,res) => {
    const id = parseInt(request.params.userId)
    
    let i = 0;
    let founded = false;

    
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })

   

    if (!founded){
        res.status(404).send("User not found");
    }

});

router.put('/user/:userId', async (req, res) => {
    
    const {firstname, lastname, business_status, phone_number, business_stage} = req.body;
    
    
    if (firstname && lastname && business_status){
        if(phone_number){  
            if(validName(firstname) && validName(lastname) && validPhone(phone_number)){
                
                let value = await dao.updateUser(req.params.userId, firstname, lastname, business_status, phone_number, business_stage);
                console.log(value)
                if(value instanceof Error){
                    
                    res.status(400).send("Error in query");
                }
                else{
                    res.status(200).send(value);
                }    
            }
            else{
                res.status(400).send("Error in validation");
            }
        }
        
    }
    else{
        res.status(400).send("Error in values");
    }

});



router.delete('/user/:userId', async (req,res) => {
    
    

    let result = await dao.deleteUser(req.params.userId)

    if(result instanceof Error){
        res.status(400).send("error");
    }
    else{
        res.status(200).send("User deleted!")
    }
    

    
});

// Validates email address of course.
function validEmail(email) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(email).search (filter) != -1;
}

function validPhone(phone) {
    var filter = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return String(phone).search (filter) != -1;
}

function validName(name) {
    var filter = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
    return String(name).search (filter) != -1;
}

module.exports = router;