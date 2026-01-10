import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Loader, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import commandeService from '../../services/commandeService';
import CommandeCard from './CommandeCard';
import CommandeForm from './CommandeForm';

const CommandesList = () => {
    const { isAdmin, isClient } = useAuth();
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCommandes();
    }, []);

    const fetchCommandes = async () => {
        try {
            setLoading(true);
            const data = isAdmin()
                ? await commandeService.getAllCommandes()
                : await commandeService.getMesCommandes();
            setCommandes(data);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des commandes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCommande = async (commandeData) => {
        try {
            await commandeService.createCommande(commandeData);
            await fetchCommandes();
            setShowForm(false);
            alert('Commande créée avec succès !');
        } catch (err) {
            const errorMsg = err.response?.data || 'Erreur lors de la création de la commande';
            alert(errorMsg);
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isAdmin() ? 'Toutes les commandes' : 'Mes commandes'}
                    </h2>
                    <p className="text-gray-600 mt-1">{commandes.length} commande(s)</p>
                </div>
                {isClient() && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center"
                    >
                        <Plus size={20} className="mr-2" />
                        Nouvelle commande
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-center">
                    <AlertCircle className="text-red-500 mr-3" size={20} />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {showForm && (
                <CommandeForm
                    onSubmit={handleCreateCommande}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {!showForm && (
                <>
                    {commandes.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
                            <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
                            {isClient() && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4 inline-flex items-center"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Créer ma première commande
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {commandes.map(commande => (
                                <CommandeCard key={commande.id} commande={commande} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommandesList;