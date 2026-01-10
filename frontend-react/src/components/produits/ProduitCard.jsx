import React from 'react';
import { Edit, Trash2, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProduitCard = ({ produit, onEdit, onDelete }) => {
    const { isAdmin } = useAuth();

    const getStockColor = (stock) => {
        if (stock > 20) return 'bg-green-100 text-green-800';
        if (stock > 10) return 'bg-yellow-100 text-yellow-800';
        if (stock > 0) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="card group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-primary-600 transition">
                        {produit.nom}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {produit.description}
                    </p>
                </div>
                <div className="bg-primary-50 p-2 rounded-lg ml-3">
                    <Package className="text-primary-600" size={20} />
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold text-primary-600">
          {produit.prix}
            <span className="text-lg text-gray-500 ml-1">MAD</span>
        </span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStockColor(produit.stock)}`}>
          Stock: {produit.stock}
        </span>
            </div>

            {isAdmin() && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onEdit(produit)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition duration-200"
                    >
                        <Edit size={16} className="mr-1" />
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(produit.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-red-600 transition duration-200"
                    >
                        <Trash2 size={16} className="mr-1" />
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProduitCard;