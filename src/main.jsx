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
