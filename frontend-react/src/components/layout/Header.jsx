import React from 'react';
import { ShoppingCart, Package, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ currentPage, setCurrentPage }) => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo et Navigation */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg mr-3">
                                <ShoppingCart className="text-white" size={24} />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                                E-Commerce
                            </h1>
                        </div>

                        <div className="hidden md:flex space-x-2">
                            <button
                                onClick={() => setCurrentPage('produits')}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition duration-200 ${
                                    currentPage === 'produits'
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Package size={18} className="mr-2" />
                                Produits
                            </button>
                            <button
                                onClick={() => setCurrentPage('commandes')}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition duration-200 ${
                                    currentPage === 'commandes'
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <ShoppingCart size={18} className="mr-2" />
                                Commandes
                            </button>
                        </div>
                    </div>

                    {/* User Info et Logout */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center">
                                <p className="font-semibold text-gray-800">{user.username}</p>
                                {isAdmin() && (
                                    <Shield className="ml-2 text-purple-600" size={16} />
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                {isAdmin() ? 'Administrateur' : 'Client'}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
                        >
                            <LogOut size={18} className="mr-2" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;