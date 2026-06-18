import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { loginSuccess } from '../features/auth/authSlice'
import { selectIsAuthenticated } from '../features/auth/authSelectors'
import Images from '../Images/index'


const DUMMY_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '12345',
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const redirectPath = location.state?.from || '/crm/offline-profiles'

  // State Management
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showHidePassword, changeShowHidePassword] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  // Login Functionality
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    let hasError = false

    if (!isValidEmail) {
      setEmailError('Please enter a valid email')
      hasError = true
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError('Please enter password')
      hasError = true
    } else {
      setPasswordError('')
    }

    if (hasError) return

    // Dummy credentials check
    if (
      email === DUMMY_CREDENTIALS.email &&
      password === DUMMY_CREDENTIALS.password
    ) {
      dispatch(
        loginSuccess({
          user: { email, name: 'Deepak' },
          token: 'dummy-jwt-token',
        }),
      )
      message.success('Login successful!')
      navigate(redirectPath, { replace: true })
      return
    }

    message.error('Invalid email or password')
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        // background:
        //   'radial-gradient(51.99% 51.99% at 35.7% 48.01%, #FFFFFF 0%, #FDECCC 100%)',
        backgroundImage: `url(${Images.LoginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="grid w-full max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        
        {/* Left side - Placeholder for Design alignment (No image imports used) */}
        <div className="hidden items-center justify-center p-8 lg:flex">
          <img
            className="w-full max-w-[750px] object-contain scale-105 xl:max-w-[900px]"
            src={Images.LoginFrontLogo}
            alt="Login Logo"
          />
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center px-6 py-12 md:px-12 lg:justify-end lg:pr-8 xl:pr-12">
          <div className="w-full max-w-[350px]">
            
            {/* Heading */}
            <div className="pb-6 text-center">
               <div className="flex justify-center pr-6 lg:pr-10">
                                <img src={Images.LoginFormLogo} alt="" className="" />
                            </div>
              <p className="relative right-2 pt-4 text-center font-Regular-Font text-[24px] font-semibold lg:right-4">
                Welcome Back!!!
              </p>
              <p className="relative right-2 text-center font-Regular-Font text-[14px] font-semibold text-[#E92458] lg:right-4">
                To Your KM Pulse
              </p>
            </div>

            {/* Form area */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-Regular-Font text-[14px] font-semibold text-[#000000]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  autoComplete="off"
                  placeholder="admin@gmail.com"
                  className="form-input block w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3.5 text-[14px] text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                {emailError && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-Regular-Font text-[14px] font-semibold text-[#000000]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    placeholder="*************"
                    type={showHidePassword ? 'text' : 'password'}
                    className="form-input block w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3.5 text-[14px] text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  
                  {/* Ant Design Icons used for Password Visibility Toggle */}
                  <div 
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-slate-400 text-lg hover:text-slate-600 transition-colors"
                    onClick={() => changeShowHidePassword(!showHidePassword)}
                  >
                    {showHidePassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </div>
                </div>
                {passwordError && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{passwordError}</p>
                )}
              </div>

              {/* Sign In button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center rounded-[10px] border-0 bg-[#E29928] py-3 font-Regular-Font text-[18px] font-semibold text-white shadow-md outline-none transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 hover:opacity-90"
                >
                  Sign In
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
