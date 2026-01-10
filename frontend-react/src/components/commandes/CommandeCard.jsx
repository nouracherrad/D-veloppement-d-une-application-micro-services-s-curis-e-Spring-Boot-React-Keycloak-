import React from 'react';
import { ShoppingBag } from 'lucide-react';

const CommandeCard = ({ commande }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Commande #{commande.id}</h3>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    commande.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                        commande.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                }`}>
                    {commande.statut}
                </span>
            </div>

            <div className="flex items-center mb-2">
                <ShoppingBag className="text-primary-600 mr-2" size={20} />
                <span className="text-gray-700 font-medium">Client :</span>
                <span className="ml-1 text-gray-800">{commande.userId}</span>
            </div>

            <div className="mb-2">
                <span className="text-gray-700 font-medium">Montant total :</span>
                <span className="ml-1 font-bold text-primary-600">{commande.montantTotal.toFixed(2)} MAD</span>
            </div>

            <div className="mb-2">
                <span className="text-gray-700 font-medium">Date :</span>
                <span className="ml-1 text-gray-600">{new Date(commande.dateCommande).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default CommandeCard;
