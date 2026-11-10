// بيانات تجريبية تظهر إذا لم تُضف منتجات إلى Firestore بعد.
export const demoCategories = [
  { id: "coffee", name: "القهوة الساخنة", icon: "☕", order: 1 },
  { id: "cold", name: "المشروبات الباردة", icon: "🧊", order: 2 },
  { id: "dessert", name: "الحلويات", icon: "🍰", order: 3 },
];

export const demoProducts = [
  { id: "p1", name: "سبانيش لاتيه", description: "إسبريسو، حليب، ولمسة من الحلاوة", price: 25000, categoryId: "coffee", image: "", available: true, featured: true },
  { id: "p2", name: "كابتشينو", description: "إسبريسو مع رغوة حليب ناعمة", price: 20000, categoryId: "coffee", image: "", available: true, featured: false },
  { id: "p3", name: "آيس أمريكانو", description: "إسبريسو وماء بارد مع مكعبات الثلج", price: 18000, categoryId: "cold", image: "", available: true, featured: false },
  { id: "p4", name: "تشيز كيك", description: "قطعة كريمية بطبقة بسكويت مقرمشة", price: 30000, categoryId: "dessert", image: "", available: true, featured: true }
];