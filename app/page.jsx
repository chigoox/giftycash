'use client';

import { Button, Card, Input, Modal, Switch } from 'antd';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import app from '../Firebase';

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DollarSignIcon, LogInIcon, LogOutIcon, SendIcon, Settings, User2Icon } from 'lucide-react';
import { logIn, logOut, sendVerification } from './myCodes/Auth';
import { addToDoc } from './myCodes/Database';


const auth = getAuth(app);
const db = getFirestore(app);

export default function Home() {
  const [amount, setAmount] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [steps, setSteps] = useState(1)
  const [user, setUser] = useState({})
  const [currentMenu, setCurrentMenu] = useState('None')
  const [LoginRegister, setLoginRegister] = useState(false)
  const toggleLoginRegister = () => {setLoginRegister(!LoginRegister) }
  
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
    }else{
      
    }});
  }, [])
  

  console.log(user)

  return (
    <div className="min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center text-white">
      {user.uid && <MobileNavBar currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />}
      <div className=" absolute left-4 top-4 flex flex-col-reverse items-center justify-center">
        <motion.h1
          className="text-xs font-light text-purple-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          Credit Converter
        </motion.h1>
        <motion.h1
          className="text-xl  font-bold text-purple-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          GiftyCash
        </motion.h1>
      </div>
      {steps == 1 && (
        <InputSendAmount
          amount={amount}
          setAmount={setAmount}
          setSteps={setSteps}
          user={user}
        />
      )}
      {steps >= 2 && <StripeCheckOut amount={amount} />}
      <motion.div
        className={`fixed ${user.uid? 'right-4 h-16  bottom-4 w-5 md:w-auto rounded-r-lg p-1':'p-3  right-6 bottom-6 rounded-full'} trans flex items-center justify-center  bg-purple-500  cursor-pointer`}
        onClick={() => setModalOpen(true)}
        whileHover={{ scale: 1.1 }}
      >
        {user.uid ? <LogOutIcon /> : <LogInIcon />}
      </motion.div>

      <Modal
        title={
          user.uid ? (
            ""
          ) : (
            <Switch
              checkedChildren="Login"
              unCheckedChildren="Register"
              className="text-black"
              value={LoginRegister}
              onChange={() => toggleLoginRegister()}
            />
          )
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        style={{
          borderRadius: "12px", // Rounded corners for the modal
          padding: "20px", // Add padding for spacing
        }}
      >
        <Card className="border-none">
          {user.uid ? (
            <LogOut setUser={setUser} />
          ) : LoginRegister ? (
            <SignUp />
          ) : (
            <Login />
          )}
        </Card>
      </Modal>
    </div>
  );
}

export const MobileNavBar = ({currentMenu, setCurrentMenu}) => {
  const menuItems = [
    { name: "Balance", icon: "" },
    { name: "Send", icon: "" },
    { name: "Profile", iocn: "" },
    { name: "Settings", icon: "" },
  ];
 

  return(
    <Card className='w-[90%] md:w-auto h-16  absolute bottom-4 bg-purple-200 border-2 flex items-center justify-center'>  
      <div className='w-full grid grid-cols-4 gap-2 border'>
      {menuItems.map((item, i) => {
        return (
          <Button key={i} onClick={()=>setCurrentMenu(item.name)} className={`${currentMenu == item.name ? 'bg-purple-700': 'bg-purple-500'}`+ " col-span-1 h-full flex flex-col  items-center justify-center"}>
            {item.name == 'Balance' && <DollarSignIcon color='white' size={24} />}
            {item.name == 'Send' && <SendIcon color={'white'} size={24} />}
            {item.name == 'Profile' && <User2Icon color='white' size={24} />}
            {item.name == 'Settings' && <Settings color='white' size={24} />}
            <div className="text-xs text-center text-white">{item.name}</div>
          </Button>
        )
      })}
      </div>
    
    </Card>
  )
}


