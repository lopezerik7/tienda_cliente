import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { show_alerta } from '../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Contants from '../constants';

import Cookies from "universal-cookie";
import MyNavBar from '../components/MyNavBar';
const cookies = new Cookies();

const ShowProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(()=>{
      if (!cookies.get('token')) {
        window.location.href = './';
      }
      getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(Contants.url+'api/product/getall');
        console.log(respuesta);
        setProducts(respuesta.data.data);
    }

  return (
    <div className='App'>
      <MyNavBar></MyNavBar>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={()=>openModal(1)} className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalProducts'><i className='fa-solid fa-circle-plus'></i> Nuevo producto</button>
            </div>
          </div>
          <div className='col'></div>
          <div className='col-md-4'>
            <div className='d-grid mx-auto'>
            <input onKeyUp={(event)=>sarchProducts(event)} className='form-control' placeholder='Buscar por nombre'></input>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
              <div className='table-responsive'>
                <table className='table table-bordered table-striped'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PRODUCTO</th>
                      <th>DESCRIPCIÓN</th>
                      <th>PRECIO DE COMPRA</th>
                      <th>PRECIO DE VENTA</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className='tblae-group-divider'>
                    {
                      products.map((product, i)=>(
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>${new Intl.NumberFormat('es-sv').format(product.purchasePrice)}</td>
                          <td>${new Intl.NumberFormat('es-sv').format(product.salePrice, 2)}</td>
                          <td>
                            <button onClick={()=>openModal(2, product.id, product.name, product.description, product.purchasePrice, product.salePrice, product.stock)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                              <i className='fa-solid fa-edit'></i>
                            </button>
                            <button onClick={()=>deleteProduct(product.id, product.name)} className='btn btn-danger'>
                              <i className='fa-solid fa-trash'></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
      <div id='modalProducts' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id'></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-pencil'></i></span>
                <input type='text' id='name' className='form-control' placeholder='Nombre' value={name}onChange={(e)=>setName(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-info'></i></span>
                <input type='text' id='description' className='form-control' placeholder='Descripción' value={description} onChange={(e)=>setDescription(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='number' id='purchasePrice' className='form-control' placeholder='Precio de compra' value={purchasePrice} onChange={(e)=>setPurchasePrice(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                <input type='number' id='salePrice' className='form-control' placeholder='Precio de venta' value={salePrice} onChange={(e)=>setSalePrice(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-box'></i></span>
                <input type='number' id='stock' className='form-control' placeholder='Stock' value={stock} onChange={(e)=>setStock(e.target.value)}></input>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' aria-label='Close' id='btnCerrar'><i className='fa-solid fa-close'></i> Cancelar</button>
              <button type='button' className='btn btn-success' onClick={()=>validarFormulario()}><i className='fa-solid fa-save'></i> Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowProducts