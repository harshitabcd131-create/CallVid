import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import{Routes,Route, Navigate} from 'react-router'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/Homepage'

const App = () => {
  return (
    <div>
        
        <SignedIn>
          
          <Routes>
            <Route path='/' element ={<HomePage />} />
            <Route path='/' element={<Navigate to={"/"} replace/>}/>
          </Routes>
        </SignedIn>
        
        <SignedOut>
          <Routes>
            <Route path='/auth' element = {<AuthPage/>} />
            <Route path='*' element={<Navigate to={"/auth"} replace/>}/>
          </Routes>
        </SignedOut>
        
      
    </div>
  )
}

export default App

