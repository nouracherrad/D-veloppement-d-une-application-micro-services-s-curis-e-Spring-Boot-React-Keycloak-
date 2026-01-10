import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ProduitForm = ({ produit, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        stock: ''
    });

    useEffect(() => {
        if (produit) {
            setFormData({
                nom: produit.nom,
                description: produit.description,
                prix: produit.prix,
                stock: produit.stock
            });
        }
    }, [produit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            prix: parseFloat(formData.prix),
            stock: parseInt(formData.stock)
        });
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    {produit ? 'Modifier le produit' : 'Nouveau produit'}
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nom du produit *
                        </label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Ex: Laptop Dell XPS 15"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Prix (MAD) *
                        </label>
                        <input
                            type="number"
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Ex: 9999.99"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                        placeholder="Description détaillée du produit..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantité en stock *
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Ex: 50"
                        min="0"
                        required
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="btn-success flex-1 flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        {produit ? 'Mettre à jour' : 'Créer le produit'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary flex-1"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProduitForm;