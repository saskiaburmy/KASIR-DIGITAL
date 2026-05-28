import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

import logo       from "./assets/KAFE_KAFEAN_LOGO.jpg";
import caffe      from "./assets/caffe.jpg";
import cookies    from "./assets/cookies.jpg";
import donat      from "./assets/donat.jpg";
import fries      from "./assets/fries.jpg";
import fudgy      from "./assets/fudgy.jpg";
import hazelnut   from "./assets/hazelnut.jpg";
import lemon      from "./assets/lemon.jpg";
import matcha     from "./assets/matcha.jpg";
import panini     from "./assets/panini.jpg";
import pasta      from "./assets/pasta.jpg";
import salad      from "./assets/salad.jpg";
import stoberi    from "./assets/stoberi.jpg";
import strawberry from "./assets/strawberry.jpg";
import music      from "./assets/alex-morgan-bebop-coffee-shop-517090.mp3";

// ─── HELPERS ────────────────────────────────────────────────────────
const currency = (v) => new Intl.NumberFormat("id-ID").format(v || 0);

// ─── KONSTANTA ──────────────────────────────────────────────────────
const temperatureOptions = ["Panas", "Dingin"];
const drinkAddOns = ["Es Krim", "Boba", "Espresso Shot"];
const foodAddOns  = ["Extra Keju", "Extra Saus", "Tambahan Sambal"];

const imageMap = {
  1: salad, 2: panini, 3: pasta, 4: fries, 5: cookies,
  6: donat, 7: fudgy, 8: strawberry, 9: stoberi,
  10: hazelnut, 11: matcha, 12: caffe, 13: lemon,
};

const initialTables = [
  { name:"A01",status:"Kosong"},{name:"A02",status:"Kosong"},{name:"A03",status:"Kosong"},
  { name:"A04",status:"Kosong"},{name:"A05",status:"Kosong"},{name:"B01",status:"Kosong"},
  { name:"B02",status:"Kosong"},{name:"B03",status:"Kosong"},{name:"B04",status:"Kosong"},
  { name:"B05",status:"Kosong"},{name:"VIP01",status:"Kosong"},{name:"VIP02",status:"Kosong"},
];

const initialStock = [
  {id:"coffee", label:"Biji Kopi", qty:120, threshold:20},
  {id:"milk",   label:"Susu",      qty:90,  threshold:20},
  {id:"cup",    label:"Cup",       qty:70,  threshold:15},
  {id:"tea",    label:"Teh",       qty:80,  threshold:15},
  {id:"biscuit",label:"Biskuit",   qty:50,  threshold:10},
  {id:"sugar",  label:"Gula",      qty:100, threshold:20},
];

const recipeMap = {
  "Fresh Salad":            [{id:"biscuit",qty:1},{id:"milk",qty:1}],
  "Pizza Panini":           [{id:"cup",qty:1},{id:"milk",qty:1}],
  "Creamy Pasta":           [{id:"milk",qty:2}],
  "French Fries":           [{id:"cup",qty:1}],
  "Chocolate Cookies":      [{id:"biscuit",qty:2}],
  "Dough Boy":              [{id:"biscuit",qty:1}],
  "Fudgy Brownies":         [{id:"milk",qty:1},{id:"biscuit",qty:1}],
  "Chocolate Strawberry":   [{id:"biscuit",qty:1},{id:"milk",qty:1}],
  "Strawberry Crunch Cream":[{id:"milk",qty:1}],
  "Hazelnut Coffee":        [{id:"coffee",qty:2},{id:"milk",qty:1},{id:"cup",qty:1}],
  "Matcha Latte":           [{id:"tea",qty:2},{id:"milk",qty:1},{id:"cup",qty:1}],
  "Caffe Latte":            [{id:"coffee",qty:2},{id:"milk",qty:1},{id:"cup",qty:1}],
  "Lemon Tea":              [{id:"tea",qty:1},{id:"cup",qty:1}],
};

const initialPromoCodes = [
  {code:"KAFE10",    type:"percent", amount:10,    description:"Diskon 10% semua pelanggan",       active:true},
  {code:"BARISTA20", type:"fixed",   amount:20000, description:"Potongan Rp20.000 min. Rp100.000", active:true},
];

const initialMenuItems = [
  {id:1,  name:"Fresh Salad",             category:"Food",    image:salad,      price:28000, sold:12, status:"Tersedia", hasSizes:false},
  {id:2,  name:"Pizza Panini",            category:"Food",    image:panini,     price:42000, sold:19, status:"Tersedia", hasSizes:false},
  {id:3,  name:"Creamy Pasta",            category:"Food",    image:pasta,      price:38000, sold:15, status:"Tersedia", hasSizes:false},
  {id:4,  name:"French Fries",            category:"Snack",   image:fries,      price:18000, sold:21, status:"Tersedia", hasSizes:false},
  {id:5,  name:"Chocolate Cookies",       category:"Snack",   image:cookies,    price:20000, sold:7,  status:"Tersedia", hasSizes:false},
  {id:6,  name:"Dough Boy",               category:"Snack",   image:donat,      price:25000, sold:9,  status:"Tersedia", hasSizes:false},
  {id:7,  name:"Fudgy Brownies",          category:"Dessert", image:fudgy,      price:30000, sold:13, status:"Tersedia", hasSizes:false},
  {id:8,  name:"Chocolate Strawberry",    category:"Dessert", image:strawberry, price:33000, sold:11, status:"Tersedia", hasSizes:false},
  {id:9,  name:"Strawberry Crunch Cream", category:"Dessert", image:stoberi,    price:35000, sold:5,  status:"Tersedia", hasSizes:false},
  {id:10, name:"Hazelnut Coffee",         category:"Drinks",  image:hazelnut,   price:22000, sold:30, status:"Tersedia", hasSizes:true,
   sizes:[{label:"S",price:22000},{label:"M",price:27000},{label:"L",price:32000}]},
  {id:11, name:"Matcha Latte",            category:"Drinks",  image:matcha,     price:24000, sold:26, status:"Tersedia", hasSizes:true,
   sizes:[{label:"S",price:24000},{label:"M",price:29000},{label:"L",price:34000}]},
  {id:12, name:"Caffe Latte",             category:"Drinks",  image:caffe,      price:21000, sold:18, status:"Tersedia", hasSizes:true,
   sizes:[{label:"S",price:21000},{label:"M",price:26000},{label:"L",price:31000}]},
  {id:13, name:"Lemon Tea",               category:"Drinks",  image:lemon,      price:18000, sold:14, status:"Tersedia", hasSizes:true,
   sizes:[{label:"S",price:18000},{label:"M",price:22000},{label:"L",price:26000}]},
];


