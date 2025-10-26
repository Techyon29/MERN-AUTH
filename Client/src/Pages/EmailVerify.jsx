import  React,  {useContext, useEffect  } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const EmailVerify = () => {
  axios.defaults.withCredentials=true;
  const inputRef = React.useRef([])
  const navigate = useNavigate();
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

  const handleonSumit = async (e)=>{
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map(e => e.value)
      const otp = Number(otpArray.join(''))
      const {data} = await axios.post(backendurl + '/api/auth/verify-otp',{otp})
      console.log(data)
      if(data.success){
        toast.success(data.message);
        getUserData();
        setIsLoggedin(true)
        navigate('/')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    isLoggedin && userData && userData.Authentication && navigate('/')
  },[isLoggedin,userData])
  return (
    <div>
      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
        <img onClick={()=>navigate("/")}src={assets.logo}  className=' absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        <form onSubmit={handleonSumit} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
          <h1 className=' text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id</p>
          <div className=' flex justify-between mb-8' onPaste={handlepaste}>
          {Array(6).fill(0).map((_,index)=>(
            <input type="text" maxLength='1' key={index} className=' w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' required ref={e => inputRef.current[index] = e} onInput={(e)=> handleInput(e,index)} onKeyDown={(e)=>handlekeydown(e,index)}/>
          ))}

          </div>
          <button className=' w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white rounded-full' type='Submit'>Verify Email</button>
        </form>

      </div>
    </div>
  )
}

export default EmailVerify