const SignUp = () => {
  const [userData, setUserData] = useState({ userName: '', fullName: '', phone: '', email: '' });
  const { email, fullName, phone, userName, password } = userData;


  const setUpConntectedAccount = async ({userName, email, uid}) => {
    const data = await  fetch('/api/LinkConnectedAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          email,
        }),
      })
      let URL = await data.json()
      window.location.href = URL
    }

  

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
    await addToDoc('users', email, { userName, fullName, phone, email, uid: result.user.uid });
    await setUpConntectedAccount({ email: result.email, uid: result.user.uid})
    } catch ({message}) {
      console.log(message)
    }

  };

  const handleEmailPasswordReqister = async () => {
    if (!email) return;
    try {
      const result = await createUserWithEmailAndPassword(auth,email, password);
      await addToDoc('users', email, { userName, fullName, phone, email, uid: result.user.uid });
      await sendVerification()
      await setUpConntectedAccount({ email: email, uid: result.user.uid})
    } catch ({message}) {
      console.log(message)
    }
  }


  return(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
    <Input
      placeholder="Username"
      onChange={e => setUserData({ ...userData, userName: e.target.value })}
      style={{
        borderRadius: '8px', // Rounded corners for inputs
        padding: '12px', // More padding inside the input
        backgroundColor: '#f9f9f9', // Subtle background color
        border: '1px solid #e0e0e0', // Soft border
      }}
    />
    <Input
      placeholder="Full Name"
      onChange={e => setUserData({ ...userData, fullName: e.target.value })}
      style={{
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
      }}
    />
    <Input
      placeholder="Phone"
      onChange={e => setUserData({ ...userData, phone: e.target.value })}
      style={{
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
      }}
    />
    <Input
      placeholder="Email"
      onChange={e => setUserData({ ...userData, email: e.target.value })}
      style={{
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
      }}
    />
    <Input
      placeholder="Password"
      onChange={e => setUserData({ ...userData, password: e.target.value })}
      style={{
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
      }}
    />

    <Button
      className="mt-3"
      onClick={handleEmailPasswordReqister}
      onKeyDown={(event)=>{
        if(event.key === 'Enter'){
          handleEmailPasswordReqister()
        }
      }}
      style={{
        backgroundColor: '#6a3ec7', // Purple background for the button
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px', // Rounded corners for the button
        fontWeight: 'bold',
        border: 'none', // Remove border
        transition: 'background-color 0.3s ease', // Smooth transition on hover
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = '#5a34a5')} // Darker purple on hover
      onMouseLeave={e => (e.target.style.backgroundColor = '#6a3ec7')} // Revert to original color
    >
      Sign Up
    </Button>

    {(userName && fullName && phone) && <Button
      className="mt-3"
      onClick={handleGoogleSignIn}
      style={{
        backgroundColor: '#333333', // Gray background for secondary button
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = '#555555')}
      onMouseLeave={e => (e.target.style.backgroundColor = '#333333')}
    >
      Sign in with Google
    </Button>}
  </div>
  )
}

const Login = () => {
  const [userData, setUserData] = useState({ userName: '', fullName: '', phone: '', email: '' });
  const { email, password } = userData;




  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
    } catch ({message}) {
      console.log(message)
    }

  };

  const handleEmailPasswordLogin = async () => {
    if (!email) return;
    try {
      const result = await logIn(email, password);
      
    } catch ({message}) {
      console.log(message)
    }
  }


  return(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
    
    <Input
      placeholder="Email"
      onChange={e => setUserData({ ...userData, email: e.target.value })}
      style={{
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
      }}
    />
    <Input
      placeholder="Password"
      onChange={e => setUserData({ ...userData, password: e.target.value })}
      style={{
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
      }}
    />

    <Button
      className="mt-3"
      onKeyDown={(event)=>{
        if(event.key === 'Enter'){
          handleEmailPasswordLogin()
        }
      }} 
      onClick={handleEmailPasswordLogin}
      style={{
        backgroundColor: '#6a3ec7', // Purple background for the button
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px', // Rounded corners for the button
        fontWeight: 'bold',
        border: 'none', // Remove border
        transition: 'background-color 0.3s ease', // Smooth transition on hover
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = '#5a34a5')} // Darker purple on hover
      onMouseLeave={e => (e.target.style.backgroundColor = '#6a3ec7')} // Revert to original color
    >
      Login
    </Button>

    <Button
      className="mt-3"
      onClick={handleGoogleSignIn}
      style={{
        backgroundColor: '#333333', // Gray background for secondary button
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = '#555555')}
      onMouseLeave={e => (e.target.style.backgroundColor = '#333333')}
    >
      
      Login with Google
    </Button>
  </div>
  )
}

