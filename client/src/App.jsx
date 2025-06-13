import Home from './pages/Home'
import Navbar from './components/Navbar'
import './App.css'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import { Routes,Route } from 'react-router-dom'
import Cart from './pages/Cart' 
import Subcategories from './pages/Subcategories'
import Products from './pages/Products'
import SubcategoryProducts from './pages/SubcategoryProducts'
import ProductDetails from './components/ProductDetails'
import Orders from './pages/Orders'

function App() {

  const {showUserLogin} = useAppContext();
  return (
    <>
    <Toaster />
    {showUserLogin && <Login />}
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products/>} />
      <Route path="/products/:category/:subcategory/:id" element={<ProductDetails/>} />
      <Route path="/products/:category" element={<Subcategories />} />
      <Route path="/products/:category/:subcategory" element={<SubcategoryProducts/>} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders/>} />
    </Routes>
    </>
  )
}

export default App
