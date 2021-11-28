const Router = require('express').Router;
const User = require('../models/user');
const router = Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body; 

    try{
        if(await User.findOne({ email })) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create(req.body);
        user.password = undefined;

        return res.status(201).json({user, token: generateToken({ id: user.id })});
    }catch(err){
        return res.status(400).json({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return res.status(400).json({ error: 'User not found' })
    }

    if (!await bcryptjs.compare(password, user.password)){
        return res.status(400).json({ error: 'Invalid password' });
    }

    user.password = undefined;

    res.status(200).json({ user, token: generateToken({ id: user.id }) });
});

module.exports = app => {
    app.use(router);
}

