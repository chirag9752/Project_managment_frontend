// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Details from './components/Details'
import Home from './pages/Home'
import './App.css'
import SignUp from './pages/Signup'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import CreateEmployee from './pages/CreateEmployee'
import Projects from './pages/Projects'
import CreateProjects from './pages/CreateProjects'
import ProjectDetails from './pages/ProjectDetails'

function App() {
  return (
    <div>
      <Routes>
        <Route
        path='/' 
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>  
        } />

        <Route 
        path="/users/:id" 
        element={
          <ProtectedRoute>
          <Details />
        </ProtectedRoute>
        } />

        <Route 
        path="/projects/:id" 
        element={
          <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
        } />

       <Route 
        path="/createemployee" 
        element={
          <ProtectedRoute>
          <CreateEmployee/>
        </ProtectedRoute>
        } />

        <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
          <Projects/>
        </ProtectedRoute>
        } />

        <Route 
        path="/createprojects" 
        element={
          <ProtectedRoute>
          <CreateProjects/>
        </ProtectedRoute>
        } />

        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/navbar' element={<Navbar/>} />
      </Routes>
    </div>
  )
}

export default App
