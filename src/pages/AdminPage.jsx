import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getMenuData, saveProduct, removeProduct, saveCategory, removeCategory } from "../services/menuService";
import { LogOut, Plus, Pencil, Trash2, Coffee, Package, Tags, QrCode, ExternalLink } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const blankProduct = { name: "", description: "", price: "", categoryId: "", image: "", available: true, featured: false };
const blankCategory = { name: "", icon: "☕", order: 1 };

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState(blankProduct);
  const [categoryForm, setCategoryForm] = useState(blankCategory);
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [tab, setTab] = useState("products");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [showQr, setShowQr] = useState(false);
  const publicUrl = window.location.origin + "/";

  async function refresh() {
    const data = await getMenuData();
    setProducts(data.products);
    setCategories(data.categories);
  }
  useEffect(() => { refresh().catch(() => setNotice("تعذر تحميل البيانات. تحقق من إعدادات Firebase وقواعد Firestore.")); }, []);

  async function submitProduct(e) {
    e.preventDefault();
    if (!productForm.categoryId) return setNotice("اختر تصنيفاً للمنتج.");
    setBusy(true); setNotice("");
    try {
      await saveProduct(productForm, editingId);
      setProductForm({ ...blankProduct, categoryId: categories[0]?.id || "" });
      setEditingId(null); await refresh(); setNotice("تم حفظ المنتج بنجاح.");
    } catch (err) { console.error(err); setNotice("لم يتم الحفظ. تحقق من اتصال Firebase وقواعد الأمان."); }
    finally { setBusy(false); }
  }

  function editProduct(p) {
    setProductForm({ name: p.name || "", description: p.description || "", price: p.price ?? "", categoryId: p.categoryId || "", image: p.image || "", available: p.available !== false, featured: Boolean(p.featured) });
    setEditingId(p.id); setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    if (!window.confirm("هل تريد حذف هذا المنتج نهائياً؟")) return;
    try { await removeProduct(id); await refresh(); setNotice("تم حذف المنتج."); }
    catch { setNotice("تعذر حذف المنتج."); }
  }

  async function submitCategory(e) {
    e.preventDefault(); setBusy(true);
    try {
      await saveCategory(categoryForm, editingCategoryId);
      setCategoryForm(blankCategory); setEditingCategoryId(null); await refresh(); setNotice("تم حفظ التصنيف.");
    } catch { setNotice("تعذر حفظ التصنيف."); }
    finally { setBusy(false); }
  }

  async function deleteCategory(id) {
    if (products.some(p => p.categoryId === id)) return setNotice("لا يمكن حذف تصنيف يحتوي منتجات. انقل المنتجات أولاً.");
    if (!window.confirm("حذف التصنيف؟")) return;
    try { await removeCategory(id); await refresh(); setNotice("تم حذف التصنيف."); }
    catch { setNotice("تعذر حذف التصنيف."); }
  }

  return <main className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/"><span className="brand-mark"><Coffee /></span> NOIR <i>ADMIN</i></a>
      <div className="admin-nav"><button className={tab === "products" ? "selected" : ""} onClick={() => setTab("products")}><Package size={18} /> المنتجات</button><button className={tab === "categories" ? "selected" : ""} onClick={() => setTab("categories")}><Tags size={18} /> التصنيفات</button></div>
      <div className="sidebar-bottom"><span>{user?.email}</span><button onClick={() => signOut(auth)}><LogOut size={17} /> تسجيل الخروج</button></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><span className="eyebrow">WORKSPACE / MENU</span><h1>إدارة القائمة</h1></div><div className="top-actions"><a className="outline-button" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> عرض المنيو</a><button className="primary-button compact" onClick={() => setShowQr(!showQr)}><QrCode size={17} /> QR Code</button></div></header>
      {showQr && <div className="qr-panel"><div><h3>رمز الوصول إلى المنيو</h3><p>اطبع هذا الرمز وضعه على طاولات الكافيه.</p><small>{publicUrl}</small></div><QRCodeCanvas value={publicUrl} size={128} level="H" includeMargin /></div>}
      {notice && <div className="notice">{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {tab === "products" ? <div className="admin-content">
        <section className="admin-form-card"><div className="card-heading"><div><span className="eyebrow">{editingId ? "UPDATE ITEM" : "NEW ITEM"}</span><h2>{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</h2></div><span className="form-icon"><Plus /></span></div>
          <form className="admin-form" onSubmit={submitProduct}>
            <label>اسم المنتج<input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required placeholder="مثلاً: سبانيش لاتيه" /></label>
            <label>التصنيف<select value={productForm.categoryId} onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })} required><option value="">اختر التصنيف</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label>السعر<input type="number" min="0" step="1" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required placeholder="25000" /></label>
            <label>رابط الصورة <span className="optional">(اختياري)</span><input type="url" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." /></label>
            <label className="full-field">الوصف<textarea rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="وصف قصير للمنتج..." /></label>
            <div className="toggle-row"><label><input type="checkbox" checked={productForm.available} onChange={e => setProductForm({ ...productForm, available: e.target.checked })} /> متاح للعرض</label><label><input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({ ...productForm, featured: e.target.checked })} /> اختيارنا</label></div>
            <div className="form-buttons"><button className="primary-button" disabled={busy || !categories.length}>{busy ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}</button>{editingId && <button type="button" className="outline-button" onClick={() => { setEditingId(null); setProductForm(blankProduct); }}>إلغاء</button>}</div>
          </form>
          {!categories.length && <p className="form-hint">أضف تصنيفاً أولاً من تبويب التصنيفات قبل إضافة المنتجات.</p>}
        </section>
        <section className="admin-list-card"><div className="list-heading"><div><span className="eyebrow">YOUR MENU</span><h2>المنتجات <small>{products.length}</small></h2></div></div>
          <div className="admin-product-list">{products.map(p => <div className="admin-product" key={p.id}><div className="mini-product-image">{p.image ? <img src={p.image} alt="" /> : "☕"}</div><div className="admin-product-text"><strong>{p.name}</strong><span>{categories.find(c => c.id === p.categoryId)?.name || "بدون تصنيف"} · {Number(p.price).toLocaleString("en-US")}</span></div><span className={p.available === false ? "status off" : "status"}>{p.available === false ? "مخفي" : "ظاهر"}</span><button className="icon-button" onClick={() => editProduct(p)} aria-label="تعديل"><Pencil size={17} /></button><button className="icon-button danger" onClick={() => deleteProduct(p.id)} aria-label="حذف"><Trash2 size={17} /></button></div>)}
          {!products.length && <p className="empty-state">لا توجد منتجات بعد. أضف أول منتج من النموذج.</p>}</div>
        </section>
      </div> : <div className="category-admin">
        <section className="admin-form-card"><div className="card-heading"><div><span className="eyebrow">MENU GROUPS</span><h2>{editingCategoryId ? "تعديل التصنيف" : "إضافة تصنيف"}</h2></div><span className="form-icon"><Tags /></span></div>
          <form className="admin-form one-column" onSubmit={submitCategory}><label>اسم التصنيف<input value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required placeholder="المشروبات الساخنة" /></label><label>رمز تعبيري<input value={categoryForm.icon} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })} /></label><label>ترتيب الظهور<input type="number" value={categoryForm.order} onChange={e => setCategoryForm({ ...categoryForm, order: e.target.value })} /></label><div className="form-buttons"><button className="primary-button" disabled={busy}>{editingCategoryId ? "حفظ" : "إضافة التصنيف"}</button>{editingCategoryId && <button type="button" className="outline-button" onClick={() => { setEditingCategoryId(null); setCategoryForm(blankCategory); }}>إلغاء</button>}</div></form>
        </section>
        <section className="admin-list-card"><h2>التصنيفات</h2>{categories.map(c => <div className="admin-product" key={c.id}><span className="category-emoji">{c.icon}</span><div className="admin-product-text"><strong>{c.name}</strong><span>ترتيب الظهور: {c.order}</span></div><button className="icon-button" onClick={() => { setCategoryForm({ name: c.name, icon: c.icon || "☕", order: c.order || 1 }); setEditingCategoryId(c.id); }}><Pencil size={17} /></button><button className="icon-button danger" onClick={() => deleteCategory(c.id)}><Trash2 size={17} /></button></div>)}</section>
      </div>}
    </section>
  </main>;
}