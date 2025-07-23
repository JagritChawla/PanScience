import React from 'react'
import {Route , Routes }from 'react-router-dom';

import HomeScreen from '../screens/HomeScreen';
import { PrivateRoute } from '../components/PrivateRoute';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from "../screens/RegisterScreen"


const AllRoutes = () => {
  return (
    <Routes>
        
        <Route path="/login" element={<LoginScreen />}></Route>
        <Route path="/register" element={<RegisterScreen />}></Route>

        <Route path="" element={<PrivateRoute />}>
            <Route path='/' element={<HomeScreen />} />
        </Route>
    </ Routes>

    
  )
}

export default AllRoutes