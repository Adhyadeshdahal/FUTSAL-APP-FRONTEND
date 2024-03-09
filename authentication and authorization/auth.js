const express = require('express');
const jwt = require("jsonwebtoken");
const User = require('./user.js');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require("config");
const router = express.Router();

//validation
const userSchema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),

});


router.post('/', async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        let user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Invalid email or password');

        const isValidPassword = await bcrypt.compare(req.body.password,user.password);
        if(!isValidPassword){
            return res.status(400).send('Invalid email or password');
        }
        const token =jwt.sign({_id:user.id},config.get('jwtPrivateKey'));
        res.header('x-auth-token', token).setHeader('Access-Control-Expose-Headers', 'x-auth-token').send(_.pick(user, ['_id', 'name', 'email', 'avatar']));

    } catch (err) {
        console.error('Error logging user:', err);
        res.status(500).json({ error: 'Failed to login user' });
    }
});


module.exports=router;
