import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Loader, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import produitService from '../../services/produitService';
import ProduitCard from './ProduitCard';
import ProduitForm from './ProduitForm';

const ProduitsList = () => {
    const { isAdmin } = useAuth();
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduit, setEditingProduit] = useState(null);

    useEffect(() => {
        fetchProduits();
    }, []);

    const fetchProduits = async () => {
        try {
            setLoading(true);
            const data = await produitService.getAllProduits();
            setProduits(data);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des produits');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (produitData) => {
        try {
            await produitService.createProduit(produitData);
            await fetchProduits();
            setShowForm(false);
            setEditingProduit(null);
        } catch (err) {
            alert('Erreur lors de la création du produit');
            console.error(err);
        }
    };

    const handleUpdate = async (produitData) => {
        try {
            await produitService.updateProduit(editingProduit.id, produitData);
            await fetchProduits();
            setShowForm(false);
            setEditingProduit(null);
        } catch (err) {
            alert('Erreur lors de la modification du produit');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }

        try {
            await produitService.deleteProduit(id);
            await fetchProduits();
        } catch (err) {
            alert('Erreur lors de la suppression du produit');
            console.error(err);
        }
    };

    const handleEdit = (produit) => {
        setEditingProduit(produit);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduit(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Catalogue Produits</h2>
                    <p className="text-gray-600 mt-1">{produits.length} produit(s) disponible(s)</p>
                </div>
                {isAdmin() && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center"
                    >
                        <Plus size={20} className="mr-2" />
                        Nouveau produit
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-center">
                    <AlertCircle className="text-red-500 mr-3" size={20} />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <ProduitForm
                    produit={editingProduit}
                    onSubmit={editingProduit ? handleUpdate : handleCreate}
                    onCancel={handleCancel}
                />
            )}

            {/* Liste des produits */}
            {produits.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="mx-auto text-gray-400 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">Aucun produit disponible</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produits.map(produit => (
                        <ProduitCard
                            key={produit.id}
                            produit={produit}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProduitsList;