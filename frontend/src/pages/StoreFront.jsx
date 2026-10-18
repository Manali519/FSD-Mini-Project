import React, { useState, useEffect } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreFront = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await api.get('/medicines');
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines', error);
        setError(error.response?.data?.message || 'Failed to fetch medicines. Please try logging out and in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddToCart = (medicine) => {
    addToCart(medicine, 1); // Default to adding 1 at a time, users can update in cart or click multiple times
  };

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading Store...</div>;
  if (error) return <div className="container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-dark)' }}>Available Medicines</h1>
        <button 
          onClick={() => navigate('/cart')} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ShoppingCart size={20} />
          View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {medicines.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No medicines available at the moment.
          </div>
        ) : medicines.map(med => (
          <div key={med._id} className="card stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{med.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Category: {med.category}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>₹{med.price.toFixed(2)}</span>
                <span style={{ color: med.stock <= 20 ? 'var(--danger)' : '#10b981', fontWeight: 500 }}>
                  Stock: {med.stock}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => handleAddToCart(med)} 
              className="btn btn-outline" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreFront;
