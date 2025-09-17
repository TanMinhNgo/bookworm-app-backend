import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if(!title || !caption || !rating || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({ title, caption, rating, image: imageUrl, user: req.user._id });
        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', "username profileImage");

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        res.json({ books, currentPage: page, totalPages, totalBooks });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user', protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        console.error("Error fetching user books:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (book.image?.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        await book.deleteOne();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;