const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const db = require('./database');

const PORT = process.env.PORT || 5000;

// SECRET KEY JWT
const SECRET_KEY = process.env.SECRET_KEY || "RAHASIA_BANGET";

// Middleware
app.use(cors());
app.use(express.json());


// ======================================
// DATA MENU
// ======================================

const menuKasirAsli = [
    { id: 1, name: "Fresh Salad", category: "Food", price: 28000 },
    { id: 2, name: "Pizza Panini", category: "Food", price: 42000 },
    { id: 3, name: "Creamy Pasta", category: "Food", price: 38000 },
    { id: 4, name: "French Fries", category: "Snack", price: 18000 },
    { id: 5, name: "Chocolate Cookies", category: "Snack", price: 25000 },
    { id: 6, name: "Dough Boy", category: "Snack", price: 25000 },
    { id: 7, name: "Fudgy Brownies", category: "Dessert", price: 30000 }
];


// ======================================
// ROUTE UTAMA
// ======================================

app.get('/', (req, res) => {
    res.send('Halo! API Sejuta Tawa Backend sudah aktif dan siap berjalan! 🚀');
});


// ======================================
// GET MENU
// ======================================

app.get('/api/menu', (req, res) => {
    db.all("SELECT * FROM menu", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});


// ======================================
// REGISTER
// ======================================

app.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    // Validasi
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Semua field wajib diisi"
        });
    }

    try {

        // Cek user sudah ada atau belum
        db.get(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email],

            async (err, user) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (user) {
                    return res.status(400).json({
                        message: "Username atau email sudah digunakan"
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Simpan user
                db.run(
                    `INSERT INTO users (username, email, password)
                     VALUES (?, ?, ?)`,

                    [username, email, hashedPassword],

                    function(err) {

                        if (err) {
                            return res.status(500).json({
                                message: "Register gagal",
                                error: err.message
                            });
                        }

                        res.json({
                            message: "Register berhasil",
                            userId: this.lastID
                        });
                    }
                );
            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ======================================
// LOGIN
// ======================================

app.post('/login', (req, res) => {

    const { username, password } = req.body;

    // Cari user
    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],

        async (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!user) {
                return res.status(400).json({
                    message: "User tidak ditemukan"
                });
            }

            // Cocokkan password
            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Password salah!"
                });
            }

            // Generate token
            const token = jwt.sign(
                { userId: user.id },
                SECRET_KEY,
                { expiresIn: '8h' }
            );

            res.json({
                message: "Login berhasil",
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    );
});


// ======================================
// SERVER
// ======================================

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});