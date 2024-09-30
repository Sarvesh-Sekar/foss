const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const SECRET_KEY = 'sample'; // Ensure this is consistent everywhere

// Utility functions to read and write data
const readData = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Paths to JSON files
const USER_DATA_FILE = './data.json';
const BLOG_DATA_FILE = './blog.json';

// User Signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const users = readData(USER_DATA_FILE);

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  writeData(USER_DATA_FILE, users);
  res.json({ message: 'User registered successfully!' });
});

// User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readData(USER_DATA_FILE);
  const user = users.find(user => user.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  // Generate JWT Token
  const token = jwt.sign({ username }, 'sample', { expiresIn: '365d' }); // Token valid for 1 year
  console.log('Generated Token:', token); // Log the token for comparison
  res.json({ message: 'Login successful!', token });
});

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Authorization header is missing!' });
  }

  const token = authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  console.log('Received Token for Verification:', token); // Log received token

  // Verify the token
  jwt.verify(token, 'sample', (err, decoded) => {
    if (err) {
      console.error('JWT Verification Error:', err); // Log the specific error for debugging
      return res.status(401).json({ message: 'Invalid token!' });
    }

    req.user = decoded.username;
    console.log('Verified User:', req.user);
    next();
  });
};

// Create a new blog post (protected route)
app.post('/blogs',  (req, res) => {
  const { title, content } = req.body;
  const blogs = readData(BLOG_DATA_FILE);
  const newPost = { id: blogs.length + 1, title, content, author: req.user };
  blogs.push(newPost);
  writeData(BLOG_DATA_FILE, blogs);
  res.json({ message: 'Blog post created successfully!', post: newPost });
});
app.get('/blogs', (req, res) => {
  const blogs = readData(BLOG_DATA_FILE);
  res.json(blogs);
});

// Get a specific blog post by ID
app.get('/blogs/:id', (req, res) => {
  const blogs = readData(BLOG_DATA_FILE);
  const post = blogs.find(blog => blog.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found!' });
  res.json(post);
});

// Update a blog post by ID (protected route)
app.put('/blogs/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let blogs = readData(BLOG_DATA_FILE);
  const index = blogs.findIndex(blog => blog.id === parseInt(id));
  
  if (index === -1) return res.status(404).json({ message: 'Post not found!' });
  
  // Check if the logged-in user is the author of the post
  if (blogs[index].author !== req.user) {
    return res.status(403).json({ message: 'Not authorized to update this post!' });
  }
  
  blogs[index] = { ...blogs[index], title, content };
  writeData(BLOG_DATA_FILE, blogs);
  res.json({ message: 'Blog post updated successfully!', post: blogs[index] });
});

// Delete a blog post by ID (protected route)
app.delete('/blogs/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  let blogs = readData(BLOG_DATA_FILE);
  const index = blogs.findIndex(blog => blog.id === parseInt(id));
  
  if (index === -1) return res.status(404).json({ message: 'Post not found!' });
  
  // Check if the logged-in user is the author of the post
  if (blogs[index].author !== req.user) {
    return res.status(403).json({ message: 'Not authorized to delete this post!' });
  }
  
  blogs.splice(index, 1);
  writeData(BLOG_DATA_FILE, blogs);
  res.json({ message: 'Blog post deleted successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
