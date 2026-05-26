import "./App.css";
import { useEffect, useState, useRef } from "react";

import logo from "./assets/KAFE_KAFEAN_LOGO.jpg";
import caffe from "./assets/caffe.jpg";
import cookies from "./assets/cookies.jpg";
import donat from "./assets/donat.jpg";
import fries from "./assets/fries.jpg";
import fudgy from "./assets/fudgy.jpg";
import hazelnut from "./assets/hazelnut.jpg";
import lemon from "./assets/lemon.jpg";
import matcha from "./assets/matcha.jpg";
import panini from "./assets/panini.jpg";
import pasta from "./assets/pasta.jpg";
import salad from "./assets/salad.jpg";
import stoberi from "./assets/stoberi.jpg";
import strawberry from "./assets/strawberry.jpg";
import music from "./assets/alex-morgan-bebop-coffee-shop-517090.mp3";

const currency = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const temperatureOptions = ["Panas", "Dingin"];
const drinkAddOns = ["Es Krim", "Boba", "Espresso Shot"];
const foodAddOns = ["Extra Keju", "Extra Saus", "Tambahan Sambal"];

// ── Color Palette ──────────────────────────────────────────────────────────
const C = {
  crimson:      "#7B1C1C",
  crimsonDark:  "#4A0F0F",
  crimsonLight: "#9B2C2C",
  parchment:    "#F0EBE3",
  cream:        "#FAF7F2",
  creamDark:    "#EDE4D8",
  gold:         "#C9A96E",
  goldLight:    "#E8D5B0",
  charcoal:     "#2C1810",
  muted:        "#8B7355",
  mutedLight:   "#B8A898",
  white:        "#FFFFFF",
  red:          "#DC2626",
  green:        "#059669",
  greenLight:   "#D1FAE5",
};

const btn = {
  primary: {
    background: `linear-gradient(135deg, ${C.crimson} 0%, ${C.crimsonDark} 100%)`,
    color: C.white, border: "none", borderRadius: 10, fontWeight: "700",
    cursor: "pointer", letterSpacing: "0.5px",
    boxShadow: `0 4px 14px rgba(123,28,28,0.35)`, transition: "all 0.2s ease",
  },
  secondary: {
    background: C.parchment, color: C.crimsonDark,
    border: `1.5px solid ${C.goldLight}`, borderRadius: 10,
    fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease",
  },
  ghost: {
    background: "transparent", color: C.muted,
    border: `1.5px solid ${C.creamDark}`, borderRadius: 10,
    fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease",
  },
  danger: {
    background: `linear-gradient(135deg, #DC2626 0%, #991B1B 100%)`,
    color: C.white, border: "none", borderRadius: 10, fontWeight: "700",
    cursor: "pointer", boxShadow: "0 4px 14px rgba(220,38,38,0.3)", transition: "all 0.2s ease",
  },
  success: {
    background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
    color: C.white, border: "none", borderRadius: 10, fontWeight: "700",
    cursor: "pointer", boxShadow: "0 4px 14px rgba(5,150,105,0.3)", transition: "all 0.2s ease",
  },
};

