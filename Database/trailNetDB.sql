-- Database\trailNetDB.sql

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Trails (
    trail_id INT AUTO_INCREMENT PRIMARY KEY,
    trail_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    length FLOAT,
    difficulty ENUM('Easy', 'Moderate', 'Hard'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Activities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type ENUM('Cycling', 'Hiking', 'Jogging') NOT NULL,
    distance FLOAT,
    duration TIME,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    trail_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (trail_id) REFERENCES Trails(trail_id)
);

CREATE TABLE Events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255),
    privacy ENUM('all_users', 'followers', 'only_me') NOT NULL DEFAULT 'all_users',
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    trail_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trail_id) REFERENCES Trails(trail_id)
);

CREATE TABLE User_Events (
    user_event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    status ENUM('Interested', 'Going', 'Not Going'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

CREATE TABLE Friends (
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT,
    user_id_2 INT,
    status ENUM('Pending', 'Accepted', 'Blocked') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES Users(user_id),
    FOREIGN KEY (user_id_2) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message_content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);

CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT NOT NULL,
    trail_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (trail_id) REFERENCES Trails(trail_id)
);

CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    comment_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT,
    comment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id)
);

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    notification_type ENUM('Friend Request', 'Event Reminder', 'Message', 'Like', 'Comment', 'Activity') NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Activity_Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL
);

CREATE TABLE Activity_Tag_Map (
    activity_tag_map_id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT,
    tag_id INT,
    FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
    FOREIGN KEY (tag_id) REFERENCES Activity_Tags(tag_id)
);
