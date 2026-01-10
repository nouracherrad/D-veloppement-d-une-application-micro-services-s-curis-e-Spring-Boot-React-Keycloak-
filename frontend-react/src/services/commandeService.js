import api from './api';

class CommandeService {
    async getAllCommandes() {
        try {
            const response = await api.get('/api/commandes');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }

    async getMesCommandes() {
        try {
            const response = await api.get('/api/commandes/mes-commandes');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de mes commandes:', error);
            throw error;
        }
    }

    async getCommandeById(id) {
        try {
            const response = await api.get(`/api/commandes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
            throw error;
        }
    }

    async createCommande(commandeData) {
        try {
            const response = await api.post('/api/commandes', commandeData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }
}

export default new CommandeService();