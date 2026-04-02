import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const supportedImage = (url) => {
    if (!url) return '';
    return url.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp');
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={supportedImage(product.image) || product.image}
        alt={product.name}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = product.image;
        }}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-700 font-bold">Rs {product.price.toLocaleString()}</span>
          <button onClick={() => addToCart(product)} className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">Add</button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;