import React from 'react';
import { Plus } from "lucide-react";

export default function ProductCard({ product, onOpen }) {
  return (
    <button className="product-card" onClick={() => onOpen(product)} type="button">
      <div className="product-image">
        {product.image
          ? <img src={product.image} alt={product.name} loading="lazy" />
          : <span className="image-placeholder">☕</span>}
        {product.featured && <span className="featured-tag">اختيارنا</span>}
        <span className="quick-add"><Plus size={17} /></span>
      </div>
      <div className="product-info">
        <div className="product-title-row"><h3>{product.name}</h3><strong>{Number(product.price).toLocaleString("en-US")}</strong></div>
        <p>{product.description}</p>
      </div>
    </button>
  );
}