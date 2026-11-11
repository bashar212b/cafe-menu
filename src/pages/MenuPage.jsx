import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Search, Sparkles } from "lucide-react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { getMenuData } from "../services/menuService";
import { demoCategories, demoProducts } from "../data/menu";

export default function MenuPage() {
  const [categories, setCategories] = useState(demoCategories);
  const [products, setProducts] = useState(demoProducts);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cafeName] = useState("NOIR Café");

  useEffect(() => {
    // عند نجاح الاتصال نستبدل البيانات التجريبية ببيانات Firestore.
    getMenuData()
      .then(data => {
        if (data.categories.length) setCategories(data.categories);
        if (data.products.length) setProducts(data.products);
      })
      .catch(error => console.error("تعذر تحميل المنيو من Firebase:", error))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = useMemo(() => products.filter(p =>
    p.available !== false &&
    (activeCategory === "all" || p.categoryId === activeCategory) &&
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  ), [products, activeCategory, search]);

  return (
    <main>
      <Header cafeName={cafeName} />
      <section className="hero">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={14} /> YOUR DAILY PAUSE</span>
          <h1>لحظتك<br /><em>تستحق الأفضل.</em></h1>
          <p>قهوة تُحضّر بحب، وتفاصيل صغيرة تصنع فرقاً كبيراً.</p>
          <a href="#menu" className="hero-cta">اكتشف قائمتنا <ArrowDown size={16} /></a>
        </div>
        <div className="hero-side-note">EST. 2026 · DAMASCUS</div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading"><div><span className="eyebrow">EXPLORE OUR MENU</span><h2>قائمتنا</h2></div><span className="item-count">{visibleProducts.length} أصناف</span></div>
        <div className="menu-tools">
          <div className="category-tabs">
            <button className={activeCategory === "all" ? "active" : ""} onClick={() => setActiveCategory("all")}>الكل</button>
            {categories.map(c => <button key={c.id} className={activeCategory === c.id ? "active" : ""} onClick={() => setActiveCategory(c.id)}>{c.icon} {c.name}</button>)}
          </div>
          <label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن صنف..." /></label>
        </div>
        {loading && <p className="loading-note">نجهّز قائمتك...</p>}
        <div className="products-grid">
          {visibleProducts.map(product => <ProductCard key={product.id} product={product} onOpen={setSelected} />)}
        </div>
        {!visibleProducts.length && <div className="empty-state">لا توجد أصناف مطابقة حالياً.</div>}
      </section>
      <footer className="site-footer"><span>NOIR <i>CAFÉ</i></span><p>صُنعت هذه اللحظة لتستمتع بها.</p><small>© 2026 · ALL RIGHTS RESERVED</small></footer>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </main>
  );
}