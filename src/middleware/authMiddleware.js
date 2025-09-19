import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
    try {
        let {Authorization} = req.headers;
        if (Authorization) {
            Authorization = Authorization.replace("Bearer ", "");
        }

        const decoded = jwt.verify(Authorization, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

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