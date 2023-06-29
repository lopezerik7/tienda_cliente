import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { show_alerta } from '../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Contants from '../constants';

import Cookies from "universal-cookie";
import MyNavBar from '../components/MyNavBar';
import moment from 'moment/moment';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

const cookies = new Cookies();

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [detalles, setDetalles] = useState([]);

    useEffect(()=>{
      if (!cookies.get('token')) {
        window.location.href = './';
      }
      getCompras();
    }, []);

    const getCompras = async () => {
        const respuesta = await axios.get(Contants.url+'api/sale/getall/'+cookies.get('id'), {headers: {Authorization: `Bearer ${cookies.get('token')}`}});
        console.log(respuesta);
        setCompras(respuesta.data.data);
    }

    const openModal = (operation, detalles) => {
      setDetalles(detalles);
  }

  return (
    <div className='App'>
      <MyNavBar></MyNavBar>
      <div className='container text-start'>
      <h3>Mis compras</h3>
        <div className='row mt-3'>
          <div className='col-md-4'>
            <div className='mx-auto'>
              <LinkContainer to='/compras/nueva-compra'>
              <Button className='btn btn-primary'><i className='fa-solid fa-circle-plus'></i> Nueva compra</Button>
              </LinkContainer>
              
            </div>
          </div>
          <div className='col'></div>
          {/* <div className='col-md-4'>
            <div className='d-grid mx-auto'>
            <input onKeyUp={(event)=>sarchProducts(event)} className='form-control' placeholder='Buscar por nombre'></input>
            </div>
          </div> */}
        </div>
        <div className='row mt-3'>
            <div className='col-12'>
              <div className='table-responsive'>
                <table className='table table-bordered table-striped'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>CLIENTE</th>
                      <th>FECHA</th>
                      <th>TOTAL</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className='tblae-group-divider'>
                    {
                      compras.map((compra, i)=>(
                        <tr key={compra.id}>
                          <td>{compra.id}</td>
                          <td>{compra.user.name}</td>
                          <td>{moment(compra.date).format('DD MMM, YYYY hh:mm a')}</td>
                          <td>${new Intl.NumberFormat('es-sv').format(compra.total)}</td>
                          <td><button onClick={()=>openModal(2, compra.details)} className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalDetails'>
                              <i className='fa-solid fa-info'></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                    { compras.length === 0?<tr><td colSpan='5' className='text-center'>Aún no hay compras</td></tr>:'' }
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
      <div id='modalDetails' className='modal fade modal-lg' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>Productos de la compra</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
            <div className='table-responsive'>
                <table className='table table-bordered table-striped'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PRODUCTO</th>
                      <th>DESCRIPCIÓN</th>
                      <th>CANTIDAD</th>
                      <th>PRECIO</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className='tblae-group-divider'>
                    {
                      detalles.map((detalle, i)=>(
                        <tr key={detalle.id}>
                          <td>{detalle.id}</td>
                          <td>{detalle.product.name}</td>
                          <td>{detalle.product.description}</td>
                          <td>{detalle.quantity}</td>
                          <td>${new Intl.NumberFormat('es-sv').format(detalle.product.salePrice, 2)}</td>
                          <td>{detalle.total}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' aria-label='Close' id='btnCerrar'><i className='fa-solid fa-close'></i> Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Compras