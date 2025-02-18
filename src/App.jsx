import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Details from './components/Details'
import Home from './pages/Home'
import './App.css'
// import SignUp from './pages/Signup'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import CreateEmployee from './pages/CreateEmployee'
import Projects from './pages/Projects'
import CreateProjects from './pages/CreateProjects'
import ProjectDetails from './pages/ProjectDetails'
import Dashboard from './pages/Dashboard'
import AssignFeature from './pages/AssignFeature'
import Timesheet from './pages/Timesheet'
import ErrorPage from './pages/ErrorPage'
import Bills from './pages/Billing'
import PurchasePremiumSection from './pages/PurchasePremiumSection'
import SuccessPage from './pages/SuccessPage'
import TimesheetPDF from './components/timesheetpdf/timesheetDoc'

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
        path="/users/details/:id" 
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
        element={<ProtectedRoute>
        <CreateEmployee/>
        </ProtectedRoute>}/>

        <Route 
        path="/projects" 
        element={ <ProtectedRoute>
          <Projects/>
        </ProtectedRoute>} />

        <Route 
        path="/success" 
        element={ <ProtectedRoute>
          <SuccessPage/>
        </ProtectedRoute>} />

        <Route 
        path="/timesheets" 
        element={ <ProtectedRoute>
          <Projects/>
        </ProtectedRoute>} />

        <Route 
        path="/createproject" 
        element={ 
          <ProtectedRoute>
            <CreateProjects/>
          </ProtectedRoute>
        } />

        <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
        } />

        <Route 
        path="/assignfeature" 
        element={
           <ProtectedRoute>
            <AssignFeature/>
           </ProtectedRoute>
        } />

        <Route 
        path="/removefeature" 
        element={
           <ProtectedRoute>
            <AssignFeature/>
           </ProtectedRoute>
        } />

        <Route 
        path="/projects/:id/timesheet" 
        element={
          <ProtectedRoute>
          <Timesheet/>
         </ProtectedRoute>
        } />

        <Route 
        path="/projects/:id/bills" 
        element={
          <ProtectedRoute>
          <Bills/>
         </ProtectedRoute>
        } />

        <Route 
        path="/projects/purchase/premium" 
        element={
          <ProtectedRoute>
          <PurchasePremiumSection/>
         </ProtectedRoute>
        } />

        <Route path='/login' element={<Login/>} />
        {/* <Route path='/signup' element={<SignUp/>} /> */}
        <Route path='/navbar' element={<Navbar/>} />
        <Route path='/timesheetpdf' element={<TimesheetPDF/>} />
        <Route path='/error' element={<ErrorPage/>} />
      </Routes>
    </div>
  )
}

export default App
