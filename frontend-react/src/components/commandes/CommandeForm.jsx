import React, { useState, useEffect } from 'react';
import { Plus, X, Package } from 'lucide-react';
import produitService from '../../services/produitService';
import Panier from './Panier';

const CommandeForm = ({ onSubmit, onCancel }) => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [panier, setPanier] = useState([]);

    useEffect(() => {
        fetchProduits();
    }, []);

    const fetchProduits = async () => {
        try {
            const data = await produitService.getAllProduits();
            setProduits(data.filter(p => p.stock > 0));
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
        } finally {
            setLoading(false);
        }
    };

    const ajouterAuPanier = (produit) => {
        const existant = panier.find(item => item.idProduit === produit.id);

        if (existant) {
            if (existant.quantite < produit.stock) {
                setPanier(panier.map(item =>
                    item.idProduit === produit.id
                        ? { ...item, quantite: item.quantite + 1 }
                        : item
                ));
            } else {
                alert('Stock insuffisant pour ce produit');
            }
        } else {
            setPanier([...panier, {
                idProduit: produit.id,
                nom: produit.nom,
                prix: produit.prix,
                quantite: 1,
                stockMax: produit.stock
            }]);
        }
    };

    const modifierQuantite = (idProduit, nouvelleQuantite) => {
        const item = panier.find(p => p.idProduit === idProduit);

        if (nouvelleQuantite === 0) {
            supprimerDuPanier(idProduit);
        } else if (nouvelleQuantite <= item.stockMax) {
            setPanier(panier.map(item =>
                item.idProduit === idProduit
                    ? { ...item, quantite: nouvelleQuantite }
                    : item
            ));
        } else {
            alert('Stock insuffisant pour cette quantité');
        }
    };

    const supprimerDuPanier = (idProduit) => {
        setPanier(panier.filter(item => item.idProduit !== idProduit));
    };

    const handleValidate = () => {
        if (panier.length === 0) {
            alert('Votre panier est vide');
            return;
        }

        const commandeData = {
            lignes: panier.map(item => ({
                idProduit: item.idProduit,
                quantite: item.quantite,
                prix: item.prix
            }))
        };

        onSubmit(commandeData);
    };

    if (loading) {
        return (
            <div className="card text-center py-12">
                <p className="text-gray-500">Chargement des produits...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Créer une nouvelle commande</h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Catalogue produits */}
                <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
                        <Package className="mr-2 text-primary-600" size={20} />
                        Produits disponibles
                    </h4>

                    {produits.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Aucun produit en stock</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {produits.map(produit => (
                                <button
                                    key={produit.id}
                                    onClick={() => ajouterAuPanier(produit)}
                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left group"
                                >
                                    <h5 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-600">
                                        {produit.nom}
                                    </h5>
                                    <p className="text-primary-600 font-bold text-lg mb-1">
                                        {produit.prix.toFixed(2)} MAD
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Stock disponible: {produit.stock}
                                    </p>
                                    <div className="mt-2 flex items-center text-primary-600 text-sm font-medium">
                                        <Plus size={14} className="mr-1" />
                                        Ajouter au panier
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Panier */}
            <Panier
                items={panier}
                onUpdateQuantity={modifierQuantite}
                onRemove={supprimerDuPanier}
                onValidate={handleValidate}
                onCancel={() => {
                    setPanier([]);
                    onCancel();
                }}
            />
        </div>
    );
};

export default CommandeForm;