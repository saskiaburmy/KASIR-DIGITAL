const db = require('./database');

const menuAwal = [
  { name: "Fresh Salad", category: "Food", price: 32000 },
  { name: "Pizza Panini", category: "Food", price: 42000 },
  { name: "Creamy Pasta", category: "Food", price: 35000 },
  { name: "French Fries", category: "Snack", price: 15000 },
  { name: "Chocolate Cookies", category: "Snack", price: 12000 },
  { name: "Dough Boy", category: "Snack", price: 25000 },
  { name: "Fudgy Brownies", category: "Dessert", price: 20000 }
];

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO menu (name, category, price) VALUES (?, ?, ?)");
  menuAwal.forEach((item) => {
    stmt.run(item.name, item.category, item.price);
  });
  stmt.finalize();
  console.log("Data menu berhasil dimasukkan ke database!");
});