import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable for the secret key
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
};

export default authMiddleware;
