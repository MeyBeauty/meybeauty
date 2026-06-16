import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './styles.css';
import { CartProvider } from './context/CartContext.jsx';
import { CatalogProvider } from './context/CatalogContext.jsx';
import { BlogProvider } from './context/BlogContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { PromotionsProvider } from './context/PromotionsContext.jsx';

const helmetContext = {};

// Register Service Worker for offline cache
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <CartProvider>
        <WishlistProvider>
          <CatalogProvider>
            <BlogProvider>
              <PromotionsProvider>
                <App />
              </PromotionsProvider>
            </BlogProvider>
          </CatalogProvider>
        </WishlistProvider>
      </CartProvider>
    </HelmetProvider>
  </React.StrictMode>
);
