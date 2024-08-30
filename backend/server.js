import app from './app.js';  // Import the default export from app.js

const PORT = process.env.PORT || 50000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
