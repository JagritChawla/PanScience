import React from 'react'
import {Route , Routes }from 'react-router-dom';

import HomeScreen from '../screens/HomeScreen';
import { PrivateRoute } from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from "../screens/RegisterScreen"
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import TaskListScreen from '../screens/TaskListScreen';
import UserListScreen from '../screens/UserListScreen';
import UpdateTaskScreen from '../screens/UpdateTaskScreen';
import UserProfileScreen from '../screens/UserProfileScreen';


const AllRoutes = () => {
  return (
    <Routes>
        
        <Route path="/login" element={<LoginScreen />}></Route>
        <Route path="/register" element={<RegisterScreen />}></Route>

        <Route path="" element={<PrivateRoute />}>
            <Route path='/' element={<HomeScreen />} />
            <Route path="/tasks/:id" element={<TaskDetailsScreen />} />
            <Route path="/profile" element={<UserProfileScreen />} />
        </Route>

        <Route path="" element={<AdminRoute />}>
            <Route path='/create-task' element={<CreateTaskScreen />} />
            <Route path='/tasks' element={<TaskListScreen />} />
            <Route path='/users' element={<UserListScreen />} />
            <Route path = "/update-task/:id" element={<UpdateTaskScreen />} />
        </Route>


    </ Routes>

    
  )
}

export default AllRoutes