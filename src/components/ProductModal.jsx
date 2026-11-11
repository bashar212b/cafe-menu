import React from 'react';
import { X } from "lucide-react";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="icon-button modal-close" onClick={onClose} aria-label="إغلاق"><X /></button>
        <div className="modal-photo">{product.image ? <img src={product.image} alt={product.name} /> : "☕"}</div>
        <div className="modal-copy"><span className="eyebrow">MADE WITH CARE</span><h2>{product.name}</h2><p>{product.description}</p><strong>{Number(product.price).toLocaleString("en-US")}</strong></div>
      </section>
    </div>
  );
}