// ─── KOMPONEN: TOAST ─────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type === "warning" ? "toast-warn" : "toast-ok"}`}>
      {toast.type === "warning" ? "⚠ " : "✓ "}{toast.message}
    </div>
  );
}

// ─── KOMPONEN: MODAL WRAPPER ──────────────────────────────────────────
function Modal({ onClose, children, wide }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-box ${wide ? "modal-wide" : ""}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─── KOMPONEN: RECEIPT MODAL ──────────────────────────────────────────
function ReceiptModal({ order, onPrint, onClose }) {
  if (!order) return null;
  const id = `ST-${String(order.timestamp || Date.now()).slice(-6)}`;
  return (
    <Modal onClose={onClose}>
      <div className="receipt-header">
        <div className="receipt-icon">✅</div>
        <h3>Pembayaran Berhasil!</h3>
        <p>Terima kasih telah berbelanja</p>
      </div>
      <div className="receipt-body">
        <div className="receipt-store">
          <strong>☕ SEJUTA TAWA</strong>
          <small>est. 2010 • {id}</small>
        </div>

        <div className="receipt-section">
          {[
            ["Pelanggan", order.customerName || "—"],
            ["Meja",      order.customerTable || "Takeaway"],
            ["Tipe",      order.orderType     || "—"],
            ["Bayar",     order.paymentMethod || "—"],
            ["Tanggal",   order.date          || "—"],
          ].map(([k, v]) => (
            <div key={k} className="receipt-row">
              <span className="receipt-label">{k}</span>
              <span className="receipt-value">{v}</span>
            </div>
          ))}
        </div>

        <div className="receipt-section">
          <p className="section-title">DETAIL PESANAN</p>
          {(order.orders || []).map((item, i) => (
            <div key={i} className="order-line">
              <div>
                <strong>{item.name}{item.size ? ` (${item.size})` : ""}</strong>
                <small>{item.qty} × Rp {currency(item.price)}</small>
              </div>
              <span>Rp {currency(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="receipt-section">
          {[
            ["Subtotal",    `Rp ${currency(order.subtotal)}`],
            ["Pajak (11%)", `Rp ${currency(order.tax)}`],
            ["Service Fee", `Rp ${currency(order.service)}`],
          ].map(([k, v]) => (
            <div key={k} className="receipt-row">
              <span className="receipt-label">{k}</span>
              <span className="receipt-value">{v}</span>
            </div>
          ))}
          {order.discount > 0 && (
            <div className="receipt-row discount">
              <span>Diskon ({order.promoCode})</span>
              <span>- Rp {currency(order.discount)}</span>
            </div>
          )}
        </div>

        <div className="receipt-total">
          <span>TOTAL BAYAR</span>
          <span>Rp {currency(order.total)}</span>
        </div>

        <div className="receipt-actions">
          <button className="btn-primary" onClick={onPrint}>🖨 Cetak Struk</button>
          <button className="btn-ghost"   onClick={onClose}>Tutup</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── KOMPONEN: MODIFIER MODAL ─────────────────────────────────────────
function ModifierModal({ item, onAdd, onClose }) {
  const [state, setState] = useState({
    size:      item.sizes ? item.sizes[0] : null,
    temp:      "Dingin",
    sweetness: "Normal",
    addOns:    [],
    notes:     "",
  });

  const toggleAddOn = (t) =>
    setState(p => ({ ...p, addOns: p.addOns.includes(t) ? p.addOns.filter(x => x !== t) : [...p.addOns, t] }));

  const price = state.size?.price || item.price;

  return (
    <Modal onClose={onClose}>
      <div className="modal-title">
        <strong>Kustom — {item.name}</strong>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>

      {item.hasSizes && (
        <div className="modifier-group">
          <label className="modifier-label">Ukuran</label>
          <div className="chip-row">
            {item.sizes.map(sz => (
              <button key={sz.label}
                className={`chip ${state.size?.label === sz.label ? "chip-active" : ""}`}
                onClick={() => setState(p => ({ ...p, size: sz }))}>
                {sz.label} <span>Rp {currency(sz.price)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {item.category === "Drinks" && (
        <div className="modifier-group">
          <label className="modifier-label">Suhu</label>
          <div className="chip-row">
            {temperatureOptions.map(t => (
              <button key={t}
                className={`chip ${state.temp === t ? "chip-active" : ""}`}
                onClick={() => setState(p => ({ ...p, temp: t }))}>
                {t === "Panas" ? "🔥" : "🧊"} {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="modifier-group">
        <label className="modifier-label">Tambahan</label>
        <div className="chip-row">
          {(item.category === "Drinks" ? drinkAddOns : foodAddOns).map(o => (
            <button key={o}
              className={`chip ${state.addOns.includes(o) ? "chip-active" : ""}`}
              onClick={() => toggleAddOn(o)}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className="mod-notes"
        placeholder="Catatan khusus (opsional)..."
        value={state.notes}
        onChange={e => setState(p => ({ ...p, notes: e.target.value }))}
      />

      <div className="modal-footer">
        <span className="mod-price">Rp {currency(price)}</span>
        <div className="modal-footer-btns">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={() => onAdd(item, state)}>+ Tambah</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── KOMPONEN: CART PANEL ─────────────────────────────────────────────
function CartPanel({
  cart, setCart, customerName, setCustomerName,
  customerTable, setCustomerTable, orderType, setOrderType,
  paymentMethod, setPaymentMethod, promoCode, setPromoCode,
  promoDiscount, applyPromoCode, subtotal, taxRate, serviceRate,
  onCheckout, onClose,
}) {
  const tax     = Math.round(subtotal * taxRate);
  const service = orderType === "Dine-In" ? Math.round(subtotal * serviceRate) : 0;
  const total   = Math.max(0, subtotal + tax + service - promoDiscount);

  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const changeQty  = (idx, delta) => setCart(prev =>
    prev.map((item, i) => i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
  );

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h3>Pesanan Aktif</h3>
        {onClose && <button className="btn-icon" onClick={onClose}>✕</button>}
        {customerTable
          ? <span className="badge badge-green">🪑 {customerTable}</span>
          : <span className="badge badge-red">⚠ Belum pilih meja</span>}
      </div>

      <div className="cart-form">
        <div className="form-row">
          <input className="form-input" placeholder="Nama Pelanggan"
            value={customerName} onChange={e => setCustomerName(e.target.value)} />
          <input className="form-input small" placeholder="No Meja"
            value={customerTable} onChange={e => setCustomerTable(e.target.value)} />
        </div>
        <div className="form-row">
          <select className="form-input" value={orderType} onChange={e => setOrderType(e.target.value)}>
            <option>Dine-In</option>
            <option>Takeaway</option>
          </select>
          <select className="form-input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Tunai</option>
            <option>QRIS</option>
            <option>Dompet Digital</option>
          </select>
        </div>
        <div className="form-row">
          <input className="form-input" placeholder="Kode Promo (KAFE10)"
            value={promoCode} onChange={e => setPromoCode(e.target.value)} />
          <button className="btn-primary compact" onClick={applyPromoCode}>Klaim</button>
        </div>
      </div>

      <div className="cart-items">
        {cart.length === 0
          ? <div className="cart-empty">🛒<p>Keranjang kosong</p></div>
          : cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}{item.size ? ` (${item.size})` : ""}</span>
                {item.modifiers?.addOns?.length > 0 && (
                  <small className="cart-item-mod">+{item.modifiers.addOns.join(", ")}</small>
                )}
              </div>
              <div className="cart-item-controls">
                <button className="qty-btn" onClick={() => changeQty(idx, -1)}>−</button>
                <span>{item.qty}</span>
                <button className="qty-btn" onClick={() => changeQty(idx, +1)}>+</button>
                <span className="cart-item-price">Rp {currency(item.price * item.qty)}</span>
                <button className="btn-icon danger" onClick={() => removeItem(idx)}>🗑</button>
              </div>
            </div>
          ))
        }
      </div>

      <div className="cart-summary">
        <div className="summary-row"><span>Subtotal</span><span>Rp {currency(subtotal)}</span></div>
        <div className="summary-row"><span>Pajak 11%</span><span>Rp {currency(tax)}</span></div>
        <div className="summary-row"><span>Service {orderType === "Dine-In" ? "5%" : "0%"}</span><span>Rp {currency(service)}</span></div>
        {promoDiscount > 0 && (
          <div className="summary-row discount"><span>Diskon</span><span>−Rp {currency(promoDiscount)}</span></div>
        )}
        <div className="summary-total"><span>Total Akhir</span><span>Rp {currency(total)}</span></div>
        <button className="btn-checkout" onClick={onCheckout}>🚀 Bayar Sekarang</button>
      </div>
    </div>
  );
}

// ─── KOMPONEN: TOP CHART ──────────────────────────────────────────────
function TopChart({ menuItems, history }) {
  const salesMap = {};
  menuItems.forEach(m => { salesMap[m.name] = m.sold || 0; });
  history.filter(o => o.status !== "Dibatalkan").forEach(order =>
    (order.orders || []).forEach(item => {
      salesMap[item.name] = (salesMap[item.name] || 0) + (item.qty || 1);
    })
  );
  const sorted = Object.entries(salesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const max = sorted[0]?.count || 1;

  return (
    <div className="chart-wrap">
      <h4>🏆 Menu Terlaris</h4>
      <div className="bar-chart">
        {sorted.map((item, i) => (
          <div key={item.name} className="bar-col">
            <span className="bar-count">{item.count}</span>
            <div className="bar" style={{ height: `${Math.max(8, (item.count / max) * 160)}px`, opacity: 1 - (i * 0.1) }} />
            <span className="bar-name">{item.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {

  // ── State: Auth & UI ──
  const [loading,        setLoading]        = useState(true);
  const [loggedIn,       setLoggedIn]       = useState(false);
  const [registerMode,   setRegisterMode]   = useState(false);
  const [loginUser,      setLoginUser]      = useState("");
  const [loginPass,      setLoginPass]      = useState("");
  const [userEmail,      setUserEmail]      = useState("");
  const [userRole,       setUserRole]       = useState("Kasir");
  const [toast,          setToast]          = useState(null);

  // ── State: Data ──
  const [menuItems,      setMenuItems]      = useState([]);
  const [stockItems,     setStockItems]     = useState(initialStock);
  const [tables,         setTables]         = useState(initialTables);
  const [promoCodes]                        = useState(initialPromoCodes);
  const [history,        setHistory]        = useState([]);

  // ── State: Navigasi ──
  const [activeNav,      setActiveNav]      = useState("kasir");
  const [adminTab,       setAdminTab]       = useState("ringkasan");
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // ── State: Modal & UI extras ──
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showReceipt,    setShowReceipt]    = useState(false);
  const [showModifier,   setShowModifier]   = useState(false);
  const [modifierItem,   setModifierItem]   = useState(null);
  const [editingMenu,    setEditingMenu]    = useState(null);
  const [menuForm,       setMenuForm]       = useState({ name:"", price:"", category:"Food", image:"" });
  const [isMusicOn,      setIsMusicOn]      = useState(true);
  const [showSidebar,    setShowSidebar]    = useState(false);

  // ── State: Order ──
  const [cart,           setCart]           = useState([]);
  const [customerName,   setCustomerName]   = useState("");
  const [customerTable,  setCustomerTable]  = useState("");
  const [orderType,      setOrderType]      = useState("Dine-In");
  const [paymentMethod,  setPaymentMethod]  = useState("Tunai");
  const [promoCode,      setPromoCode]      = useState("");
  const [promoDiscount,  setPromoDiscount]  = useState(0);
  const [selectedSizes,  setSelectedSizes]  = useState({});

  const audioRef    = useRef(null);
  const taxRate     = 0.11;
  const serviceRate = 0.05;


  // ── EFFECT: Cek session login saat app pertama dibuka ──
  useEffect(() => {
    // Cek apakah user sudah login sebelumnya (session masih aktif)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setLoggedIn(true);
        setUserEmail(session.user.email);
        setUserRole(session.user.email === "admin@gmail.com" ? "Admin" : "Kasir");
      }
      setLoading(false);
    });

    // Dengarkan perubahan status auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoggedIn(true);
        setUserEmail(session.user.email);
        setUserRole(session.user.email === "admin@gmail.com" ? "Admin" : "Kasir");
      } else {
        setLoggedIn(false);
        setUserEmail("");
        setUserRole("Kasir");
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  // ── EFFECT: Load menu dari Supabase ──
  useEffect(() => {
    supabase.from("menu").select("*").then(({ data, error }) => {
      if (error || !data) {
        setMenuItems(initialMenuItems);
        return;
      }
      // Gabungkan data Supabase dengan image lokal
      const merged = initialMenuItems.map(local => {
        const remote = data.find(b => b.id === local.id);
        return remote
          ? { ...local, price: remote.price, name: remote.name, image: imageMap[local.id] || local.image }
          : local;
      });
      setMenuItems(merged);
    });
  }, []);


  // ── EFFECT: Load riwayat transaksi dari Supabase setelah login ──
  useEffect(() => {
    if (!loggedIn) return;

    supabase
      .from("transaksi")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || !data) return;

        const parsed = data.map(row => ({
          id:            row.id,
          customerName:  row.customer_name,
          customerTable: row.customer_table,
          orderType:     row.order_type,
          paymentMethod: row.payment_method,
          orders:        row.orders || [],
          subtotal:      row.subtotal,
          tax:           row.tax,
          service:       row.service,
          discount:      row.discount,
          promoCode:     row.promo_code,
          total:         row.total,
          status:        row.status,
          timestamp:     new Date(row.created_at).getTime(),
          date:          new Date(row.created_at).toLocaleString("id-ID"),
        }));

        setHistory(parsed);
      });
  }, [loggedIn]);


  // ── Toast helper ──
  const sendToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);


  // ── LOGIN dengan Supabase ──
  const handleLogin = async () => {
    if (!loginUser || !loginPass) {
      sendToast("Email dan password wajib diisi", "warning");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email:    loginUser.trim(),
      password: loginPass,
    });

    if (error) {
      // Terjemahkan pesan error ke Bahasa Indonesia
      const pesanError = {
        "Invalid login credentials": "Email atau password salah",
        "Email not confirmed":        "Email belum diverifikasi",
        "Too many requests":          "Terlalu banyak percobaan, coba lagi nanti",
      };
      sendToast(pesanError[error.message] || error.message, "warning");
      return;
    }

    setUserEmail(data.user.email);
    setUserRole(data.user.email === "admin@gmail.com" ? "Admin" : "Kasir");
    sendToast("Login berhasil 🔥");
  };


  // ── REGISTER dengan Supabase ──
  const handleRegister = async () => {
    if (!loginUser || !loginPass) {
      sendToast("Email dan password wajib diisi", "warning");
      return;
    }

    if (loginPass.length < 6) {
      sendToast("Password minimal 6 karakter", "warning");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email:    loginUser.trim(),
      password: loginPass,
    });

    if (error) {
      const pesanError = {
        "User already registered": "Email sudah terdaftar, silakan login",
        "Password should be at least 6 characters": "Password minimal 6 karakter",
      };
      sendToast(pesanError[error.message] || error.message, "warning");
      return;
    }

    sendToast("Registrasi berhasil! Silakan login 🔥");
    setRegisterMode(false);
    setLoginPass("");
  };


  // ── LOGOUT ──
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCart([]);
    setHistory([]);
    setCustomerName("");
    setCustomerTable("");
    setPromoCode("");
    setPromoDiscount(0);
    sendToast("Sampai jumpa! 👋");
  };


  // ── Kalkulasi subtotal ──
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const getPromo      = code => promoCodes.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
  const calcDiscount  = (total, code) => {
    const p = getPromo(code);
    if (!p || !p.active) return 0;
    return p.type === "percent" ? Math.round(total * p.amount / 100) : p.amount;
  };

  const applyPromoCode = () => {
    if (!promoCode) { sendToast("Masukkan kode promo", "warning"); return; }
    const p = getPromo(promoCode);
    if (!p) { sendToast("Kode promo tidak valid", "warning"); setPromoDiscount(0); return; }
    const d = calcDiscount(subtotal, promoCode);
    setPromoDiscount(d);
    sendToast(`Promo ${p.code} aktif! Hemat Rp ${currency(d)}`);
  };


  // ── Update stok lokal setelah checkout ──
  const updateStock = (cartItems) => {
    setStockItems(prev => prev.map(stock => {
      const used = cartItems.reduce((sum, ci) => {
        const recipe = recipeMap[ci.name] || [];
        const ing    = recipe.find(r => r.id === stock.id);
        return ing ? sum + ing.qty * ci.qty : sum;
      }, 0);
      return { ...stock, qty: Math.max(0, stock.qty - used) };
    }));
  };


  // ── Tambah ke keranjang ──
  const addToCart = (item, modState = null) => {
    if (item.status === "Habis") { sendToast("Menu ini sedang habis", "warning"); return; }
    const chosenSize = modState?.size || selectedSizes[item.name] || item.sizes?.[0];
    const newItem = {
      id:        item.id,
      name:      item.name,
      size:      chosenSize?.label || "",
      price:     chosenSize?.price || item.price,
      qty:       1,
      modifiers: modState ? { addOns: modState.addOns, temp: modState.temp, sweetness: modState.sweetness } : null,
    };
    setCart(prev => [...prev, newItem]);
    sendToast(`${item.name} ditambahkan`);
  };


  // ── CHECKOUT & simpan ke Supabase ──
  const handleCheckout = async () => {
    if (cart.length === 0)                         { sendToast("Keranjang masih kosong", "warning"); return; }
    if (orderType === "Dine-In" && !customerTable) { sendToast("Pilih nomor meja dulu", "warning");  return; }

    const discount = calcDiscount(subtotal, promoCode);
    const tax      = Math.round(subtotal * taxRate);
    const service  = orderType === "Dine-In" ? Math.round(subtotal * serviceRate) : 0;
    const total    = Math.max(0, subtotal + tax + service - discount);
    const ts       = Date.now();

    const order = {
      customerName, customerTable, paymentMethod, orderType,
      subtotal, total, tax, service, discount,
      promoCode: promoCode || "",
      orders:    cart,
      timestamp: ts,
      date:      new Date(ts).toLocaleString("id-ID"),
      status:    "Selesai",
    };

    // Tampilkan dulu ke UI (langsung)
    setHistory(prev => [order, ...prev]);
    updateStock(cart);

    // Simpan ke Supabase (background)
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("transaksi").insert({
      user_id:        user?.id,
      customer_name:  customerName,
      customer_table: customerTable,
      order_type:     orderType,
      payment_method: paymentMethod,
      orders:         cart,
      subtotal,
      tax,
      service,
      discount,
      promo_code:     promoCode || "",
      total,
      status:         "Selesai",
    });

    if (error) {
      console.error("Gagal simpan transaksi:", error);
      sendToast("Transaksi berhasil tapi gagal tersimpan ke cloud", "warning");
    }

    // Reset state
    setCart([]);
    setPromoCode("");
    setPromoDiscount(0);
    setShowMobileCart(false);
    setShowReceipt(true);

    // Update status meja
    if (customerTable) {
      setTables(prev => prev.map(t => t.name === customerTable ? { ...t, status: "Terisi" } : t));
    }

    sendToast("Pembayaran berhasil! 🎉");
  };


  // ── Cetak struk ──
  const printReceipt = (order) => {
    const popup = window.open("", "_blank", "width=420,height=700");
    const items = (order.orders || []).map(it =>
      `<tr><td>${it.name}${it.size ? ` (${it.size})` : ""} x${it.qty}</td><td>Rp ${currency(it.price * it.qty)}</td></tr>`
    ).join("");
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Struk</title>
      <style>body{font-family:monospace;padding:16px}table{width:100%}th,td{text-align:left;padding:4px}
      .total{font-size:18px;font-weight:bold;margin-top:12px}</style></head><body>
      <h3 style="text-align:center">SEJUTA TAWA</h3>
      <p>Pelanggan: ${order.customerName || "-"}</p>
      <p>Meja: ${order.customerTable || "-"}</p>
      <p>Tanggal: ${order.date}</p>
      <hr><table>${items}</table><hr>
      <p>Pajak: Rp ${currency(order.tax)}</p>
      <p>Service: Rp ${currency(order.service)}</p>
      ${order.discount > 0 ? `<p>Diskon: -Rp ${currency(order.discount)}</p>` : ""}
      <p class="total">TOTAL: Rp ${currency(order.total)}</p>
      <hr><p style="text-align:center">Terima kasih!</p>
      <script>window.print();setTimeout(()=>window.close(),500);</script></body></html>`);
    popup.document.close();
  };


  // ── Toggle musik ──
  const toggleMusic = () => {
    if (!audioRef.current) return;
    isMusicOn ? audioRef.current.pause() : audioRef.current.play();
    setIsMusicOn(p => !p);
  };


  // ── Filter menu ──
  const filteredMenu = menuItems.filter(item =>
    (activeCategory === "All" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = history.filter(o => o.status !== "Dibatalkan").reduce((s, o) => s + o.total, 0);
  const orderCount   = history.filter(o => o.status !== "Dibatalkan").length;

  const navItems = [
    { id:"kasir", icon:"🛒", label:"Kasir" },
    { id:"meja",  icon:"🪑", label:"Meja" },
    { id:"admin", icon:"📊", label:"Admin" },
  ];

  // ── Sidebar content (reusable) ──
  const SidebarContent = ({ onNav }) => (
    <>
      <div className="sidebar-brand">
        <img src={logo} alt="logo" className="sidebar-logo" />
        <div>
          <strong>Sejuta Tawa</strong>
          <small>{userRole} · {userEmail.split("@")[0]}</small>
        </div>
      </div>

      <button className="music-toggle" onClick={toggleMusic}>
        {isMusicOn ? "🎵 Musik Aktif" : "🔇 Musik Mati"}
      </button>

      <nav className="sidebar-nav">
        {navItems.map(n => (
          <button key={n.id}
            className={`nav-btn ${activeNav === n.id ? "nav-active" : ""}`}
            onClick={() => { setActiveNav(n.id); onNav?.(); }}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>

      <button className="btn-logout" onClick={() => { handleLogout(); onNav?.(); }}>
        ← Keluar
      </button>
    </>
  );


  // ════════════════════════════════════════
  // RENDER: LOADING
  // ════════════════════════════════════════
  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo-ring">
        <img src={logo} alt="logo" className="loading-logo" />
      </div>
      <h1>SEJUTA TAWA</h1>
      <p>Memuat sistem kasir...</p>
    </div>
  );


  // ════════════════════════════════════════
  // RENDER: LOGIN / REGISTER
  // ════════════════════════════════════════
  if (!loggedIn) return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="logo" className="login-avatar" />
        <h2>{registerMode ? "Daftar Akun" : "Masuk Kasir"}</h2>
        <p>{registerMode ? "Buat akun kasir baru" : "Login untuk mengakses sistem"}</p>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={loginUser}
          onChange={e => setLoginUser(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (registerMode ? handleRegister() : handleLogin())}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password (min. 6 karakter)"
          value={loginPass}
          onChange={e => setLoginPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (registerMode ? handleRegister() : handleLogin())}
        />

        <button className="btn-checkout" onClick={registerMode ? handleRegister : handleLogin}>
          {registerMode ? "Daftar Sekarang" : "Masuk →"}
        </button>

        <span className="login-switch" onClick={() => { setRegisterMode(p => !p); setLoginPass(""); }}>
          {registerMode ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
        </span>
      </div>
      <Toast toast={toast} />
    </div>
  );


  // ════════════════════════════════════════
  // RENDER: MAIN APP
  // ════════════════════════════════════════
  return (
    <div className="app-shell">
      <audio ref={audioRef} src={music} autoPlay loop />

      {/* ─ SIDEBAR DESKTOP ─ */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* ─ HEADER MOBILE ─ */}
      <header className="mobile-header">
        <button className="hamburger" onClick={() => setShowSidebar(true)}>☰</button>
        <div className="mobile-brand">
          <img src={logo} alt="logo" className="mobile-logo" />
          <span>Sejuta Tawa</span>
        </div>
        {activeNav === "kasir" && (
          <button className="cart-fab-mini" onClick={() => setShowMobileCart(true)}>
            🛒
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        )}
      </header>

      {/* ─ SIDEBAR DRAWER MOBILE ─ */}
      {showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
          <aside className="sidebar-drawer" onClick={e => e.stopPropagation()}>
            <button className="btn-icon" onClick={() => setShowSidebar(false)}
              style={{ alignSelf:"flex-end", margin:"8px 8px 0" }}>✕</button>
            <SidebarContent onNav={() => setShowSidebar(false)} />
          </aside>
        </div>
      )}

      {/* ─ MAIN CONTENT ─ */}
      <main className="main-content">

        {/* ══ KASIR ══ */}
        {activeNav === "kasir" && (
          <div className="kasir-layout">
            <div className="kasir-menu">
              <div className="menu-controls">
                <input className="search-input" type="text" placeholder="🔍 Cari menu..."
                  value={search} onChange={e => setSearch(e.target.value)} />
                <div className="category-pills">
                  {["All", "Food", "Drinks", "Snack", "Dessert"].map(cat => (
                    <button key={cat}
                      className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
                      onClick={() => setActiveCategory(cat)}>{cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="menu-grid">
                {filteredMenu.map(item => (
                  <div key={item.id} className="menu-card">
                    <div className="menu-card-img-wrap">
                      <img src={imageMap[item.id] || item.image} alt={item.name}
                        className="menu-card-img"
                        onError={e => { e.target.style.display = "none"; }} />
                      <span className="menu-cat-badge">{item.category}</span>
                      {item.status === "Habis" && <div className="menu-sold-out">Habis</div>}
                    </div>
                    <div className="menu-card-body">
                      <h5 className="menu-card-name">{item.name}</h5>
                      <p className="menu-card-price">Rp {currency(item.price)}</p>
                      {item.hasSizes && (
                        <div className="size-row">
                          {item.sizes.map(sz => (
                            <button key={sz.label}
                              className={`size-chip ${selectedSizes[item.name]?.label === sz.label ? "size-active" : ""}`}
                              onClick={() => setSelectedSizes(p => ({ ...p, [item.name]: sz }))}>
                              {sz.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="menu-card-actions">
                        <button className="btn-add" onClick={() => addToCart(item)}>+ Tambah</button>
                        <button className="btn-custom" onClick={() => { setModifierItem(item); setShowModifier(true); }}>⚙</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Cart */}
            <div className="desktop-cart">
              <CartPanel
                cart={cart} setCart={setCart}
                customerName={customerName} setCustomerName={setCustomerName}
                customerTable={customerTable} setCustomerTable={setCustomerTable}
                orderType={orderType} setOrderType={setOrderType}
                paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                promoCode={promoCode} setPromoCode={setPromoCode}
                promoDiscount={promoDiscount} applyPromoCode={applyPromoCode}
                subtotal={subtotal} taxRate={taxRate} serviceRate={serviceRate}
                onCheckout={handleCheckout}
              />
            </div>

            {/* Mobile FAB */}
            {cart.length > 0 && (
              <div className="mobile-cart-fab-bar">
                <button className="btn-checkout" onClick={() => setShowMobileCart(true)}>
                  🛒 {cart.length} item · Rp {currency(subtotal)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ MEJA ══ */}
        {activeNav === "meja" && (
          <div className="page-section">
            <div className="page-header">
              <h2>Manajemen Meja</h2>
              <p>Pilih meja aktif untuk pesanan Dine-In</p>
            </div>
            <div className="table-grid">
              {tables.map(t => (
                <button key={t.name}
                  className={`table-card ${t.status === "Terisi" ? "table-occupied" : ""} ${customerTable === t.name ? "table-selected" : ""}`}
                  onClick={() => {
                    if (t.status === "Kosong") {
                      setCustomerTable(t.name);
                      setActiveNav("kasir");
                      sendToast(`Meja ${t.name} dipilih`);
                    } else {
                      sendToast("Meja sedang terisi", "warning");
                    }
                  }}>
                  <span className="table-icon">🪑</span>
                  <strong>{t.name}</strong>
                  <small>{t.status}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ ADMIN ══ */}
        {activeNav === "admin" && (
          <div className="page-section">
            <div className="page-header">
              <h2>Dashboard Admin</h2>
              <div className="admin-tabs">
                {[
                  { id:"ringkasan", label:"Ringkasan" },
                  { id:"menu",      label:"Kelola Menu" },
                  { id:"stok",      label:"Stok" },
                  { id:"transaksi", label:"Transaksi" },
                ].map(t => (
                  <button key={t.id}
                    className={`tab-btn ${adminTab === t.id ? "tab-active" : ""}`}
                    onClick={() => setAdminTab(t.id)}>{t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Ringkasan */}
            {adminTab === "ringkasan" && (
              <>
                <div className="stat-grid">
                  {[
                    { label:"Total Penjualan", value:`Rp ${currency(totalRevenue)}`, icon:"💰" },
                    { label:"Total Transaksi", value:orderCount, icon:"🧾" },
                    { label:"Meja Terisi", value:`${tables.filter(t => t.status === "Terisi").length}/${tables.length}`, icon:"🪑" },
                    { label:"Poin Kasir",  value:`${history.reduce((a, o) => a + Math.floor(o.total / 10000), 0)} Pts`, icon:"⭐" },
                  ].map(c => (
                    <div key={c.label} className="stat-card">
                      <div className="stat-icon">{c.icon}</div>
                      <div>
                        <small>{c.label}</small>
                        <h3>{c.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                <TopChart menuItems={menuItems} history={history} />
              </>
            )}

            {/* Tab: Kelola Menu */}
            {adminTab === "menu" && (
              <div className="admin-section">
                <div className="admin-menu-list">
                  {menuItems.map(item => (
                    <div key={item.id} className="admin-menu-row">
                      <img src={imageMap[item.id] || item.image} alt={item.name} className="admin-menu-thumb" />
                      <div className="admin-menu-info">
                        <strong>{item.name}</strong>
                        <small>{item.category} · Rp {currency(item.price)}</small>
                      </div>
                      <div className="admin-menu-actions">
                        <button className="btn-sm" onClick={() => {
                          setEditingMenu(item);
                          setMenuForm({ name:item.name, price:String(item.price), category:item.category, image:"" });
                        }}>✏ Edit</button>
                        <button className="btn-sm danger" onClick={() => {
                          setMenuItems(p => p.filter(m => m.id !== item.id));
                          sendToast("Menu dihapus");
                        }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-form-card">
                  <h4>➕ Tambah Menu Baru</h4>
                  <div className="admin-form-grid">
                    <input className="form-input" placeholder="Nama Menu"
                      value={menuForm.name} onChange={e => setMenuForm(p => ({ ...p, name: e.target.value }))} />
                    <input className="form-input" type="number" placeholder="Harga"
                      value={menuForm.price} onChange={e => setMenuForm(p => ({ ...p, price: e.target.value }))} />
                    <select className="form-input" value={menuForm.category}
                      onChange={e => setMenuForm(p => ({ ...p, category: e.target.value }))}>
                      <option>Food</option><option>Drinks</option><option>Snack</option><option>Dessert</option>
                    </select>
                    <input className="form-input" type="file" accept="image/*"
                      onChange={e => {
                        const f = e.target.files[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = ev => setMenuForm(p => ({ ...p, image: ev.target.result }));
                        r.readAsDataURL(f);
                      }} />
                  </div>
                  <button className="btn-primary" onClick={() => {
                    if (!menuForm.name || !menuForm.price) { sendToast("Nama & harga wajib diisi", "warning"); return; }
                    const newMenu = {
                      id:       Date.now(),
                      name:     menuForm.name,
                      category: menuForm.category,
                      image:    menuForm.image || "",
                      price:    Number(menuForm.price),
                      sold:     0,
                      status:   "Tersedia",
                      hasSizes: false,
                    };
                    setMenuItems(p => [...p, newMenu]);
                    // Simpan ke Supabase
                    supabase.from("menu").insert({
                      id:       newMenu.id,
                      name:     newMenu.name,
                      category: newMenu.category,
                      price:    newMenu.price,
                    }).then(({ error }) => {
                      if (error) console.error("Gagal simpan menu:", error);
                    });
                    setMenuForm({ name:"", price:"", category:"Food", image:"" });
                    sendToast("Menu baru ditambahkan!");
                  }}>Simpan Menu</button>
                </div>
              </div>
            )}

            {/* Tab: Stok */}
            {adminTab === "stok" && (
              <div className="stock-grid">
                {stockItems.map(s => (
                  <div key={s.id} className={`stock-card ${s.qty <= s.threshold ? "stock-low" : ""}`}>
                    <div className="stock-label">
                      <strong>{s.label}</strong>
                      {s.qty <= s.threshold && <span className="badge badge-red">Hampir Habis</span>}
                    </div>
                    <input className="form-input" type="number" value={s.qty}
                      onChange={e => setStockItems(p => p.map(x =>
                        x.id === s.id ? { ...x, qty: Math.max(0, Number(e.target.value)) } : x
                      ))} />
                    <div className="stock-bar-wrap">
                      <div className="stock-bar" style={{ width:`${Math.min(100, (s.qty / 150) * 100)}%` }} />
                    </div>
                    <small>{s.qty} unit tersisa</small>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Transaksi */}
            {adminTab === "transaksi" && (
              <div className="trans-list">
                {history.length === 0
                  ? <p className="empty-state">Belum ada transaksi</p>
                  : history.map((h, i) => (
                    <div key={h.id || i} className={`trans-card ${h.status === "Dibatalkan" ? "trans-void" : ""}`}>
                      <div className="trans-info">
                        <strong>{h.customerName || "Pelanggan"}</strong>
                        <small>Meja {h.customerTable || "-"} · {h.date}</small>
                        <small>{h.paymentMethod} · {h.orderType}</small>
                      </div>
                      <div className="trans-right">
                        <span className="trans-amount">Rp {currency(h.total)}</span>
                        <span className={`badge ${h.status === "Dibatalkan" ? "badge-red" : "badge-green"}`}>
                          {h.status || "Selesai"}
                        </span>
                        {h.status !== "Dibatalkan" && (
                          <button className="btn-sm danger" onClick={async () => {
                            // Update di Supabase kalau ada id
                            if (h.id && typeof h.id === "number") {
                              await supabase.from("transaksi")
                                .update({ status: "Dibatalkan" })
                                .eq("id", h.id);
                            }
                            setHistory(p => p.map((x, j) => j === i ? { ...x, status:"Dibatalkan" } : x));
                            sendToast("Pesanan dibatalkan", "warning");
                          }}>Void</button>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─ MOBILE CART DRAWER ─ */}
      {showMobileCart && (
        <div className="modal-backdrop" onClick={() => setShowMobileCart(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-handle" />
            <CartPanel
              cart={cart} setCart={setCart}
              customerName={customerName} setCustomerName={setCustomerName}
              customerTable={customerTable} setCustomerTable={setCustomerTable}
              orderType={orderType} setOrderType={setOrderType}
              paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
              promoCode={promoCode} setPromoCode={setPromoCode}
              promoDiscount={promoDiscount} applyPromoCode={applyPromoCode}
              subtotal={subtotal} taxRate={taxRate} serviceRate={serviceRate}
              onCheckout={handleCheckout}
              onClose={() => setShowMobileCart(false)}
            />
          </div>
        </div>
      )}

      {/* ─ MODIFIER MODAL ─ */}
      {showModifier && modifierItem && (
        <ModifierModal
          item={modifierItem}
          onAdd={(item, state) => { addToCart(item, state); setShowModifier(false); setModifierItem(null); }}
          onClose={() => { setShowModifier(false); setModifierItem(null); }}
        />
      )}

      {/* ─ EDIT MENU MODAL ─ */}
      {editingMenu && (
        <Modal onClose={() => setEditingMenu(null)}>
          <div className="modal-title">
            <strong>Edit Menu</strong>
            <button className="btn-icon" onClick={() => setEditingMenu(null)}>✕</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
            <input className="form-input" placeholder="Nama Menu" value={menuForm.name}
              onChange={e => setMenuForm(p => ({ ...p, name: e.target.value }))} />
            <input className="form-input" type="number" placeholder="Harga" value={menuForm.price}
              onChange={e => setMenuForm(p => ({ ...p, price: e.target.value }))} />
          </div>
          <div className="modal-footer">
            <span />
            <div className="modal-footer-btns">
              <button className="btn-ghost" onClick={() => setEditingMenu(null)}>Batal</button>
              <button className="btn-primary" onClick={() => {
                setMenuItems(p => p.map(m => m.id === editingMenu.id
                  ? { ...m, ...menuForm, price: Number(menuForm.price), image: imageMap[m.id] || m.image }
                  : m
                ));
                // Update di Supabase
                supabase.from("menu")
                  .update({ name: menuForm.name, price: Number(menuForm.price) })
                  .eq("id", editingMenu.id)
                  .then(({ error }) => { if (error) console.error("Gagal update menu:", error); });
                setEditingMenu(null);
                sendToast("Menu diperbarui");
              }}>Simpan</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─ RECEIPT MODAL ─ */}
      {showReceipt && history[0] && (
        <ReceiptModal
          order={history[0]}
          onPrint={() => { printReceipt(history[0]); setShowReceipt(false); }}
          onClose={() => setShowReceipt(false)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}