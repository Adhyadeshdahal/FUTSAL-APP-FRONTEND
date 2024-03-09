const express = require('express');
const User = require('./user.js');
const _ = require('lodash');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const multer = require('multer');
const router = express.Router();

//validation
const userSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
    avatar: Joi.any()
});

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('avatar'), async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Continue with creating the user...
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        user.avatar = req.file ? req.file.path : null;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

        res.header('x-auth-token', token).setHeader('Access-Control-Expose-Headers', 'x-auth-token').send(_.pick(user, ['_id', 'name', 'email', 'avatar']));

    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;
