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
    const userId = req.user.id; // Extract userId from the authenticated user

    try {
        const [posts] = await db.query(`
            SELECT 
                p.post_id, p.content, p.created_at, p.image_blob, p.privacy,
                (SELECT COUNT(*) FROM Likes WHERE post_id = p.post_id) AS likeCount,
                EXISTS (SELECT 1 FROM Likes WHERE post_id = p.post_id AND user_id = ?) AS liked
            FROM Posts p
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId, userId]);

        const processedPosts = posts.map((post) => {
            const base64Image = post.image_blob
                ? `data:image/jpeg;base64,${post.image_blob.toString('base64')}`
                : null;

            return {
                post_id: post.post_id,
                content: post.content,
                created_at: post.created_at,
                image_blob: base64Image,
                privacy: privacyMap[post.privacy],
                likeCount: post.likeCount,
                liked: !!post.liked, // Ensure liked is a boolean
            };
        });

        res.status(200).json({ posts: processedPosts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch posts for the home page based on privacy settings
export const fetchHomePagePosts = async (req, res) => {
    const userId = req.user.id; // Extract userId from the authenticated user

    try {
        const query = `
            SELECT 
                p.post_id, p.content, p.created_at, p.image_blob, p.privacy, 
                u.user_id AS post_owner_id, u.username, u.profile_picture,
                (SELECT COUNT(*) FROM Likes WHERE post_id = p.post_id) AS likeCount,
                EXISTS (SELECT 1 FROM Likes WHERE post_id = p.post_id AND user_id = ?) AS liked,
                CASE 
                    WHEN f.user_id_2 IS NOT NULL THEN TRUE
                    ELSE FALSE 
                END AS isFollowing
            FROM Posts p
            JOIN Users u ON p.user_id = u.user_id
            LEFT JOIN Friends f 
                ON f.user_id_1 = ? 
                AND f.user_id_2 = p.user_id 
                AND f.status = 'Accepted'
            WHERE 
                p.privacy = 'all_users'
                OR (p.privacy = 'followers' AND f.user_id_2 IS NOT NULL)
                OR (p.privacy = 'only_me' AND p.user_id = ?)
                OR p.user_id = ?
            ORDER BY p.created_at DESC
        `;

        const [posts] = await db.query(query, [userId, userId, userId, userId]);

        const processedPosts = posts.map(post => {
            const base64Image = post.image_blob
                ? `data:image/jpeg;base64,${post.image_blob.toString('base64')}`
                : null;

            return {
                post_id: post.post_id,
                content: post.content,
                created_at: post.created_at,
                image_blob: base64Image,
                privacy: privacyMap[post.privacy],
                username: post.username,
                profile_picture: post.profile_picture,
                post_owner_id: post.post_owner_id,
                current_user_id: userId,
                isFollowing: !!post.isFollowing,
                likeCount: post.likeCount,
                liked: !!post.liked, // Ensure liked is a boolean
            };
        });

        res.status(200).json({ posts: processedPosts });
    } catch (error) {
        console.error('Error fetching home page posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Utility function to shorten the post caption
const shortenCaption = (caption, maxLength = 30) => {
    if (caption.length > maxLength) {
        return caption.substring(0, maxLength) + '...';
    }
    return caption;
};

// Like a post and send notification with username and shortened caption
export const likePost = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.id;

    try {
        // Insert the like entry
        await db.query(
            'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)',
            [user_id, post_id]
        );

        // Fetch post owner, post caption, and username of the liker
        const [post] = await db.query('SELECT user_id, content FROM Posts WHERE post_id = ?', [post_id]);
        const [user] = await db.query('SELECT username FROM Users WHERE user_id = ?', [user_id]);

        if (post.length > 0 && user.length > 0) {
            const postOwnerId = post[0].user_id;
            const caption = shortenCaption(post[0].content); // Truncate the caption
            const username = user[0].username;

            if (postOwnerId !== user_id) {
                // Create a notification using the liker’s username and post caption
                const message = `${username} liked your post: "${caption}"`;
                await db.query(
                    `INSERT INTO Notifications (user_id, notification_type, message, is_read) 
                     VALUES (?, 'Like', ?, FALSE)`,
                    [postOwnerId, message]
                );
            }
        }

        res.status(200).json({ message: 'Post liked and notification sent.' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Unlike a post and remove the notification with the specific post caption and username
export const unlikePost = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.id;

    try {
        // Delete the like entry
        await db.query(
            'DELETE FROM Likes WHERE user_id = ? AND post_id = ?',
            [user_id, post_id]
        );

        // Fetch the username of the user who unliked the post and post caption
        const [user] = await db.query('SELECT username FROM Users WHERE user_id = ?', [user_id]);
        const [post] = await db.query('SELECT content FROM Posts WHERE post_id = ?', [post_id]);

        if (user.length > 0 && post.length > 0) {
            const username = user[0].username;
            const caption = shortenCaption(post[0].content); // Truncate the caption

            const message = `${username} liked your post: "${caption}"`;

            // Delete the corresponding notification
            await db.query(
                `DELETE FROM Notifications 
                 WHERE user_id = (SELECT user_id FROM Posts WHERE post_id = ?)
                 AND message = ?`,
                [post_id, message]
            );
        }

        res.status(200).json({ message: 'Post unliked and notification removed.' });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch like count and whether user liked the post
export const getLikesForPost = async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;

    try {
        const [[likeData]] = await db.query(
            `SELECT COUNT(*) AS likeCount, 
                    EXISTS(SELECT 1 FROM Likes WHERE user_id = ? AND post_id = ?) AS liked 
             FROM Likes 
             WHERE post_id = ?`,
            [user_id, post_id, post_id]
        );
        res.status(200).json(likeData);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const user_id = req.user.id;

  let connection; // Declare the connection variable

  try {
    // Get a connection from the pool
    connection = await db.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Check if the post exists and belongs to the user
    const [post] = await connection.query('SELECT user_id FROM Posts WHERE post_id = ?', [post_id]);

    if (post.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post[0].user_id !== user_id) {
      await connection.rollback();
      connection.release();
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    // Delete likes associated with comments on the post
    await connection.query(
      `DELETE Likes FROM Likes
       INNER JOIN Comments ON Likes.comment_id = Comments.comment_id
       WHERE Comments.post_id = ?`,
      [post_id]
    );

    // Delete likes associated with the post
    await connection.query('DELETE FROM Likes WHERE post_id = ?', [post_id]);

    // Delete comments associated with the post
    await connection.query('DELETE FROM Comments WHERE post_id = ?', [post_id]);

    // Remove this step since Notifications table doesn't have post_id
    // await connection.query('DELETE FROM Notifications WHERE post_id = ?', [post_id]);

    // Finally, delete the post
    await connection.query('DELETE FROM Posts WHERE post_id = ?', [post_id]);

    // Commit the transaction
    await connection.commit();
    connection.release();

    res.status(200).json({ message: 'Post and associated data deleted successfully.' });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};