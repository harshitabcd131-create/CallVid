import { useAuth } from '@clerk/clerk-react'
import * as Sentry from "@sentry/react"
import { Navigate, Route, Routes } from 'react-router'
import AuthPage from './pages/AuthPage'
import CallPage from './pages/CallPage'
import HomePage from './pages/HomePage'
const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const App = () => {

  const {isSignedIn,isLoaded}= useAuth()

  if(!isLoaded) return null
  return(
    <>
  
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      
        
        
          <SentryRoutes>
            <Route path='/' element={isSignedIn ? <HomePage /> : <Navigate to= {"/auth"} replace/>} />
            {/* Catch-all route for unknown paths */}
            <Route path='/auth' element={!isSignedIn ? <AuthPage/> : <Navigate to={"/"} replace />} />
      
        
        
             <Route path='/call/:id' element={isSignedIn ? <CallPage/> : <Navigate to={"/auth"} replace />}/>
            
            <Route path='*' element={isSignedIn ? <Navigate to ={"/"} replace /> :<Navigate to={"/auth"} replace />} />
          </SentryRoutes>
        
      
    </Sentry.ErrorBoundary>
  
    </>
  )



}

export default App

//first version of routing :
  // return (
  //   <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
  //     <div>
        
  //       <SignedIn>
  //         <SentryRoutes>
  //           <Route path='/' element={<HomePage />} />
  //           {/* Catch-all route for unknown paths */}
  //           <Route path='*' element={<Navigate to={"/"} replace />} />
  //         </SentryRoutes>
  //       </SignedIn>
  //       <SignedOut>
  //         <SentryRoutes>
  //           <Route path='/auth' element={<AuthPage />} />
  //           <Route path='*' element={<Navigate to={"/auth"} replace />} />
  //         </SentryRoutes>
  //       </SignedOut>
  //     </div>
  //   </Sentry.ErrorBoundary>
  // )
