import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Components from './components/Products';
import AboutUs from './components/Aboutus';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactUs from './components/contactus';
import Navbar1 from './components/Navbar1';
import Products from './components/Supports';
import SolutionComponent from './components/SolutionComponent';
import RevarceComponent from './components/RevarceComponent';
import HPC from './components/Varients/HPC';
import Dashboard from './components/Dashboard'; 
import ProductVariants from './components/ProductVariants';
import VerifyEmail from './components/VerifyEmail';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from '../src/components/ProtectedRoute';
import Userpro from './components/User/UserPro';
import UserAddress from './components/Slidebar/UserAddress';
import LegalNotice from './components/Slidebar/LegalNotice';
import Feedback from './components/Slidebar/Feedback';
import User from './components/Slidebar/User';

const App = () => {

  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Navbar1 />
      <Routes>
   

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/Supports" element={<Products />} />
        <Route path="/Navbar1" element={<Navbar1 />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Aboutus" element={<AboutUs />} />
        <Route path="/Products" element={<Components />} />
        <Route path="/RevarceComponent" element={<RevarceComponent />} />
        <Route path="/SolutionComponent" element={<SolutionComponent />} />
        <Route path="/varients/HPC" element={<HPC />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ProductVariants" element={<ProductVariants />} />
        <Route path="/verifyEmail" element={<VerifyEmail/>} />
        <Route path="/productVariants" element={<ProductVariants />} />
         <Route path="/user/Userpro" element={<Userpro />} />
        <Route path="/slidebar/userAddress" element={<UserAddress />} />
        <Route path="/slidebar/LegalNotice" element={<LegalNotice />} />
        <Route path="/slidebar/Feedback" element={<Feedback />} />

        <Route path="/slidebar/User" element={<User />} />

        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
      </Routes>
      <Footer />
    </Router>
        </AuthProvider>
  );
};

export default App;