const createOrderData = ({
  customerName, customerPhone, customerTable, paymentMethod,
  orderType, notes, total, cart, promoCode, discount, tax, service, subtotal,
}) => {
  const timestamp = Date.now();
  return {
    customerName, customerPhone, customerTable, paymentMethod,
    orderType, notes, subtotal, total, promoCode, discount, tax, service,
    orders: cart, timestamp,
    shortDate: new Date(timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    date: new Date(timestamp).toLocaleString("id-ID"),
  };
};

const initialTables = [
  { name: "A01",   status: "Kosong" }, { name: "A02",   status: "Kosong" },
  { name: "A03",   status: "Kosong" }, { name: "A04",   status: "Kosong" },
  { name: "A05",   status: "Kosong" }, { name: "B01",   status: "Kosong" },
  { name: "B02",   status: "Kosong" }, { name: "B03",   status: "Kosong" },
  { name: "B04",   status: "Kosong" }, { name: "B05",   status: "Kosong" },
  { name: "VIP01", status: "Kosong" }, { name: "VIP02", status: "Kosong" },
];

const initialStockItems = [
  { id: "coffee",  label: "Biji Kopi", qty: 120, threshold: 20 },
  { id: "milk",    label: "Susu",      qty: 90,  threshold: 20 },
  { id: "cup",     label: "Cup",       qty: 70,  threshold: 15 },
  { id: "tea",     label: "Teh",       qty: 80,  threshold: 15 },
  { id: "biscuit", label: "Biskuit",   qty: 50,  threshold: 10 },
  { id: "sugar",   label: "Gula",      qty: 100, threshold: 20 },
];

const recipeMap = {
  "Fresh Salad":            [{ id: "biscuit", qty: 1 }, { id: "milk",    qty: 1 }],
  "Pizza Panini":           [{ id: "cup",     qty: 1 }, { id: "milk",    qty: 1 }],
  "Creamy Pasta":           [{ id: "milk",    qty: 2 }],
  "French Fries":           [{ id: "cup",     qty: 1 }],
  "Chocolate Cookies":      [{ id: "biscuit", qty: 2 }],
  "Dough Boy":              [{ id: "biscuit", qty: 1 }],
  "Fudgy Brownies":         [{ id: "milk",    qty: 1 }, { id: "biscuit", qty: 1 }],
  "Chocolate Strawberry":   [{ id: "biscuit", qty: 1 }, { id: "milk",    qty: 1 }],
  "Strawberry Crunch Cream":[{ id: "milk",    qty: 1 }],
  "Hazelnut Coffee":        [{ id: "coffee",  qty: 2 }, { id: "milk",    qty: 1 }, { id: "cup", qty: 1 }],
  "Matcha Latte":           [{ id: "tea",     qty: 2 }, { id: "milk",    qty: 1 }, { id: "cup", qty: 1 }],
  "Caffe Latte":            [{ id: "coffee",  qty: 2 }, { id: "milk",    qty: 1 }, { id: "cup", qty: 1 }],
  "Lemon Tea":              [{ id: "tea",     qty: 1 }, { id: "cup",     qty: 1 }],
};

const initialPromoCodes = [
  { code: "KAFE10",    type: "percent", amount: 10,    description: "Diskon 10% untuk semua pelanggan",                        active: true },
  { code: "BARISTA20", type: "fixed",   amount: 20000, description: "Potongan Rp 20.000 untuk pembelian di atas Rp 100.000",   active: true },
];

const initialMenuItems = [
  { id: 1,  name: "Fresh Salad",             category: "Food",    image: salad,       price: 28000, sold: 12, status: "Tersedia", hasSizes: false },
  { id: 2,  name: "Pizza Panini",            category: "Food",    image: panini,      price: 42000, sold: 19, status: "Tersedia", hasSizes: false },
  { id: 3,  name: "Creamy Pasta",            category: "Food",    image: pasta,       price: 38000, sold: 15, status: "Tersedia", hasSizes: false },
  { id: 4,  name: "French Fries",            category: "Snack",   image: fries,       price: 18000, sold: 21, status: "Tersedia", hasSizes: false },
  { id: 5,  name: "Chocolate Cookies",       category: "Snack",   image: cookies,     price: 20000, sold: 7,  status: "Tersedia", hasSizes: false },
  { id: 6,  name: "Dough Boy",               category: "Snack",   image: donat,       price: 25000, sold: 9,  status: "Tersedia", hasSizes: false },
  { id: 7,  name: "Fudgy Brownies",          category: "Dessert", image: fudgy,       price: 30000, sold: 13, status: "Tersedia", hasSizes: false },
  { id: 8,  name: "Chocolate Strawberry",    category: "Dessert", image: strawberry,  price: 33000, sold: 11, status: "Tersedia", hasSizes: false },
  { id: 9,  name: "Strawberry Crunch Cream", category: "Dessert", image: stoberi,     price: 35000, sold: 5,  status: "Tersedia", hasSizes: false },
  { id: 10, name: "Hazelnut Coffee",         category: "Drinks",  image: hazelnut,    price: 22000, sold: 30, status: "Tersedia", hasSizes: true,
    sizes: [{ label: "S", price: 22000 }, { label: "M", price: 27000 }, { label: "L", price: 32000 }] },
  { id: 11, name: "Matcha Latte",            category: "Drinks",  image: matcha,      price: 24000, sold: 26, status: "Tersedia", hasSizes: true,
    sizes: [{ label: "S", price: 24000 }, { label: "M", price: 29000 }, { label: "L", price: 34000 }] },
  { id: 12, name: "Caffe Latte",             category: "Drinks",  image: caffe,       price: 21000, sold: 18, status: "Tersedia", hasSizes: true,
    sizes: [{ label: "S", price: 21000 }, { label: "M", price: 26000 }, { label: "L", price: 31000 }] },
  { id: 13, name: "Lemon Tea",               category: "Drinks",  image: lemon,       price: 18000, sold: 14, status: "Tersedia", hasSizes: true,
    sizes: [{ label: "S", price: 18000 }, { label: "M", price: 22000 }, { label: "L", price: 26000 }] },
];

// ── TOP SELLING CHART COMPONENT ────────────────────────────────────────────
function TopSellingChart({ menuItems, history }) {
  const salesMap = {};
  menuItems.forEach(m => { salesMap[m.name] = m.sold || 0; });
  history.filter(o => o.status !== "Dibatalkan").forEach(order => {
    (order.orders || []).forEach(item => {
      salesMap[item.name] = (salesMap[item.name] || 0) + (item.qty || 1);
    });
  });

  const sorted = Object.entries(salesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const maxVal = sorted[0]?.count || 1;

  const barColors = [
    `linear-gradient(180deg, ${C.crimson}, ${C.crimsonDark})`,
    `linear-gradient(180deg, ${C.gold}, #A8763E)`,
    `linear-gradient(180deg, #9B2C2C, #7B1C1C)`,
    `linear-gradient(180deg, #C9A96E, #A8763E)`,
    `linear-gradient(180deg, #B45309, #92400E)`,
    `linear-gradient(180deg, #7C2D12, #431407)`,
    `linear-gradient(180deg, #D97706, #B45309)`,
  ];

  const chartH = 200;

  return (
    <div style={{
      background: C.white, borderRadius: 16, padding: 24,
      border: `1px solid ${C.goldLight}`,
      boxShadow: `0 4px 20px rgba(123,28,28,0.07)`,
      marginTop: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 22 }}>🏆</span>
        <div>
          <h3 style={{ margin: 0, color: C.crimsonDark, fontSize: 16, letterSpacing: 0.5 }}>Menu Paling Terlaris</h3>
          <small style={{ color: C.muted }}>Berdasarkan total penjualan kumulatif</small>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: chartH + 30, paddingBottom: 30, position: "relative" }}>
        {[0, 25, 50, 75, 100].map(pct => (
          <div key={pct} style={{
            position: "absolute", left: 0, right: 0,
            bottom: 30 + (pct / 100) * chartH,
            borderTop: `1px dashed ${C.creamDark}`,
            zIndex: 0,
          }}>
            <span style={{ position: "absolute", left: -4, top: -9, fontSize: 9, color: C.mutedLight, transform: "translateX(-100%)" }}>
              {Math.round((pct / 100) * maxVal)}
            </span>
          </div>
        ))}

        {sorted.map((item, i) => {
          const barH = Math.max(8, Math.round((item.count / maxVal) * chartH));
          const shortName = item.name.length > 10 ? item.name.substring(0, 9) + "…" : item.name;
          return (
            <div key={item.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: "700", color: C.crimson,
                marginBottom: 4, background: C.parchment,
                padding: "2px 6px", borderRadius: 10,
                border: `1px solid ${C.goldLight}`,
              }}>{item.count}</div>
              <div style={{
                width: "100%", height: barH,
                background: barColors[i % barColors.length],
                borderRadius: "6px 6px 0 0",
                boxShadow: `0 -2px 8px rgba(123,28,28,0.2)`,
                transition: "height 0.4s ease",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "40%",
                  background: "rgba(255,255,255,0.15)", borderRadius: "6px 6px 0 0",
                }} />
              </div>
              <div style={{
                position: "absolute", bottom: -28, fontSize: 9, color: C.charcoal,
                textAlign: "center", fontWeight: "600", width: "100%",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                letterSpacing: 0.2,
              }}>{shortName}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, borderTop: `1px solid ${C.creamDark}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {sorted.map((item, i) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: barColors[i % barColors.length] }} />
              <span style={{ fontSize: 12, color: C.charcoal }}>{i + 1}. {item.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                height: 6, width: Math.max(20, Math.round((item.count / maxVal) * 120)),
                background: barColors[i % barColors.length], borderRadius: 3,
              }} />
              <span style={{ fontSize: 12, fontWeight: "700", color: C.crimson, minWidth: 28, textAlign: "right" }}>{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DIGITAL RECEIPT MODAL ──────────────────────────────────────────────────
function DigitalReceiptModal({ order, onPrintPhysical, onClose }) {
  if (!order) return null;
  const orderId = `ST-${order.timestamp?.toString().slice(-6) || "000000"}`;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(44,24,16,0.75)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 999, padding: 20,
    }}>
      <div style={{
        background: C.cream, borderRadius: 20, width: "100%", maxWidth: 420,
        boxShadow: `0 24px 60px rgba(74,15,15,0.45)`,
        border: `1px solid ${C.goldLight}`,
        maxHeight: "92vh", overflowY: "auto",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.crimsonDark}, ${C.crimson})`,
          padding: "24px 24px 20px", borderRadius: "20px 20px 0 0",
          textAlign: "center", position: "relative",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px", fontSize: 26, border: `2px solid rgba(255,255,255,0.3)`,
          }}>✅</div>
          <h3 style={{ margin: 0, color: C.goldLight, fontSize: 18, letterSpacing: 1 }}>Pembayaran Berhasil!</h3>
          <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Terima kasih telah berbelanja</p>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          <div style={{
            textAlign: "center", paddingTop: 20, paddingBottom: 16,
            borderBottom: `2px dashed ${C.goldLight}`,
          }}>
            <p style={{ margin: 0, fontWeight: "800", color: C.crimsonDark, fontSize: 16, letterSpacing: 2 }}>☕ SEJUTA TAWA</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>est. 2010 — Kafe Premium Lokal</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>Nomor Order: <strong style={{ color: C.crimson }}>{orderId}</strong></p>
          </div>

          <div style={{ padding: "14px 0", borderBottom: `1px dashed ${C.goldLight}`, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { label: "Pelanggan",    value: order.customerName  || "—" },
              { label: "Meja",         value: order.customerTable || "Takeaway" },
              { label: "Tipe Pesanan", value: order.orderType     || "—" },
              { label: "Pembayaran",   value: order.paymentMethod || "—" },
              { label: "Tanggal",      value: order.date          || "—" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: C.muted }}>{row.label}</span>
                <span style={{ color: C.charcoal, fontWeight: "600" }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 0", borderBottom: `1px dashed ${C.goldLight}` }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: "700", color: C.muted, letterSpacing: 1 }}>DETAIL PESANAN</p>
            {(order.orders || []).map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 8,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: "700", color: C.charcoal }}>
                    {item.name} {item.size ? `(${item.size})` : ""}
                  </p>
                  {item.modifiers && (
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: C.mutedLight }}>
                      {[item.modifiers.temp, item.modifiers.sweetness, ...(item.modifiers.addOns || [])].filter(Boolean).join(" • ")}
                    </p>
                  )}
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>
                    {item.qty} × Rp {currency(item.price)}
                  </p>
                </div>
                <span style={{ fontSize: 13, fontWeight: "700", color: C.crimsonDark, marginLeft: 10 }}>
                  Rp {currency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 0", borderBottom: `2px dashed ${C.goldLight}` }}>
            {[
              { label: "Subtotal",     value: `Rp ${currency(order.subtotal)}` },
              { label: "Pajak (11%)",  value: `Rp ${currency(order.tax)}` },
              { label: "Service Fee",  value: `Rp ${currency(order.service)}` },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 5 }}>
                <span>{row.label}</span><span>{row.value}</span>
              </div>
            ))}
            {order.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.red, marginBottom: 5 }}>
                <span>Diskon ({order.promoCode})</span><span>- Rp {currency(order.discount)}</span>
              </div>
            )}
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 0 12px",
          }}>
            <span style={{ fontSize: 15, fontWeight: "700", color: C.charcoal }}>TOTAL BAYAR</span>
            <span style={{ fontSize: 22, fontWeight: "800", color: C.crimson, letterSpacing: 0.5 }}>
              Rp {currency(order.total)}
            </span>
          </div>

          <div style={{
            textAlign: "center", padding: "12px 0",
            borderTop: `1px dashed ${C.goldLight}`,
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 6 }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} style={{
                  width: i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 2,
                  height: 28, background: C.charcoal, borderRadius: 1,
                  opacity: 0.7 + (i % 4) * 0.075,
                }} />
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 9, color: C.mutedLight, letterSpacing: 2 }}>{orderId}</p>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginBottom: 20, fontStyle: "italic" }}>
            Terima kasih sudah berkunjung ke Sejuta Tawa 🙏<br />
            Semoga hari Anda menyenangkan!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={onPrintPhysical}
              style={{ ...btn.primary, width: "100%", padding: 13, fontSize: 13, letterSpacing: 0.5, fontFamily: "inherit" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >🖨️ Cetak Struk Fisik</button>
            <button
              onClick={onClose}
              style={{ ...btn.ghost, width: "100%", padding: 13, fontSize: 13, fontFamily: "inherit" }}
            >✕ Tutup Struk</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
function App() {
  // ── STATE ────────────────────────────────────────────────────────────────
  const [loading,          setLoading]          = useState(true);
  const [loggedIn,         setLoggedIn]         = useState(false);
  const [adminMode,        setAdminMode]        = useState(false);
  const [showReceipt,      setShowReceipt]      = useState(false);
  const [search,           setSearch]           = useState("");
  const [paymentMethod,    setPaymentMethod]    = useState("Tunai");
  const [isRegisterMode,   setIsRegisterMode]   = useState(false);
  const [activeCategory,   setActiveCategory]   = useState("All");
  const [customerName,     setCustomerName]     = useState("");
  const [customerPhone,    setCustomerPhone]    = useState("");
  const [customerTable,    setCustomerTable]    = useState("");
  const [notes,            setNotes]            = useState("");
  const [tables,           setTables]           = useState(initialTables);
  const [menuItems,        setMenuItems]        = useState([]);
  const [stockItems,       setStockItems]       = useState(initialStockItems);
  const [promoCodes,       setPromoCodes]       = useState(initialPromoCodes);
  const [adminTab,         setAdminTab]         = useState("Ringkasan");
  const [loginUsername,    setLoginUsername]    = useState("");
  const [loginPassword,    setLoginPassword]    = useState("");
  const [keranjang, setKeranjang] = useState([]);
  const [userRole,         setUserRole]         = useState("");
  const [toast,            setToast]            = useState(null);
  const [promoCode,        setPromoCode]        = useState("");
  const [promoDiscount,    setPromoDiscount]    = useState(0);
  const [userMenuSelection,setUserMenuSelection]= useState("Kasir Utama");
  const [orderType,        setOrderType]        = useState("Dine-In");
  const [showModifiers,    setShowModifiers]    = useState(false);
  const [modifierItem,     setModifierItem]     = useState(null);
  const [modifierState,    setModifierState]    = useState({ size: null, addOns: [], temp: "Dingin", sweetness: "Normal", notes: "" });
  const [taxRate]                               = useState(0.11);
  const [serviceRate]                           = useState(0.05);
  const [history,          setHistory]          = useState([]);
  const [menuForm,         setMenuForm]         = useState({
    id: null, name: "", price: "", category: "Food", image: "",
    status: "Tersedia", hasSizes: false,
    sizes: [{ label: "S", price: 0 }, { label: "M", price: 0 }, { label: "L", price: 0 }],
  });
  const [cart,             setCart]             = useState([]);
  const [selectedSizes,    setSelectedSizes]    = useState({});
  const [editingMenuId,    setEditingMenuId]    = useState(null);
  const [isMusicPlaying,   setIsMusicPlaying]   = useState(true);
  const audioRef = useRef(null);

  // ── EFFECTS ──────────────────────────────────────────────────────────────

 // Fetch menu dari backend (jika tersedia), fallback ke initialMenuItems
useEffect(() => {
  fetch("http://localhost:5000/api/menu")
    .then(res => res.json())
    .then(data => {
      const merged = initialMenuItems.map(localItem => {
        const backendItem = data.find(b => b.id === localItem.id);
        return backendItem
          ? { ...localItem, price: backendItem.price, name: backendItem.name }
          : localItem;
      });
      setMenuItems(merged);
    })
    .catch(() => setMenuItems(initialMenuItems));
}, []);
  // Loading screen timer
  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // ── HANDLERS ─────────────────────────────────────────────────────────────

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(prev => !prev);
  };

  const handleSizeSelect = (item, size) =>
    setSelectedSizes(prev => ({ ...prev, [item.name]: size }));

  const sendToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const isGmail = (value) =>
    typeof value === "string" && /^[^\s@]+@gmail\.com$/i.test(value);

  const handleLogin = () => {
    if (!isGmail(loginUsername)) { sendToast("Masukkan alamat Gmail yang valid", "warning"); return; }
    if (!loginPassword)          { sendToast("Masukkan password Anda", "warning"); return; }
    setLoggedIn(true);
    const role = loginUsername.toLowerCase() === "admin@gmail.com" ? "Admin" : "Kasir";
    setUserRole(role);
    sendToast(`Login berhasil sebagai ${role}`);
  };

  const handleRegister = () => {
    if (!isGmail(loginUsername)) { sendToast("Masukkan alamat Gmail yang valid", "warning"); return; }
    if (!loginPassword)          { sendToast("Masukkan password Anda", "warning"); return; }
    sendToast("Registrasi berhasil (Simulasi)");
    setIsRegisterMode(false);
    setLoginPassword("");
  };

  const getPromo = (code) =>
    promoCodes.find(p => p.code.toUpperCase() === code.trim().toUpperCase());

  const calculatePromoDiscount = (total, code) => {
    const promo = getPromo(code);
    if (!promo || !promo.active) return 0;
    if (promo.type === "percent") return Math.round((total * promo.amount) / 100);
    return promo.amount;
  };

  const applyPromoCode = () => {
    if (!promoCode) { sendToast("Masukkan kode promo terlebih dahulu", "warning"); return; }
    const promo = getPromo(promoCode);
    if (!promo)     { sendToast("Kode promo tidak valid", "warning"); setPromoDiscount(0); return; }
    const discount = calculatePromoDiscount(total, promoCode);
    setPromoDiscount(discount);
    sendToast(`Promo ${promo.code} aktif: Rp ${discount.toLocaleString()}`);
  };

  const updateStockAfterOrder = (cartItems) => {
    const updated = stockItems.map(stock => {
      const usage = cartItems.reduce((sum, cartItem) => {
        const recipe     = recipeMap[cartItem.name] || [];
        const ingredient = recipe.find(r => r.id === stock.id);
        if (!ingredient) return sum;
        return sum + ingredient.qty * cartItem.qty;
      }, 0);
      return { ...stock, qty: Math.max(0, stock.qty - usage) };
    });
    setStockItems(updated);
  };

  const toggleTableStatus = (tableName) => {
    setTables(prev => prev.map(table =>
      table.name === tableName
        ? { ...table, status: table.status === "Kosong" ? "Terisi" : "Kosong" }
        : table
    ));
  };

  const startEditMenu = (item) => {
    setEditingMenuId(item.id);
    setMenuForm({
      ...item, price: item.price.toString(),
      sizes: item.sizes || [{ label: "S", price: 0 }, { label: "M", price: 0 }, { label: "L", price: 0 }],
    });
  };

  const saveMenuUpdate = () => {
    setMenuItems(prev => prev.map(item =>
      item.id === editingMenuId ? { ...item, ...menuForm, price: Number(menuForm.price) } : item
    ));
    setEditingMenuId(null);
    sendToast("Menu berhasil diperbarui");
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    sendToast("Menu berhasil dihapus");
  };

  const updateStockQty = (id, value) => {
    setStockItems(prev => prev.map(stock =>
      stock.id === id ? { ...stock, qty: Math.max(0, Number(value)) } : stock
    ));
  };

  const voidOrder = (index) => {
    setHistory(prev => prev.map((item, idx) =>
      idx === index ? { ...item, status: "Dibatalkan" } : item
    ));
    sendToast("Pesanan dibatalkan", "warning");
  };

  const printReceipt = (order) => {
    if (!order) return;
    const popup = window.open("", "_blank", "width=420,height=700");
    const itemsHtml = (order.orders || []).map(it => `
      <div style="display:flex;justify-content:space-between;font-family:monospace;margin-bottom:6px;">
        <div>${it.name}${it.size ? " (" + it.size + ")" : ""} x${it.qty}</div>
        <div>Rp ${it.price.toLocaleString()}</div>
      </div>`).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Struk</title>
      <style>
        body{font-family:Arial,sans-serif;padding:10px;color:#000}
        .paper{width:320px;margin:0 auto;border-top:2px dashed #333;border-bottom:2px dashed #333;padding:12px}
        .items{font-family:monospace;margin-top:12px}
        .total{display:flex;justify-content:space-between;font-weight:800;margin-top:12px;font-size:16px;padding-top:10px;border-top:1px dashed #333}
      </style>
      </head><body>
      <div class="paper">
        <h3 style="text-align:center;margin:0 0 4px;letter-spacing:2px">SEJUTA TAWA</h3>
        <p style="text-align:center;font-size:12px;color:#555;margin:0 0 12px">est. 2010</p>
        <div>Nama: ${order.customerName || "-"}</div>
        <div>Meja: ${order.customerTable || "-"}</div>
        <div>Tgl: ${order.date || ""}</div>
        <div>Pembayaran: ${order.paymentMethod || ""}</div>
        <div class="items">${itemsHtml}</div>
        <div style="margin-top:8px;font-size:12px;color:#555">Pajak: Rp ${order.tax?.toLocaleString() || 0}</div>
        <div style="font-size:12px;color:#555">Service: Rp ${order.service?.toLocaleString() || 0}</div>
        ${order.discount > 0 ? `<div style="font-size:12px;color:#dc2626">Diskon: -Rp ${order.discount?.toLocaleString() || 0}</div>` : ""}
        <div class="total"><div>TOTAL</div><div>Rp ${order.total?.toLocaleString() || 0}</div></div>
        <p style="text-align:center;font-size:11px;color:#777;margin-top:16px">Terima kasih telah berkunjung!</p>
      </div>
      <script>window.print();setTimeout(()=>window.close(),500);</script>
      </body></html>`;
    popup.document.write(html);
    popup.document.close();
  };

  const filteredMenu = menuItems.filter(item => {
    const categoryMatch = activeCategory === "All" ? true : item.category === activeCategory;
    const searchMatch   = item.name.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const addToCart = (item, size = null) => {
    if (item.status === "Habis") { sendToast("Menu ini sedang habis", "warning"); return; }
    const chosenSize = size || selectedSizes[item.name] || item.sizes?.[0];
    const newItem    = { id: item.id, name: item.name, size: chosenSize?.label || "", price: chosenSize?.price || item.price, qty: 1 };
    setCart(prev => [...prev, newItem]);
    sendToast(`${item.name} masuk keranjang`);
  };

  const openModifiers = (item) => {
    setModifierItem(item);
    setModifierState({ size: item.sizes ? item.sizes[0] : null, addOns: [], temp: "Dingin", sweetness: "Normal", notes: "" });
    setShowModifiers(true);
  };

  const closeModifiers = () => { setShowModifiers(false); setModifierItem(null); };

  const toggleTopping = (t) => {
    setModifierState(prev => {
      const has = prev.addOns.includes(t);
      return { ...prev, addOns: has ? prev.addOns.filter(x => x !== t) : [...prev.addOns, t] };
    });
  };

  const addCustomizedToCart = () => {
    if (!modifierItem) return;
    const chosenSize = modifierState.size;
    const price      = chosenSize?.price || modifierItem.price;
    const custom     = {
      id: modifierItem.id, name: modifierItem.name, size: chosenSize?.label || "", price, qty: 1,
      modifiers: {
        temp:      modifierItem.category === "Drinks" ? modifierState.temp      : undefined,
        sweetness: modifierItem.category === "Drinks" ? modifierState.sweetness : undefined,
        addOns:    modifierState.addOns,
        notes:     modifierState.notes,
      },
    };
    setCart(prev => [...prev, custom]);
    sendToast(`${modifierItem.name} (kustom) masuk`);
    closeModifiers();
  };

  const total    = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const subtotal = total;

  const handleCheckout = () => {
    if (cart.length === 0)                          { sendToast("Tambahkan menu dulu sebelum checkout", "warning"); return; }
    if (orderType === "Dine-In" && !customerTable)  { sendToast("Pilih meja terlebih dahulu", "warning"); return; }
    const discount   = calculatePromoDiscount(total, promoCode);
    const tax        = Math.round(total * taxRate);
    const service    = orderType === "Dine-In" ? Math.round(total * serviceRate) : 0;
    const finalTotal = Math.max(0, total + tax + service - discount);
    const orderData  = createOrderData({
      customerName, customerPhone, customerTable, paymentMethod,
      orderType, notes, subtotal, total: finalTotal, cart,
      promoCode: promoCode || "", discount, tax, service,
    });
    setHistory(prev => [orderData, ...prev]);
    updateStockAfterOrder(cart);
    setShowReceipt(true);
    setCart([]);
    setPromoCode("");
    setPromoDiscount(0);
    setNotes("");
  };

  const handleTambahMenu = () => {
    if (!menuForm.name || !menuForm.price) { sendToast("Nama dan harga wajib diisi", "warning"); return; }
    const newItem = {
      id: Date.now(), name: menuForm.name, category: menuForm.category,
      image: menuForm.image || "", price: Number(menuForm.price),
      sold: 0, status: "Tersedia", hasSizes: false,
    };
    setMenuItems(prev => [...prev, newItem]);
    setMenuForm({
      id: null, name: "", price: "", category: "Food", image: "",
      status: "Tersedia", hasSizes: false,
      sizes: [{ label: "S", price: 0 }, { label: "M", price: 0 }, { label: "L", price: 0 }],
    });
    sendToast("Menu baru berhasil ditambahkan!");
  };

  // ── DERIVED VALUES ────────────────────────────────────────────────────────
  const latestOrder  = history[0] || null;
  const totalRevenue = history.filter(o => o.status !== "Dibatalkan").reduce((acc, o) => acc + o.total, 0);
  const orderCount   = history.filter(o => o.status !== "Dibatalkan").length;

  // ── SHARED STYLES ─────────────────────────────────────────────────────────
  const inputStyle = {
    padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.goldLight}`,
    background: C.cream, color: C.charcoal, fontSize: 13, outline: "none", fontFamily: "inherit",
  };

  // ── LOADING SCREEN ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${C.crimsonDark} 0%, ${C.crimson} 60%, ${C.charcoal} 100%)`,
        color: C.cream, display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", height: "100vh", fontFamily: "Georgia, serif",
      }}>
        <div style={{
          width: 130, height: 130, borderRadius: "50%",
          border: `3px solid ${C.gold}`, padding: 4,
          boxShadow: `0 0 40px rgba(201,169,110,0.4)`,
          animation: "spin 3s linear infinite",
        }}>
          <img src={logo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <h1 style={{ letterSpacing: 6, marginTop: 24, fontWeight: 400, fontSize: 28, color: C.goldLight }}>SEJUTA TAWA</h1>
        <p style={{ color: C.mutedLight, letterSpacing: 2, fontSize: 12, marginTop: 4 }}>Memuat Tampilan Premium...</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div style={{
        background: `linear-gradient(145deg, ${C.crimsonDark} 0%, ${C.charcoal} 50%, ${C.crimson} 100%)`,
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", fontFamily: "Georgia, serif",
      }}>
        <div style={{
          background: C.cream, padding: 44, borderRadius: 20, width: 380, textAlign: "center",
          boxShadow: `0 20px 60px rgba(74,15,15,0.5)`, border: `1px solid ${C.goldLight}`,
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%", margin: "0 auto 16px",
            border: `3px solid ${C.gold}`, padding: 3,
            boxShadow: `0 4px 20px rgba(123,28,28,0.3)`,
          }}>
            <img src={logo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <h2 style={{ color: C.crimsonDark, margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            {isRegisterMode ? "Daftar Akun Baru" : "Sejuta Tawa POS"}
          </h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 28, letterSpacing: 0.3 }}>
            {isRegisterMode ? "Buat akun kasir baru" : "Silakan login untuk masuk sistem kasir"}
          </p>
          <input
            type="email" placeholder="Email Gmail" value={loginUsername}
            onChange={e => setLoginUsername(e.target.value)}
            style={{ ...inputStyle, width: "100%", marginBottom: 12, boxSizing: "border-box" }}
          />
          <input
            type="password" placeholder="Password" value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            style={{ ...inputStyle, width: "100%", marginBottom: 24, boxSizing: "border-box" }}
          />
          <button
            onClick={isRegisterMode ? handleRegister : handleLogin}
            style={{ ...btn.primary, width: "100%", padding: "13px 0", fontSize: 14, borderRadius: 10, letterSpacing: 1.5 }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >{isRegisterMode ? "✦ DAFTAR SEKARANG" : "✦ MASUK KE KASIR"}</button>
          <p
            style={{ marginTop: 18, color: C.crimson, fontSize: 12, cursor: "pointer", letterSpacing: 0.5 }}
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode ? "Sudah punya akun? Login di sini" : "Belum punya akun? Daftar di sini"}
          </p>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex", height: "100vh", background: C.parchment,
      fontFamily: "Georgia, 'Times New Roman', serif", overflow: "hidden",
    }}>
      <audio ref={audioRef} autoPlay loop src={music} />

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 248,
        background: `linear-gradient(180deg, ${C.crimsonDark} 0%, ${C.charcoal} 100%)`,
        color: C.mutedLight, display: "flex", flexDirection: "column",
        padding: 20, borderRight: `1px solid ${C.crimsonDark}`,
      }}>
        <div>
          {/* Logo & role */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 28, paddingBottom: 18,
            borderBottom: `1px solid rgba(201,169,110,0.2)`,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${C.gold}`, padding: 2, flexShrink: 0 }}>
              <img src={logo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div>
              <h4 style={{ color: C.goldLight, margin: 0, fontSize: 15, letterSpacing: 1 }}>Sejuta Tawa</h4>
              <small style={{ color: C.mutedLight, fontSize: 11 }}>{userRole}</small>
            </div>
          </div>

          {/* Music toggle */}
          <button
            onClick={toggleMusic}
            style={{
              width: "100%", padding: "9px 12px", marginBottom: 16,
              background: isMusicPlaying ? `rgba(201,169,110,0.15)` : `rgba(255,255,255,0.05)`,
              border: `1px solid ${isMusicPlaying ? C.gold : "rgba(255,255,255,0.1)"}`,
              borderRadius: 10, color: isMusicPlaying ? C.gold : C.mutedLight,
              cursor: "pointer", fontSize: 12, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8, letterSpacing: 0.5,
              transition: "all 0.2s ease", fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = isMusicPlaying ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.05)"}
          >
            <span style={{ fontSize: 16 }}>{isMusicPlaying ? "🎵" : "🔇"}</span>
            {isMusicPlaying ? "Musik: Aktif" : "Musik: Mati"}
          </button>

          {/* Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { icon: "🛒", label: "Kasir Utama",  action: () => { setAdminMode(false); setUserMenuSelection("Kasir Utama"); }, active: !adminMode && userMenuSelection === "Kasir Utama" },
              { icon: "🪑", label: "Daftar Meja",  action: () => { setAdminMode(false); setUserMenuSelection("Pilih Meja"); },  active: !adminMode && userMenuSelection === "Pilih Meja"  },
              { icon: "📊", label: "Panel Admin",  action: () => { setAdminMode(true); setAdminTab("Ringkasan"); },             active: adminMode },
            ].map(nav => (
              <button key={nav.label} onClick={nav.action} style={{
                width: "100%", padding: "11px 14px", textAlign: "left",
                background: nav.active
                  ? `linear-gradient(135deg, rgba(123,28,28,0.6) 0%, rgba(201,169,110,0.15) 100%)`
                  : "transparent",
                color: nav.active ? C.goldLight : C.mutedLight,
                border: nav.active ? `1px solid rgba(201,169,110,0.3)` : "1px solid transparent",
                borderRadius: 10, cursor: "pointer", fontWeight: nav.active ? "700" : "500",
                fontSize: 13, letterSpacing: 0.4, fontFamily: "inherit", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: 10,
              }}
                onMouseEnter={e => { if (!nav.active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!nav.active) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{nav.icon}</span>{nav.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { setLoggedIn(false); setUserRole(""); }}
          style={{ ...btn.danger, padding: "11px 0", fontSize: 13, marginTop: "auto", letterSpacing: 0.5, fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >✕ Keluar Sistem</button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {adminMode ? (
          /* ── ADMIN PANEL ── */
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, color: C.crimsonDark, fontSize: 20, letterSpacing: 0.5 }}>Dashboard Admin</h2>
                <small style={{ color: C.muted }}>{adminTab}</small>
              </div>
              <div style={{ display: "flex", gap: 6, background: C.creamDark, padding: 5, borderRadius: 12, border: `1px solid ${C.goldLight}` }}>
                {["Ringkasan", "Kelola Menu", "Kelola Meja", "Stok", "Transaksi"].map(t => (
                  <button key={t} onClick={() => setAdminTab(t)} style={{
                    padding: "7px 14px", border: "none", borderRadius: 8, cursor: "pointer",
                    fontWeight: "700", fontSize: 12, letterSpacing: 0.3, fontFamily: "inherit",
                    background: adminTab === t
                      ? `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})`
                      : "transparent",
                    color: adminTab === t ? C.white : C.muted,
                    boxShadow: adminTab === t ? `0 3px 10px rgba(123,28,28,0.3)` : "none",
                    transition: "all 0.2s ease",
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Ringkasan */}
            {adminTab === "Ringkasan" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 4 }}>
                  {[
                    { label: "Total Penjualan",     value: `Rp ${totalRevenue.toLocaleString()}`, icon: "💰" },
                    { label: "Total Transaksi",      value: orderCount, icon: "🧾" },
                    { label: "Meja Terisi",          value: `${tables.filter(t => t.status === "Terisi").length} / ${tables.length}`, icon: "🪑" },
                    { label: "Loyalty Point Kasir",  value: `${history.reduce((acc, o) => acc + Math.floor(o.total / 10000), 0)} Pts`, icon: "⭐" },
                  ].map(card => (
                    <div key={card.label} style={{
                      background: C.white, padding: 22, borderRadius: 14,
                      border: `1px solid ${C.goldLight}`,
                      boxShadow: `0 3px 12px rgba(123,28,28,0.06)`,
                      borderLeft: `4px solid ${C.crimson}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <small style={{ color: C.muted, fontSize: 11, letterSpacing: 0.5 }}>{card.label}</small>
                        <span style={{ fontSize: 20 }}>{card.icon}</span>
                      </div>
                      <h2 style={{ margin: "8px 0 0 0", color: C.crimsonDark, fontSize: 20 }}>{card.value}</h2>
                    </div>
                  ))}
                </div>
                <TopSellingChart menuItems={menuItems} history={history} />
              </div>
            )}

            {/* Kelola Menu */}
            {adminTab === "Kelola Menu" && (
              <div>
                <div style={{ background: C.white, borderRadius: 14, padding: 20, border: `1px solid ${C.goldLight}`, marginBottom: 20 }}>
                  {menuItems.map(item => (
                    <div key={item.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 0", borderBottom: `1px solid ${C.creamDark}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={item.image} alt="" style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover", border: `1px solid ${C.goldLight}` }} />
                        <strong style={{ color: C.charcoal, fontSize: 14 }}>{item.name}</strong>
                      </div>
                      <div style={{ color: C.muted, fontSize: 13 }}>Rp {item.price.toLocaleString()}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEditMenu(item)} style={{ ...btn.secondary, padding: "6px 14px", fontSize: 12, fontFamily: "inherit" }}>✏️ Edit</button>
                        <button onClick={() => deleteMenuItem(item.id)} style={{ ...btn.danger,    padding: "6px 14px", fontSize: 12, fontFamily: "inherit" }}>🗑 Hapus</button>
                      </div>
                    </div>
                  ))}
                  {editingMenuId && (
                    <div style={{ marginTop: 20, padding: 16, background: C.cream, borderRadius: 10, border: `1px solid ${C.goldLight}` }}>
                      <h4 style={{ color: C.crimsonDark, marginTop: 0 }}>Edit Harga Menu</h4>
                      <input
                        type="number" value={menuForm.price}
                        onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                        style={{ ...inputStyle, marginRight: 8 }}
                      />
                      <button onClick={saveMenuUpdate} style={{ ...btn.success, padding: "9px 18px", fontSize: 13, fontFamily: "inherit" }}>✓ Simpan</button>
                    </div>
                  )}
                </div>

                {/* Tambah menu baru */}
                <div style={{
                  background: C.white, borderRadius: 14, padding: 22,
                  border: `2px dashed ${C.crimson}`,
                  boxShadow: `0 4px 16px rgba(123,28,28,0.06)`,
                }}>
                  <h4 style={{ marginTop: 0, color: C.crimson, letterSpacing: 0.5 }}>➕ Tambah Menu Baru</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <input type="text"   placeholder="Nama Menu"              value={menuForm.name}     onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}     style={inputStyle} />
                    <input type="number" placeholder="Harga (contoh: 25000)"  value={menuForm.price}    onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}    style={inputStyle} />
                    <select value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} style={{ ...inputStyle, background: C.cream }}>
                      <option>Food</option><option>Drinks</option><option>Snack</option><option>Dessert</option>
                    </select>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <input
                        type="file" accept="image/*"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => setMenuForm({ ...menuForm, image: ev.target.result });
                          reader.readAsDataURL(file);
                        }}
                        style={{ ...inputStyle, cursor: "pointer", fontSize: 12 }}
                      />
                      {menuForm.image && (
                        <img src={menuForm.image} alt="preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: `1px solid ${C.goldLight}` }} />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleTambahMenu}
                    style={{ ...btn.primary, padding: "10px 26px", fontSize: 13, letterSpacing: 0.5, fontFamily: "inherit" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >✅ Simpan Menu Baru</button>
                </div>
              </div>
            )}

            {/* Kelola Meja */}
            {adminTab === "Kelola Meja" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                {tables.map(t => (
                  <button key={t.name} onClick={() => toggleTableStatus(t.name)} style={{
                    padding: 20, borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                    border:      `1.5px solid ${t.status === "Terisi" ? "#FCA5A5" : C.goldLight}`,
                    background:  t.status === "Terisi" ? "linear-gradient(135deg, #FEE2E2, #FECACA)" : `linear-gradient(135deg, ${C.greenLight}, #A7F3D0)`,
                    color:       t.status === "Terisi" ? C.red : C.green,
                    fontWeight: "700", fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {t.name}<br /><small style={{ fontWeight: 400 }}>{t.status}</small>
                  </button>
                ))}
              </div>
            )}

            {/* Stok */}
            {adminTab === "Stok" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {stockItems.map(s => (
                  <div key={s.id} style={{
                    background: C.white, padding: 18, borderRadius: 12,
                    border:     `1px solid ${C.goldLight}`,
                    borderLeft: `4px solid ${s.qty <= s.threshold ? C.red : C.crimson}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                    <h4 style={{ color: C.charcoal, margin: "0 0 10px 0" }}>{s.label}</h4>
                    <input
                      type="number" value={s.qty}
                      onChange={e => updateStockQty(s.id, e.target.value)}
                      style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    />
                    {s.qty <= s.threshold && (
                      <small style={{ color: C.red, marginTop: 4, display: "block" }}>⚠ Stok hampir habis</small>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Transaksi */}
            {adminTab === "Transaksi" && (
              <div style={{ background: C.white, padding: 16, borderRadius: 14, border: `1px solid ${C.goldLight}` }}>
                {history.length === 0 && (
                  <p style={{ color: C.muted, textAlign: "center", padding: 20 }}>Belum ada transaksi</p>
                )}
                {history.map((h, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "13px 0", borderBottom: `1px solid ${C.creamDark}`,
                  }}>
                    <div>
                      <strong style={{ color: C.charcoal }}>{h.customerName} (Meja {h.customerTable || "-"})</strong>
                      <br /><small style={{ color: C.muted }}>{h.date} • {h.paymentMethod}</small>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: h.status === "Dibatalkan" ? C.red : C.crimsonDark }}>
                        Rp {h.total.toLocaleString()}
                      </strong>
                      <br />
                      <button
                        onClick={() => voidOrder(i)}
                        style={{ fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                      >Void</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        ) : userMenuSelection === "Pilih Meja" ? (
          /* ── TABLE SELECTION ── */
          <div>
            <h2 style={{ marginBottom: 6, color: C.crimsonDark, letterSpacing: 0.5 }}>Manajemen Meja Kafe</h2>
            <p style={{ color: C.muted, marginBottom: 22, fontSize: 13 }}>Pilih meja aktif pelanggan untuk pesanan Dine-In.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {tables.map(table => (
                <button key={table.name}
                  onClick={() => {
                    if (table.status === "Kosong") {
                      setCustomerTable(table.name);
                      setUserMenuSelection("Kasir Utama");
                      sendToast(`Meja ${table.name} dipilih`);
                    } else {
                      sendToast("Meja ini sedang terisi", "warning");
                    }
                  }}
                  style={{
                    padding: 24, borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
                    border: customerTable === table.name
                      ? `2px solid ${C.crimson}`
                      : table.status === "Terisi"
                        ? `1.5px solid #FCA5A5`
                        : `1.5px solid ${C.goldLight}`,
                    background: customerTable === table.name
                      ? `linear-gradient(135deg, rgba(123,28,28,0.08), rgba(201,169,110,0.12))`
                      : table.status === "Terisi" ? "#FEE2E2" : C.white,
                    color: table.status === "Terisi" ? C.red : C.charcoal,
                    fontWeight: "700", textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { if (table.status !== "Terisi") e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span style={{ fontSize: 22 }}>🪑 {table.name}</span>
                  <div style={{ marginTop: 8, fontSize: 12, color: table.status === "Terisi" ? C.red : C.green }}>
                    {table.status === "Terisi" ? "Terisi Pelanggan" : "Kosong / Siap"}
                  </div>
                </button>
              ))}
            </div>
          </div>

        ) : (
          /* ── KASIR UTAMA ── */
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, color: C.crimsonDark, fontSize: 20, letterSpacing: 0.5 }}>Daftar Menu Kasir</h2>
                <small style={{ color: C.muted }}>Pilih produk untuk ditambahkan ke struk belanja</small>
              </div>
              <input
                type="text" placeholder="🔍 Cari menu makanan/minuman..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, width: 270 }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: `2px solid ${C.goldLight}`, paddingBottom: 14 }}>
              {["All", "Food", "Drinks", "Snack", "Dessert"].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "8px 20px", border: "none", borderRadius: 20, cursor: "pointer",
                  fontWeight: "700", fontSize: 12, letterSpacing: 0.5, fontFamily: "inherit",
                  background: activeCategory === cat
                    ? `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})`
                    : C.white,
                  color: activeCategory === cat ? C.white : C.muted,
                  boxShadow: activeCategory === cat
                    ? `0 4px 12px rgba(123,28,28,0.3)`
                    : `0 1px 4px rgba(0,0,0,0.06)`,
                  border: activeCategory === cat ? "none" : `1px solid ${C.goldLight}`,
                  transition: "all 0.2s ease",
                  transform: activeCategory === cat ? "translateY(-1px)" : "translateY(0)",
                }}>{cat}</button>
              ))}
            </div>

            {/* Menu Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(196px, 1fr))", gap: 16 }}>
              {filteredMenu.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: C.white, borderRadius: 14, border: `1px solid ${C.goldLight}`,
                    overflow: "hidden", display: "flex", flexDirection: "column",
                    boxShadow: "0 2px 10px rgba(123,28,28,0.06)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(123,28,28,0.14)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = "0 2px 10px rgba(123,28,28,0.06)"; }}
                >
                  <div style={{ position: "relative" }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                    <span style={{
                      position: "absolute", top: 8, left: 8,
                      background: `rgba(74,15,15,0.85)`, color: C.goldLight,
                      padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    }}>{item.category}</span>
                  </div>
                  <div style={{ padding: 13, display: "flex", flexDirection: "column", flex: 1 }}>
                    <h5 style={{ margin: "0 0 6px 0", fontSize: 14, color: C.charcoal, height: 36, overflow: "hidden", lineHeight: 1.3 }}>{item.name}</h5>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "700", color: C.crimson, fontSize: 14 }}>Rp {currency(item.price)}</p>
                    {item.hasSizes && (
                      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                        {item.sizes.map(sz => (
                          <button key={sz.label} onClick={() => handleSizeSelect(item, sz)} style={{
                            flex: 1, padding: "4px 0", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                            border: `1.5px solid ${selectedSizes[item.name]?.label === sz.label ? C.crimson : C.goldLight}`,
                            borderRadius: 6,
                            background: selectedSizes[item.name]?.label === sz.label
                              ? `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})`
                              : C.cream,
                            color: selectedSizes[item.name]?.label === sz.label ? C.white : C.charcoal,
                            fontWeight: 600, transition: "all 0.15s ease",
                          }}>{sz.label}</button>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          flex: 1, padding: "8px 0", fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                          background: `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})`,
                          color: C.white, border: "none", borderRadius: 8, fontWeight: "700", letterSpacing: 0.3,
                          boxShadow: `0 3px 10px rgba(123,28,28,0.28)`, transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >+ Tambah</button>
                      <button
                        onClick={() => openModifiers(item)}
                        style={{
                          padding: "8px 10px", background: C.cream, color: C.muted,
                          border: `1px solid ${C.goldLight}`, borderRadius: 8, cursor: "pointer",
                          fontSize: 12, fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.creamDark; e.currentTarget.style.color = C.crimson; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.cream;     e.currentTarget.style.color = C.muted; }}
                      >Custom</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── CART SIDEBAR ── */}
      {!adminMode && (
        <div
  style={{
    width: "100%",
    maxWidth: 368,
    background: C.white,
    borderLeft: `1px solid ${C.goldLight}`,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  }}
>
          <div style={{ padding: 20, borderBottom: `1px solid ${C.creamDark}`, background: C.cream }}>
            <h3 style={{ margin: 0, color: C.crimsonDark, letterSpacing: 0.5 }}>Struk Pesanan Aktif</h3>
            {customerTable ? (
              <span style={{ fontSize: 11, background: C.greenLight, color: C.green, padding: "3px 10px", borderRadius: 12, fontWeight: "700", display: "inline-block", marginTop: 6, letterSpacing: 0.3 }}>🪑 Meja: {customerTable}</span>
            ) : (
              <span style={{ fontSize: 11, background: "#FEE2E2", color: C.red, padding: "3px 10px", borderRadius: 12, fontWeight: "700", display: "inline-block", marginTop: 6 }}>⚠️ Belum Pilih Meja</span>
            )}
          </div>

          {/* Customer form */}
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, background: C.parchment, borderBottom: `1px solid ${C.creamDark}` }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="text" placeholder="Nama Pelanggan" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
              <input type="text" placeholder="No Meja"        value={customerTable} onChange={e => setCustomerTable(e.target.value)} style={{ ...inputStyle, width: 70, fontSize: 12, textAlign: "center" }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <select value={orderType}      onChange={e => setOrderType(e.target.value)}      style={{ ...inputStyle, flex: 1, fontSize: 12 }}>
                <option>Dine-In</option><option>Takeaway</option>
              </select>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 12 }}>
                <option>Tunai</option><option>QRIS</option><option>Dompet Digital</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="text" placeholder="Kode Promo (KAFE10)" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
              <button onClick={applyPromoCode} style={{ ...btn.primary, padding: "0 14px", fontSize: 12, fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >Klaim</button>
            </div>
          </div>

          {/* Cart items */}
          <div style={{ flex: 1, padding: "16px 18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", color: C.mutedLight, marginTop: 40 }}>
                <span style={{ fontSize: 44 }}>🛒</span>
                <p style={{ fontSize: 13, marginTop: 10, color: C.muted }}>Keranjang kasir kosong.<br />Silakan klik menu di kiri.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "start",
                  paddingBottom: 10, borderBottom: `1px solid ${C.creamDark}`, fontSize: 13,
                }}>
                  <div>
                    <span style={{ fontWeight: "700", color: C.charcoal }}>{item.name} {item.size ? `(${item.size})` : ""}</span>
                    <span style={{ color: C.muted, marginLeft: 6 }}>x{item.qty}</span>
                    {item.modifiers && (
                      <div style={{ fontSize: 11, color: C.mutedLight, marginTop: 2 }}>
                        {item.modifiers.temp} • {item.modifiers.sweetness}
                        {item.modifiers.addOns?.length ? ` • +${item.modifiers.addOns.join(", ")}` : ""}
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: "700", color: C.crimson }}>Rp {currency(item.price * item.qty)}</span>
                </div>
              ))
            )}
          </div>

          {/* Totals & checkout */}
          <div style={{ padding: 18, background: C.cream, borderTop: `1px solid ${C.goldLight}` }}>
            {[
              { label: "Subtotal",                                                      value: currency(subtotal) },
              { label: "Pajak (11%)",                                                   value: currency(Math.round(subtotal * taxRate)) },
              { label: `Service Fee (${orderType === "Dine-In" ? "5%" : "0%"})`,        value: currency(orderType === "Dine-In" ? Math.round(subtotal * serviceRate) : 0) },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 5 }}>
                <span>{row.label}</span><span>Rp {row.value}</span>
              </div>
            ))}
            {promoDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.red, marginBottom: 5 }}>
                <span>Potongan Diskon</span><span>- Rp {currency(promoDiscount)}</span>
              </div>
            )}
            <div style={{
              display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: "700", color: C.charcoal,
              marginTop: 10, paddingTop: 10, borderTop: `1.5px dashed ${C.goldLight}`,
            }}>
              <span>Total Akhir</span>
              <span style={{ color: C.crimson, fontSize: 18 }}>
                Rp {currency(Math.max(0,
                  subtotal
                  + Math.round(subtotal * taxRate)
                  + (orderType === "Dine-In" ? Math.round(subtotal * serviceRate) : 0)
                  - promoDiscount
                ))}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              style={{ ...btn.primary, width: "100%", padding: 14, fontSize: 14, marginTop: 14, letterSpacing: 0.8, fontFamily: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 20px rgba(123,28,28,0.45)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = `0 4px 14px rgba(123,28,28,0.35)`; }}
            >🚀 CETAK STRUK & BAYAR</button>
          </div>
        </div>
      )}

      {/* ── MODIFIER MODAL ── */}
      {showModifiers && modifierItem && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(44,24,16,0.6)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999,
        }}>
          <div style={{
            background: C.cream, padding: 28, borderRadius: 18, width: 350,
            boxShadow: `0 20px 50px rgba(74,15,15,0.35)`, border: `1px solid ${C.goldLight}`,
          }}>
            <h3 style={{ margin: "0 0 18px 0", color: C.crimsonDark, fontSize: 16, letterSpacing: 0.5 }}>✦ Kustom {modifierItem.name}</h3>

            {modifierItem.category === "Drinks" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: "700", color: C.muted, letterSpacing: 0.5 }}>SUHU MINUMAN</label>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {temperatureOptions.map(t => (
                    <button key={t} onClick={() => setModifierState(p => ({ ...p, temp: t }))} style={{
                      flex: 1, padding: 9,
                      border:     `1.5px solid ${modifierState.temp === t ? C.crimson : C.goldLight}`,
                      borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                      background:  modifierState.temp === t ? `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})` : C.white,
                      color:       modifierState.temp === t ? C.white : C.charcoal,
                      fontWeight: "600", transition: "all 0.15s ease",
                    }}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: "700", color: C.muted, letterSpacing: 0.5 }}>TAMBAHAN PILIHAN</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                {(modifierItem.category === "Drinks" ? drinkAddOns : foodAddOns).map(o => (
                  <button key={o} onClick={() => toggleTopping(o)} style={{
                    padding: 9,
                    border:      `1.5px solid ${modifierState.addOns.includes(o) ? C.crimson : C.goldLight}`,
                    borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                    background:  modifierState.addOns.includes(o) ? `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})` : C.white,
                    color:       modifierState.addOns.includes(o) ? C.white : C.charcoal,
                    fontWeight: "600", transition: "all 0.15s ease",
                  }}>{o}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <button
                onClick={addCustomizedToCart}
                style={{ ...btn.primary, flex: 1, padding: 11, fontSize: 13, fontFamily: "inherit", letterSpacing: 0.3 }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >✓ Simpan</button>
              <button onClick={closeModifiers} style={{ ...btn.ghost, padding: "11px 18px", fontFamily: "inherit", fontSize: 13 }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DIGITAL RECEIPT MODAL ── */}
      {showReceipt && latestOrder && (
        <DigitalReceiptModal
          order={latestOrder}
          onPrintPhysical={() => { printReceipt(latestOrder); setShowReceipt(false); }}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          padding: "12px 26px", borderRadius: 10,
          background: toast.type === "warning"
            ? `linear-gradient(135deg, #DC2626, #991B1B)`
            : `linear-gradient(135deg, ${C.crimsonDark}, ${C.charcoal})`,
          color: C.goldLight, fontWeight: "700", zIndex: 1000,
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)", fontSize: 13, letterSpacing: 0.4,
          border: `1px solid rgba(201,169,110,0.3)`, whiteSpace: "nowrap",
        }}>{toast.message}</div>
      )}
    </div>
  );
}

export default App;