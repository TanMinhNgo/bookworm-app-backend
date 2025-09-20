import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Token invalid' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default protectRoute;