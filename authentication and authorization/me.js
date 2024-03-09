const auth = require('./middleware/auth');
const express = require('express');
const User = require('./user.js');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.use('/uploads', express.static('uploads'));

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).send('User or avatar not found');
        }

        // Send user data with avatar file path
        res.send({ user, avatarPath: `/uploads/${user.avatar}` });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/avatar/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.avatar) {
            return res.status(404).send('User or avatar not found');
        }

        // Serve the avatar file
        const imagePath = path.join(__dirname, user.avatar);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).send('Avatar file not found');
        }

        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error getting avatar:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
