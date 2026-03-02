import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import{Routes,Route, Navigate} from 'react-router'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import toast from 'react-hot-toast'
import * as Sentry from "@sentry/react";
const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const App = () => {



  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <div>
        
        <SignedIn>
          <SentryRoutes>
            <Route path='/' element={<HomePage />} />
            {/* Catch-all route for unknown paths */}
            <Route path='*' element={<Navigate to={"/"} replace />} />
          </SentryRoutes>
        </SignedIn>
        <SignedOut>
          <SentryRoutes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path='*' element={<Navigate to={"/auth"} replace />} />
          </SentryRoutes>
        </SignedOut>
      </div>
    </Sentry.ErrorBoundary>
  )

}

export default App
