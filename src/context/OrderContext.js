import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const addOrder = (order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const updateOrderPaymentStatus = (orderId, paymentStatus, paymentDetails = {}) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            paymentStatus,
            paymentDetails: { ...order.paymentDetails, ...paymentDetails },
            lastUpdated: new Date().toISOString()
          }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrderStatus = (order) => {
    // If order is pending payment, don't show delivery status
    if (order.status === 'pending') return 'pending';
    
    const now = new Date();
    const orderDate = new Date(order.orderDate);
    const estimatedDelivery = new Date(order.estimatedDelivery);
    
    if (now < orderDate) return 'preparing';
    if (now < estimatedDelivery) return 'onTheWay';
    return 'delivered';
  };

  const getActiveOrders = (userId) => {
    const userOrders = getUserOrders(userId);
    return userOrders.filter(order => 
      order.status !== 'cancelled' && getOrderStatus(order) !== 'delivered'
    );
  };

  const getCompletedOrders = (userId) => {
    const userOrders = getUserOrders(userId);
    return userOrders.filter(order => getOrderStatus(order) === 'delivered');
  };

  const getPendingPaymentOrders = (userId) => {
    const userOrders = getUserOrders(userId);
    return userOrders.filter(order => order.status === 'pending');
  };

  const cancelOrder = (orderId) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled', cancelledAt: new Date().toISOString() }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    getUserOrders,
    getOrderById,
    getOrderStatus,
    getActiveOrders,
    getCompletedOrders,
    getPendingPaymentOrders,
    cancelOrder,
    loading
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
