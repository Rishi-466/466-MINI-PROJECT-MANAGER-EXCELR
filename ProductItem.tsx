
import React from 'react';
import { Product } from '../types';
import { EditIcon, TrashIcon } from './icons/Icons';

interface ProductItemProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{product.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 h-10 overflow-hidden">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">${product.price.toFixed(2)}</p>
          <div className="flex space-x-2">
            <button onClick={onEdit} className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <EditIcon className="h-5 w-5" />
            </button>
            <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
