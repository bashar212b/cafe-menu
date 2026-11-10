import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// أسماء المجموعات (Collections) داخل قاعدة Firestore.
const productsRef = collection(db, "products");
const categoriesRef = collection(db, "categories");

export async function getMenuData() {
  // نجلب المنتجات والتصنيفات بالتوازي لتقليل وقت الانتظار.
  const [productsSnap, categoriesSnap] = await Promise.all([
    getDocs(query(productsRef, orderBy("createdAt", "desc"))),
    getDocs(query(categoriesRef, orderBy("order", "asc")))
  ]);
  return {
    products: productsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    categories: categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  };
}

export async function saveProduct(product, id) {
  const clean = {
    name: product.name.trim(),
    description: product.description.trim(),
    price: Number(product.price),
    categoryId: product.categoryId,
    image: product.image.trim(),
    available: Boolean(product.available),
    featured: Boolean(product.featured),
    updatedAt: serverTimestamp()
  };
  if (id) return updateDoc(doc(db, "products", id), clean);
  return addDoc(productsRef, { ...clean, createdAt: serverTimestamp() });
}

export async function removeProduct(id) {
  return deleteDoc(doc(db, "products", id));
}

export async function saveCategory(category, id) {
  const clean = { name: category.name.trim(), icon: category.icon.trim() || "☕", order: Number(category.order) || 0 };
  if (id) return updateDoc(doc(db, "categories", id), clean);
  return addDoc(categoriesRef, { ...clean, createdAt: serverTimestamp() });
}

export async function removeCategory(id) {
  return deleteDoc(doc(db, "categories", id));
}