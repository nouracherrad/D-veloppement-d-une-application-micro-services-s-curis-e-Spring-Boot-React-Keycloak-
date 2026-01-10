import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Panier = ({ items, onUpdateQuantity, onRemove, onValidate, onCancel }) => {
    const total = items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

    if (items.length === 0) {
        return (
            <div className="card text-center py-12">
                <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-500 text-lg">Votre panier est vide</p>
                <p className="text-gray-400 text-sm mt-2">Ajoutez des produits pour créer une commande</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <ShoppingBag className="mr-2 text-primary-600" size={24} />
                    Panier ({items.length} article{items.length > 1 ? 's' : ''})
                </h3>
            </div>

            <div className="space-y-3 mb-6">
                {items.map((item) => (
                    <div key={item.idProduit} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.nom}</h4>
                            <p className="text-sm text-gray-600">{item.prix.toFixed(2)} MAD / unité</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Contrôles de quantité */}
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => onUpdateQuantity(item.idProduit, item.quantite - 1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition rounded-l-lg"
                                    disabled={item.quantite <= 1}
                                >
                                    <Minus size={16} className={item.quantite <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                                </button>
                                <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">
                  {item.quantite}
                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.idProduit, item.quantite + 1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition rounded-r-lg"
                                >
                                    <Plus size={16} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Prix total de la ligne */}
                            <div className="min-w-[100px] text-right">
                                <p className="font-bold text-primary-600 text-lg">
                                    {(item.prix * item.quantite).toFixed(2)} MAD
                                </p>
                            </div>

                            {/* Bouton supprimer */}
                            <button
                                onClick={() => onRemove(item.idProduit)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Supprimer"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total et actions */}
            <div className="border-t-2 border-primary-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-gray-700">Total de la commande:</span>
                    <span className="text-3xl font-bold text-primary-600">
            {total.toFixed(2)}
                        <span className="text-lg text-gray-500 ml-1">MAD</span>
          </span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onValidate}
                        className="btn-success flex-1 py-3 text-lg"
                    >
                        Valider la commande
                    </button>
                    <button
                        onClick={onCancel}
                        className="btn-secondary flex-1 py-3 text-lg"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Panier;