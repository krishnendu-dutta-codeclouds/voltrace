import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Wishlist from './pages/Wishlist';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { WishlistProvider } from './context/WishlistContext';
import { installSmoothScroll, scrollToTop } from './anim/framer-primitives';
import { ScrollProgress } from './anim/primitives';
import Cursor from './anim/Cursor';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [pathname]);
  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const minimalNav = pathname === '/checkout';

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <NavBar minimal={minimalNav} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    installSmoothScroll();
  }, []);

  return (
    <BrowserRouter>
      <OrderProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <AppShell />
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </BrowserRouter>
  );
}
