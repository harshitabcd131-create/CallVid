import React from 'react'
import '../styles/auth.css'

import { SignInButton } from "@clerk/clerk-react"

const AuthPage = () => {
    return (
        <div className='auth-container'>
            <div className='auth-left'>
                <div className='auth-hero'>
                    <div className='brand-container'>
                        <img src="/logo.png" alt="Slap" className='brand-logo' />
                        <span className='brand-name'>CallVid</span>
                    </div>
                    <h1 className="hero-title">Where work happens ✨</h1>
                    <p className='hero-subtitle'>
                        Connect with your team instantly through secure, real-time messaging. Experience
                        seamless collaboration and stay productive no matter where you are.
                    </p>
                    <div className='features-list'>
                        <div className='feature-item'>
                            <span className='feature-icon'>💬</span>
                            <span>Real-time messaging</span>
                        </div>
                        <div className='feature-item'>
                            <span className='feature-icon'>🎥</span>
                            <span>Video Calls and Meetings</span>
                        </div>


                        <div className='feature-item'>
                            <span className='feature-icon'>🔒</span>
                            <span>Secure & Private</span>

                        </div>
                    </div>

                    <SignInButton mode='modal'>
                        <button className='cta-button'>
                            Get Started ➡️
                        </button>
                    </SignInButton>

                </div>
            </div>
            <div className='auth-right'>
                <div className='auth-image-container'>
                <img src="/auth-i.png" alt="Team Collaboration"  className='auth-image'/>
                <div className='image-overlay'></div>
                </div>
            </div>

        </div>
    )
}

export default AuthPage
