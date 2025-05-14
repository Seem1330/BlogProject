import React, { useEffect, useState } from 'react';
import './App.css'
import { useDispatch } from 'react-redux';
import  authService  from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Footer, Header } from './Components/index.js';
import { Outlet } from 'react-router-dom'


function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({userData}));
        } else {
          dispatch(logout());
        }
      }).finally(() => setLoading(false))
  }, [])

  // if (loading) {
  //   return (
  //     <>
  //       <h1> Loading.... </h1>
  //     </>
  //   )
  // } else {
  //   return (
  //     <>
  //       <h1> A blog app with Appwrite </h1>
  //       <h2> Welcome to the blog app </h2>
  //     </>
  //   )
  // }

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full-block'>
        <Header/>
      <main>
       TODO: <Outlet/>
      </main>
      <Footer/>
        </div>
        </div>
  ) : null

}
export default App
