import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { show_alerta } from '../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Contants from '../constants';

import Cookies from "universal-cookie";
import MyNavBar from '../components/MyNavBar';
const cookies = new Cookies();

const Home = () => {
    
    // useEffect(()=>{
    //     if (!cookies.get('token')) {
    //       window.location.href = './';
    //     }
    //   }, []);
  return (
    <div className='App'>
      <MyNavBar></MyNavBar>
      <div className='container text-start'>
      <h3>Inicio</h3>
        <div className='row mt-3'>
         <h2>Bienvenido, {cookies.get('name')?cookies.get('name'):'invitado'}</h2>
        </div>
      </div>
    </div>
  )
}

export default Home