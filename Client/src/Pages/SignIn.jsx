import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'
// fix: align import casing with file name AppContext
import { AppContent } from '../context/AppContext'
const SignIn = () => {
  const navigate = useNavigate();
  const [state,setstate] = useState("Sign Up")
  const [name,setname] = useState("")
  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const {backendurl,setIsLoggedin,getUserData} = useContext(AppContent)

  const onSubmitHandler = async (e)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true
      if(state === 'SignUp'){
        const {data} = await axios.post(backendurl + '/api/auth/register',{name,email,password})
        
        if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }
        else{
          toast.error(data.message);
        }
      }else{
        const {data} = await axios.post(backendurl + '/api/auth/login' ,{email,password})
        console.log(data)
        if(data.success){
          setIsLoggedin(true);
          getUserData()
          navigate('/')
        }
        else{
          console.log(data)
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message);
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate("/")}src={assets.logo}  className=' absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up'?"Create Account":"Login"}</h2>
        <p className='text-sm text-center mb-6'>{state === 'Sign Up'?"Create your Account":"Login to your account!"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign In'?'':<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
            <img src={assets.person_icon} alt="" />
            <input onChange={e=>setname(e.target.value)} value={name} type="text" placeholder='Full Name' required className='bg-transparent outline-none'/>
          </div>}
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
            <img src={assets.mail_icon} alt="" />
            <input type="email" onChange={e=>setemail(e.target.value)} value={email} placeholder='Email Id' required className='bg-transparent outline-none'/>
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
            <img src={assets.lock_icon} alt="" />
            <input type="password" placeholder='Password' required value={password} className='bg-transparent outline-none' onChange={e=>setpassword(e.target.value)}/>
          </div>
          <p onClick={()=>navigate("/reset-password")} className='mb-4 text-indigo-500 cursor-pointer'>Forget Password?</p>
          <button type='submit' className='  rounded-full py-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{state}</button>
        </form>
        {state === 'Sign Up'?<p className=' text-gray-400 text-center text-xs mt-4'>Already have an account?{'  '}
          <span onClick={()=>setstate('Sign In')} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>:<p className=' text-gray-400 text-center text-xs mt-4'>Don't have an account?{'  '}
          <span onClick={()=> setstate('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>}
        
        
      </div>
    </div>
  )
}

export default SignIn