
import React, { useState, useCallback } from 'react';
import { Product } from './types';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import ProductList from './components/ProductList';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import { PlusIcon, TagIcon, LogoutIcon } from './components/icons/Icons';
import Button from './components/Button';

type View = 'home' | 'auth' | 'dashboard';
type AuthView = 'login' | 'register';

const App: React.FC = () => {
  const { user, login, register, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(user?.id ?? null);
  
  const [currentView, setCurrentView] = useState<View>(user ? 'dashboard' : 'home');
  const [authView, setAuthView] = useState<AuthView>('login');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openModalForNew = useCallback(() => {
    setEditingProduct(null);
    setIsModalOpen(true);
  }, []);

  const openModalForEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleFormSubmit = useCallback((productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
    } else {
      addProduct(productData);
    }
    closeModal();
  }, [addProduct, closeModal, editingProduct, updateProduct]);
  
  const handleDeleteProduct = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        deleteProduct(id);
    }
  }, [deleteProduct]);

  const handleLogout = useCallback(() => {
    logout();
    setCurrentView('home');
  }, [logout]);

  const handleLoginSuccess = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.success) {
      setCurrentView('dashboard');
    }
    return result;
  };

  const handleRegisterSuccess = async (username: string, password: string) => {
    const result = await register(username, password);
    if (result.success) {
      setCurrentView('dashboard');
    }
    return result;
  };
  
  if (!user || currentView !== 'dashboard') {
    switch(currentView) {
      case 'auth':
        return (
          <AuthPage 
            initialView={authView}
            onLogin={handleLoginSuccess} 
            onRegister={handleRegisterSuccess}
            onBackToHome={() => setCurrentView('home')}
          />
        );
      case 'home':
      default:
        return (
          <HomePage 
            onNavigateToLogin={() => { setAuthView('login'); setCurrentView('auth'); }}
            onNavigateToRegister={() => { setAuthView('register'); setCurrentView('auth'); }}
          />
        );
    }
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <TagIcon className="h-8 w-8 text-indigo-500" />
              <h1 className="text-xl font-bold tracking-tight">Product Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium hidden sm:block">Welcome, {user.username}!</span>
              <Button onClick={openModalForNew} variant="primary">
                <PlusIcon className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Logout">
                <LogoutIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList 
          products={products} 
          onEdit={openModalForEdit} 
          onDelete={handleDeleteProduct} 
        />
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProductForm
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default App;
