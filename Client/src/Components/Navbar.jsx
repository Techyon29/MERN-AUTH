import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
const Navbar = () => {
  const navigation = useNavigate();
  const {userData, backendurl, setuserData, setIsLoggedin} = useContext(AppContent);

  const logout = async ()=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl + '/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setuserData(false);
      console.log("Moving to home page")
      navigation('/')
      window.location.reload();
    } catch (error) {
      toast.error(error.message)
    }
  }

  const verifyemail = async ()=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl+'/api/auth/verify-account')
      if(data.success){
        navigation('/email-verify');
        toast.success(data.message);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className='w-full flex justify-between item-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
        {userData ?
        <div className='w-8 h-8 bg-black text-white flex justify-center rounded-full items-center relative group'>{userData && userData.name ? userData.name[0].toUpperCase() : ''}
        <div className=' absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-10 rounded'>
          <ul className=' list-none m-0 p-2 bg-gray-100 text-sm '>
            {!userData.Authentication && <li className='py-1 px-2  hover:bg-gray-200 cursor-pointer' onClick={verifyemail}>Verify Email</li>}
            
            <li onClick={logout} className='px-2 py-1 hover:bg-gray-200 cursor-pointer pr-10' >Log Out</li>
          </ul>
          </div>
          </div>
        :<button onClick={()=>{navigation("/login")}} className='flex items-center gap-2 border border-grey-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 tarnsition-all cursor-pointer'>Login <img src={assets.arrow_icon} alt="" className=''/></button>}
        
    </div>
  )
}

export default Navbar