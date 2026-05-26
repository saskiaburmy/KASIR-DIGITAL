const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = require('./database');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. DATA MENU (Ini yang kamu buat tadi)
const menuKasirAsli = [
    { id: 1, name: "Fresh Salad", category: "Food", price: 28000 },
    { id: 2, name: "Pizza Panini", category: "Food", price: 42000 },
    { id: 3, name: "Creamy Pasta", category: "Food", price: 38000 },
    { id: 4, name: "French Fries", category: "Snack", price: 18000 },
    { id: 5, name: "Chocolate Cookies", category: "Snack", price: 25000 },
    { id: 6, name: "Dough Boy", category: "Snack", price: 25000 },
    { id: 7, name: "Fudgy Brownies", category: "Dessert", price: 30000 }
];

// 2. RUTE UTAMA (Pintu sambutan)
app.get('/', (req, res) => {
    res.send('Halo! API Sejuta Tawa Backend sudah aktif dan siap berjalan! 🚀');
});

// 3. RUTE MENU (Pintu buat ambil daftar makanan)
app.get('/api/menu', (req, res) => {
    db.all("SELECT * FROM menu", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// JALANKAN SERVER
app.listen(PORT, () => {
    console.log(`Server Koki Backend berhasil berjalan di: http://localhost:${PORT}`);
});