const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend static files globally
app.use(express.static(path.join(__dirname, 'Env_Pro')));

// Configure Multer for processing physical Image file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'Env_Pro', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const DB_FILE = path.join(__dirname, 'database.json');

// Ensure database exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// GET all active marketplace items
app.get('/api/items', (req, res) => {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read database module.' });
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// POST a new item into the marketplace
app.post('/api/items', upload.single('itemPhoto'), (req, res) => {
    const { serialNumber, itemName, itemPrice, description, listedBy } = req.body;
    
    const newItem = {
        id: Date.now().toString(),
        serialNumber: serialNumber || 'N/A',
        itemName: itemName || 'Unknown Item',
        itemPrice: itemPrice || '₹0',
        description: description || 'No description provided.',
        listedBy: listedBy || 'Anonymous',
        photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
        status: 'Available',
        createdAt: new Date().toISOString()
    };

    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Database read sequence error.' });
        
        let items = [];
        try {
            items = JSON.parse(data || '[]');
        } catch(e) {
            items = [];
        }

        items.push(newItem);
        
        fs.writeFile(DB_FILE, JSON.stringify(items, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Database write sequence error.' });
            res.status(201).json(newItem);
        });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('\n=================================');
    console.log('GreenScore Backend Activated!');
    console.log(`Marketplace Server active natively on 0.0.0.0:${PORT} (Accessible via LAN IP)`);
    console.log('=================================\n');
});
