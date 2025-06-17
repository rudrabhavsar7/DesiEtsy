import React,{useEffect} from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import './App.css'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import { Routes, Route, useLocation } from 'react-router-dom'
import Cart from './pages/Cart' 
import Subcategories from './pages/Subcategories'
import Products from './pages/Products'
import SubcategoryProducts from './pages/SubcategoryProducts'
import ProductDetails from './components/ProductDetails'
import Orders from './pages/Orders'
import AdminDashboard from './pages/Admin/AdminDashboard'

// Artisan Dashboard
import ArtisanDashboard from './pages/Artisan/ArtisanDashboard'
import ArtisanRegister from './pages/Artisan/ArtisanRegister'
import Address from './components/Address'

function App() {

  const isAdminPath = useLocation().pathname.includes('/admin');
  const isArtisanPath = useLocation().pathname.includes('/artisan');
  const { showUserLogin, isSeller, isAdmin, fetchSeller } = useAppContext();

  useEffect(() => {
    if (isArtisanPath) {
      fetchSeller();
    }
  }, [isArtisanPath]);

  return (
    <>
    <Toaster />
    {showUserLogin && <Login />}
    {!isAdminPath && !isArtisanPath && <Navbar />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products/>} />
      <Route path="/products/:category/:subcategory/:id" element={<ProductDetails/>} />
      <Route path="/products/:category" element={<Subcategories />} />
      <Route path="/products/:category/:subcategory" element={<SubcategoryProducts/>} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders/>} />
      <Route path='/add-address' element={<Address/>}/>
      
      {/* Artisan Dashboard Route */}
      {isArtisanPath && <Route path="/artisan-dashboard" element={isSeller ? <ArtisanDashboard /> : <ArtisanRegister/>} />}

      {/* Admin Dashboard Route */}
      {isAdminPath && <Route path="/admin" element={<AdminDashboard />} >
        <Route index primary path='login' element={<Login />} />
      </Route>}
    </Routes>
    </>
  )
}

export default App