const LogOut = ({setUser}) => {

  return(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
    <Button
      className="mt-3"
      onClick={()=>{logOut(); setUser({})}}
      onKeyDown={(event)=>{
        if(event.key === 'Enter'){
          logOut(); 
          setUser({});
        }
      }} 
      style={{
        backgroundColor: 'black', // Gray background for secondary button
        color: 'purple',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = '#555555')}
      onMouseLeave={e => (e.target.style.backgroundColor = '#333333')}
    >
      
      Logout
    </Button>
  </div>
  )
}


const InputSendAmount = ({amount, setAmount, setSteps, user}) => {
  
  const handlePayment = async () => {
    if (!amount) return;
    setSteps(2);
  };


  const defualtAmounts = ['$10', '$25', '$50', '$100', '$250', '$500'];
  return(
    <div className='flex flex-col items-center'>
      <Input 
        type="number" 
        placeholder="Enter amount" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        className="mt-5 hidescroll   p-2 border text-center h-32 w-32 text-3xl font-bold  border-purple-500 rounded-3xl bg-gray-900 text-white hover:text-black"
      />


      {/* Default Picks */}
      <div className="grid grid-cols-4 w-full p-2  gap-2 mt-3">
        {defualtAmounts.map((a, i) => (
          <div 

            key={i} 
            className=" first:col-span-4 last:col-span-4 col-span-2 bg-purple-500 h-12  hover:bg-purple-600 p-2 rounded-full text-center font-bold flex items-center justify-center cursor-pointer"
            onClick={() => setAmount(a.replace('$', ''))}
          >
            {a}
          </div>
        ))}
        </div>

      {/* Submit button */}
      <Button className="mt-3 w-64 bg-purple-500 border-none  hover:bg-purple-600" onClick={handlePayment}>
        Convert
      </Button>
      <p className='text-white text-xs font-light'>{user.uid}</p>
    </div>
  )
}

const StripeCheckOut = ({amount = 0}) => {
  const stripePromise = loadStripe('pk_live_51QtwiNE6fKYILQlPR33shxOMzEtQc7UWrbO1lVWVmZayNEZ43ZZdaBx6jfDHl244IevVSVgpQoLTzngvdsypte9I00jFSJ8Jt0')

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await fetch("/api/Checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, name: "test", email: "test@gmail.com", phone: "9999999999" }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch client secret");
  
      const data = await response.json();
      if (!data.clientSecret) throw new Error("No client secret returned");
  
      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      return null;
    }
  }, []);

  const options = {fetchClientSecret};



  const handleSubmit = async (e) => {
  /* 
  
    const handleSubmit = async (e) => {
    setPaymentComplete(true)
    e.preventDefault();
    if (!validateForm()) return;
    if(formData?.userName){
      const userNameTaken = await addUniqueUsername(formData?.userName)
      if(!userNameTaken){
        showError('Username already exists!');
        return;
      }
    }
  
  */
    }

  return (
    <div className="mt-16 mb-20 rounded-3xl border w-full md:w-1/2 lg:w-1/3 border-purple-500 border-dashed p-4">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ ...options, onComplete: handleSubmit }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}