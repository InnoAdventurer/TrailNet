// backend/controllers/postController.js

import multer from 'multer';
import sharp from 'sharp';
import db from '../config/db.js';

// Set up multer for handling image uploads
const storage = multer.memoryStorage(); // Store the image in memory for processing
const upload = multer({ storage: storage }).single('image');

// Privacy translation map
const privacyMap = {
    all_users: 'All Users',
    followers: 'Only Followers',
    only_me: 'Only Me',
};

// Function to handle the post creation with image compression and BLOB storage
export const createPostWithCompressedImage = (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('Multer Error:', err);  // Log multer errors
            return res.status(500).json({ message: 'Error uploading file' });
        }

        const { content, event_id, privacy } = req.body;
        const user_id = req.user.id;  // Extract the user ID from the decoded JWT token
        const imageBuffer = req.file ? req.file.buffer : null;

        try {
            let compressedImageBuffer = null;

            if (imageBuffer) {
                const imageMetadata = await sharp(imageBuffer).metadata();
                console.log('Image Metadata:', imageMetadata);  // Log image metadata

                if (imageMetadata.format === 'jpeg') {
                    compressedImageBuffer = await sharp(imageBuffer)
                        .resize(800)
                        .jpeg({ quality: 70 })
                        .toBuffer();
                } else if (imageMetadata.format === 'png') {
                    compressedImageBuffer = await sharp(imageBuffer)
                        .resize(800)
                        .png({ quality: 70, compressionLevel: 9 })
                        .toBuffer();
                } else if (imageMetadata.format === 'webp') {
                    compressedImageBuffer = await sharp(imageBuffer)
                        .resize(800)
                        .webp({ quality: 70 })
                        .toBuffer();
                } else {
                    console.error('Unsupported Image Format:', imageMetadata.format);  // Log unsupported format
                    return res.status(400).json({ message: 'Unsupported image format. Please use JPEG, PNG, or WebP.' });
                }
            }

            const result = await db.query(
                'INSERT INTO Posts (user_id, content, event_id, image_blob, privacy) VALUES (?, ?, ?, ?, ?)',
                [user_id, content, event_id, compressedImageBuffer, privacy]
            );

            res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
        } catch (error) {
            console.error('Error creating post:', error);  // Log any errors
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

// Fetch posts on profile page for the authenticated user
export const fetchProfilePosts = async (req, res) => {
    const userId = req.user.id;  // Extract userId from the authenticated user

    try {
        const [posts] = await db.query(
            `SELECT post_id, content, event_id, created_at, image_blob, privacy 
             FROM Posts 
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        if (!posts || posts.length === 0) {
            console.warn('No Posts Found for User:', userId);  // Log a warning if no posts are found
            return res.status(404).json({ message: 'No posts found for this user.' });
        }

        const processedPosts = posts.map(post => {
            const base64Image = post.image_blob 
                ? `data:image/jpeg;base64,${post.image_blob.toString('base64')}` 
                : null;

            return {
                post_id: post.post_id,
                content: post.content,
                event_id: post.event_id,
                created_at: post.created_at,
                image_blob: base64Image,
                privacy: privacyMap[post.privacy]
            };
        });

        res.status(200).json({ posts: processedPosts });
    } catch (error) {
        console.error('Error fetching user posts:', error);  // Log any errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch posts for the home page based on privacy settings
export const fetchHomePagePosts = async (req, res) => {
    const userId = req.user.id; // Extract userId from the authenticated user

    try {
        const query = `
            SELECT 
                p.post_id, p.content, p.event_id, p.created_at, p.image_blob, p.privacy, 
                u.username, u.profile_picture 
            FROM Posts p
            JOIN Users u ON p.user_id = u.user_id
            LEFT JOIN Friends f ON f.user_id_1 = ? AND f.user_id_2 = p.user_id AND f.status = 'Accepted'
            WHERE 
                p.privacy = 'all_users'
                OR (p.privacy = 'followers' AND f.user_id_2 IS NOT NULL)
                OR (p.privacy = 'only_me' AND p.user_id = ?)
                OR p.user_id = ?
            ORDER BY p.created_at DESC
        `;

        const [posts] = await db.query(query, [userId, userId, userId]);

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts available.' });
        }

        const processedPosts = posts.map(post => {
            const base64Image = post.image_blob
                ? `data:image/jpeg;base64,${post.image_blob.toString('base64')}`
                : null;

            return {
                post_id: post.post_id,
                content: post.content,
                event_id: post.event_id,
                created_at: post.created_at,
                image_blob: base64Image,
                privacy: privacyMap[post.privacy],
                username: post.username,
                profile_picture: post.profile_picture,
            };
        });

        res.status(200).json({ posts: processedPosts });
    } catch (error) {
        console.error('Error fetching home page posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
