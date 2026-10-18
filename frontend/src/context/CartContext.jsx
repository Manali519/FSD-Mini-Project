import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (medicine, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.medicineId === medicine._id);
      if (existingItem) {
        // Never allow more than the available stock in the cart
        return prevCart.map(item =>
          item.medicineId === medicine._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, medicine.stock) }
            : item
        );
      }
      return [...prevCart, { 
        medicineId: medicine._id, 
        name: medicine.name, 
        price: medicine.price, 
        quantity,
        stock: medicine.stock
      }];
    });
  };

  const removeFromCart = (medicineId) => {
    setCart(prevCart => prevCart.filter(item => item.medicineId !== medicineId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
