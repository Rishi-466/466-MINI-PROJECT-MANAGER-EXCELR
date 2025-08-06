
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

const getInitialProducts = (userId: string | null): Product[] => {
    if (!userId) return [];
    try {
        const item = window.localStorage.getItem(`products_${userId}`);
        // Check if user has products, if not it's their first time.
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.error("Failed to parse products from localStorage", error);
    }
    // Default initial data for a new user
    return [
        { id: 'prod-1', name: 'Wireless Headphones', description: 'High-fidelity sound with noise cancellation.', price: 199.99, imageUrl: 'https://picsum.photos/seed/headphones/400/300' },
        { id: 'prod-2', name: 'Mechanical Keyboard', description: 'RGB backlit keyboard with tactile switches.', price: 120.00, imageUrl: 'https://picsum.photos/seed/keyboard/400/300' },
        { id: 'prod-3', name: 'Ergonomic Mouse', description: 'Designed for comfort and long hours of use.', price: 79.50, imageUrl: 'https://picsum.photos/seed/mouse/400/300' },
    ];
};


export const useProducts = (userId: string | null) => {
    const [products, setProducts] = useState<Product[]>(() => getInitialProducts(userId));

    // This effect runs when the user logs in or out.
    useEffect(() => {
        setProducts(getInitialProducts(userId));
    }, [userId]);


    // This effect saves products to localStorage whenever they change.
    useEffect(() => {
        if (!userId || !products) return;
        try {
            window.localStorage.setItem(`products_${userId}`, JSON.stringify(products));
        } catch (error) {
            console.error("Failed to save products to localStorage", error);
        }
    }, [products, userId]);

    const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
        if (!userId) return;
        const newProduct: Product = {
            id: `prod-${new Date().getTime()}`,
            ...productData,
        };
        setProducts(prevProducts => [...prevProducts, newProduct]);
    }, [userId]);

    const updateProduct = useCallback((updatedProduct: Product) => {
        if (!userId) return;
        setProducts(prevProducts =>
            prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    }, [userId]);

    const deleteProduct = useCallback((id: string) => {
        if (!userId) return;
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    }, [userId]);

    return { products, addProduct, updateProduct, deleteProduct };
};
