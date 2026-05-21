const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware agar frontend dan backend bisa saling kirim data JSON
app.use(cors());
app.use(express.json());

// Jalur API utama untuk tes apakah backend-mu sudah hidup
app.get('/', (req, res) => {
  res.send('Halo! API Sejuta Tawa Backend sudah aktif dan siap berjalan! 🚀');
});

// Menjalankan server koki kita di port 5000
app.listen(PORT, () => {
  console.log(`Server Koki Backend berhasil berjalan di: http://localhost:${PORT}`);
});