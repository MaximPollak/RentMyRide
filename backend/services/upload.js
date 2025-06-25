const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Used to generate unique file names
const path = require('path');
const fs = require('fs');

// Configure Multer to store uploaded images on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads');

        // Create the upload directory if it does not exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir); // Set destination folder
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extract original file extension
        const uniqueName = uuidv4() + ext; // Generate a unique filename
        cb(null, uniqueName);
    },
});

// Initialize and export Multer upload middleware
const upload = multer({ storage });

module.exports = upload;