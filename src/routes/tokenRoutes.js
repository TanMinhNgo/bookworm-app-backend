import express from "express";
import Token from "../models/Token.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { token, user } = req.body;

        const newToken = new Token({ token, user });
        await newToken.save();

        res.status(201).json({ message: 'Token created successfully', token: newToken });
    } catch (error) {
        console.error("Error creating token:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const user = req.body.user;

        let tokens;
        if (user) {
            tokens = await Token.find({ user }).sort({ createdAt: -1 });
        } else {
            tokens = await Token.find().sort({ createdAt: -1 });
        }

        res.json(tokens);
    } catch (error) {
        console.error("Error fetching tokens:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;