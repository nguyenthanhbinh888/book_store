import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => boolean;
  updateQuantity: (bookId: number, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
    } catch (e) {
      console.error('Không thể lưu giỏ hàng vào localStorage', e);
    }
  }, [items]);

  const addToCart = (book: Book, quantity = 1): boolean => {
    if (!book.active || book.stockQuantity <= 0) {
      return false;
    }

    let success = true;
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.book.id === book.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > book.stockQuantity) {
          success = false;
          return prevItems;
        }
        return prevItems.map((item) =>
          item.book.id === book.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > book.stockQuantity) {
          success = false;
          return prevItems;
        }
        return [...prevItems, { book, quantity }];
      }
    });

    return success;
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.book.id === bookId) {
          const maxQty = item.book.stockQuantity;
          const validQty = Math.min(quantity, maxQty);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (bookId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.book.id !== bookId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.book.sellingPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
