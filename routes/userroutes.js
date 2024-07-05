const express = require("express");
const router = express.Router();
const user = require('../models/user');
const { jwtauthmiddleware, generatetoken } = require('../jwt');
//const user = require("../models/user");
//..........................................................................................................
router.post('/signup', async (req, res) => {

    try {
        const data = req.body;
        const newuser = new user(data);
        const response = await newuser.save();
        console.log('data saved');

        const payload = {
            id: response.id,
            //username: response.username
        }
        console.log(JSON.stringify(payload));
        const token = generatetoken(payload);
        console.log("Token is : ", token);

        res.status(200).json({ response: response, token: token });

    }
    catch (err) {
        console.log('the eroor is:', err);
        res.status(500).json({ error: 'internel server error' });

    }
})


router.post('/login', async (req, res) => {

    try {
        const { adhar, password } = req.body;
        const user = await user.findOne({ adhar: adhar });
        if (!user || !(await user.comparepassword(password)))
            return res.status(401).json({ error: "invalid" });
        const payload = {
            id: user.id,
            //username:user.username
        }
        const token = generatetoken(payload);
        res.json({ token });

    }
    catch (err) {
        console.log('the eroor is:', err);
        res.status(500).json({ error: 'internel server error' });

    }
})
//............................................................................................................


router.get('/profile', jwtauthmiddleware, async (req, res) => {
    try {
        const userData = req.user;
        //console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error getting profile' });
    }
})
//.........................................................................................................
router.put('/profile/password', jwtauthmiddleware, async (req, res) => {
    try {
        const userid = req.user.id;
        const{currentpass,newpass}=req.body;
        const user = await user.findById(userid);

        if (!(await user.comparepassword(currentpass)))
            return res.status(401).json({ error: "invalid" });
        user.password=newpass;
        await user.save()
        console.log('updated password');
        res.status(200).json({message:'password updated'});
        

    }
    catch (err) {
        console.log('the eroor is:', err);
        res.status(500).json({ error: 'update info internel server error' });

    }
})
//.....................................................................................


module.exports = router;