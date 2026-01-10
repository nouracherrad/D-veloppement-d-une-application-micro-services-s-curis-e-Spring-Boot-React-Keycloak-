import api from './api';
import authService from "./authService";

class ProduitService {
    async getAllProduits() {
        try {
            console.log(authService.getToken())
            const response = await api.get('/api/produits');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw error;
        }
    }

    async getProduitById(id) {
        try {
            const response = await api.get(`/api/produits/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du produit ${id}:`, error);
            throw error;
        }
    }

    async createProduit(produit) {
        try {
            const response = await api.post('/api/produits', produit);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw error;
        }
    }

    async updateProduit(id, produit) {
        try {
            const response = await api.put(`/api/produits/${id}`, produit);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
            throw error;
        }
    }

    async deleteProduit(id) {
        try {
            await api.delete(`/api/produits/${id}`);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression du produit ${id}:`, error);
            throw error;
        }
    }
}

export default new ProduitService();