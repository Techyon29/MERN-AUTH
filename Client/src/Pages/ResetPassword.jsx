import React , {useState,useContext} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("")
  const [newPassword, setnewpassword] = useState("")
  const [firstform, setfirstform] = useState(false);
  const [secondform,setsecondform] = useState(false);
  const [otp, setotp] = useState(0);
  const handlesumbit = async (e)=>{
    try {
      e.preventDefault();
      const {data} = await axios.post(backendurl + '/api/auth/ResetPassOtp',{email});
      if(data.success){
        toast.success(data.message);
        setfirstform(true);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  axios.defaults.withCredentials=true;
  const inputRef = React.useRef([])
  const {backendurl, isLoggedin,setIsLoggedin,userData,getUserData} = useContext(AppContent);

  const handleInput = (e ,index)=>{
    if(e.target.value.length > 0 && index < inputRef.current.length - 1){
      inputRef.current[index + 1].focus();
    }
  }
  const handlekeydown = (e,index)=>{
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRef.current[index - 1].focus();
    }
  }
  const handlepaste = (e)=>{
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRef.current[index]){
        inputRef.current[index].value = char;
      }
    })
  }

  const getotp = async (e)=>{
     try {
      e.preventDefault();
      const otpArray = inputRef.current.map(e => e.value)
      const otp = Number(otpArray.join(''))
      setotp(otp);
      setsecondform(true)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const resetpass = async (e)=>{
    try {
      e.preventDefault();
      console.log(typeof(email),typeof(otp),typeof(newPassword))
      const {data} = await axios.post(backendurl + '/api/auth/ResetPass',{email,otp,newPassword});

      if(data.success){
        toast.success(data.message);
        navigate('/login')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={()=>navigate("/")}src={assets.logo}  className=' absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>



            {!firstform?<form onSubmit={handlesumbit} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
              <h1 className=' text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your register email Email ID</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className=' w-3 h-3' />
            <input type="email" placeholder='Email Id' className=' bg-transparent outline-none text-gray-300' onChange={(e)=>setemail(e.target.value)} required/>
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white rounded-full'>Submit</button>
            </form>
            :
            (!secondform)?<form  onSubmit={getotp} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
          <h1 className=' text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id</p>
          <div className=' flex justify-between mb-8' onPaste={handlepaste}>
          {Array(6).fill(0).map((_,index)=>(
            <input type="text" maxLength='1' key={index} className=' w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' required ref={e => inputRef.current[index] = e} onInput={(e)=> handleInput(e,index)} onKeyDown={(e)=>handlekeydown(e,index)}/>
          ))}
          </div>
          <button className=' w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white rounded-full' type='Submit'>Sumbit</button>
        </form>
        :
        <form onSubmit={resetpass} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className=' text-white text-2xl font-semibold text-center mb-4'>Enter New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter Your Password</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className=' w-3 h-3' />
            <input type="password" placeholder='Password' className=' bg-transparent outline-none text-gray-300' onChange={(e)=>setnewpassword(e.target.value)} required/>
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white rounded-full'>Submit</button>
        </form>
            }   


        
    </div>
  )
}

export default ResetPassword