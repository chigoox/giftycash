'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button, Input, Modal } from 'antd';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import  app  from '../Firebase';
import { useRouter } from 'next/navigation';
import Stripe from 'stripe';

import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Home() {
  const [amount, setAmount] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({ userName: '', fullName: '', phone: '', email: '' });
  const router = useRouter();
  const [steps, setSteps] = useState(1)

  

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <motion.h1 
        className="text-4xl font-bold text-purple-400"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        GiftyCash
      </motion.h1>
      {steps == 1 && <InputSendAmount amount={amount} setAmount={setAmount} setSteps={setSteps}  />}
      {true && <StripeCheckOut amount={amount}/>}
      <motion.div 
        className="fixed bottom-6 right-6 bg-purple-500 p-3 rounded-full cursor-pointer"
        onClick={() => setModalOpen(true)}
        whileHover={{ scale: 1.1 }}
      >
        +
      </motion.div>

      <Modal
  title="Register"
  open={modalOpen}
  onCancel={() => setModalOpen(false)}
  footer={null}
  style={{
    borderRadius: '12px', // Rounded corners for the modal
    padding: '20px', // Add padding for spacing
  }}
>
  <SignUp/>
</Modal>

    </div>
  );
}




const SignUp = () => {
  const handleRegister = async () => {
    const { email, fullName, phone, userName } = userData;
    if (!email) return;
    
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, { userName, fullName, phone, email });
      setModalOpen(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUserData(prev => ({ ...prev, email: result.user.email }));
  };


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

    <Button
      className="mt-3"
      onClick={handleRegister}
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
      Submit
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
      Sign in with Google
    </Button>
  </div>
  )
}


const InputSendAmount = ({amount, setAmount, setSteps}) => {
  
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
        className="mt-5  p-2 border text-center h-32 w-32 text-3xl font-bold  border-purple-500 rounded-3xl bg-gray-900 text-white"
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
        Send Payment
      </Button>
    </div>
  )
}

const StripeCheckOut = ({amount = 0}) => {
console.log(process.env.NEXT_PUBLIC_STRIPE_KEY)
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

 const fetchClientSecret = useCallback(() => {
  // Create a Checkout Session
  return fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the correct header for JSON payload
    },
    body: JSON.stringify({ amount }), // Stringify the amount object
  })
    .then((res) => res.json())
    .then((data) => data.clientSecret); // Return the clientSecret
}, [amount]);2

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}