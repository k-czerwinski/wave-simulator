//Requiring all the necessary files and libraries
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middleware/auth');

//Creating express router
const route = express.Router();
//Importing userModel
const userModel = require('../models/userModel');
const waveProfileModel = require('../models/waveProfileModel');

//Creating register route
route.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;
        console.log(name + " " + email + " " + password);
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'Please enter all the details' })
        }

        const userExist = await userModel.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(409).send({ message: 'User already exist with the given email' })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
        const user = new userModel(req.body);
        await user.save();
        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie("token", token).json({ success: true, message: 'User registered successfully', data: user })
    } catch (error) {
        return res.json({ error: error });
    }

})
//Creating login routes
route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check emptyness of the incoming data
        if (!email || !password) {
            return res.status(401).send({ error: 'Please enter all the details' })
        }
        //Check if the user already exist or not
        const userExist = await userModel.findOne({ email: req.body.email });
        if (!userExist) {
            return res.status(401).send({ error: 'Wrong credentials' })
        }
        //Check password match
        const isPasswordMatched = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatched) {
            return res.status(401).send({ error: 'Wrong credentials pass' });
        }
        const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return res.cookie("token", token, { maxAge: 600000 }).json({ success: true, message: 'LoggedIn Successfully', token: token })
    } catch (error) {
        return res.json({ error: error });
    }

})


// //Creating user routes to fetch users data
// route.get('/user', isAuthenticated, async (req, res) => {
//     try {
//         const user = await userModel.find();
//         if (!user) {
//             return res.json({ message: 'No user found' })
//         }
//         return res.json({ user: user })
//     } catch (error) {
//         return res.json({ error: error });
//     }
// });

route.get('/getUserId', isAuthenticated, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.id;
        return res.json({ success: true, "userId": userId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
});

route.post('/logout', (req, res) => {
    res.clearCookie("token");
    return res.json({ success: true, message: 'Logged out successfully' });
});

route.get('/isAuthenticated', isAuthenticated, (req, res) => {
    return res.json({ success: true, message: 'Authenticated' });
});

route.get('/getWaveProfilesForUser', isAuthenticated, async (req, res) => {
    try {
        const waveProfiles = await waveProfileModel.find({ userId: req.headers.userId });
        return res.json({ success: true, message: 'Wave profiles fetched successfully', data: waveProfiles });
    } catch (error) {
        return res.status(500).json({ "error": error });
    }
});

route.post('/saveWaveProfile', isAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const waveProfile = new waveProfileModel(req.body);
        await waveProfile.save();
        console.log("Wave profile saved for user with id: " + req.body.userId);
        return res.json({ success: true, message: 'Wave profile saved successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
});

module.exports = route;