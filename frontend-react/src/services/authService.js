import axios from 'axios';
import { KEYCLOAK_CONFIG } from '../utils/constants';

class AuthService {
    async login(username, password) {
        try {
            const response = await axios.post(
                `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`,
                new URLSearchParams({
                    client_id: KEYCLOAK_CONFIG.clientId,
                    grant_type: 'password',
                    username,
                    password
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            const { access_token } = response.data;

            // Décoder le token JWT
            const payload = JSON.parse(atob(access_token.split('.')[1]));

            const user = {
                username: payload.preferred_username,
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                roles: payload.realm_access?.roles || [],
                userId: payload.sub
            };

            // Sauvegarder dans localStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return {
                success: false,
                error: error.response?.data?.error_description || 'Identifiants incorrects'
            };
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.roles?.includes(role) || false;
    }
}

export default new AuthService();