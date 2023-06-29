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
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stock, setStock] = useState(0);
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(()=>{
      getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(Contants.url+'api/product/getall');
        console.log(respuesta);
        setProducts(respuesta.data.data);
    }
    const sarchProducts = async (event) => {
      if(event.keyCode !== 13){
        return;
      }
      const respuesta = await axios.get(Contants.url+'api/product/GetByName/'+event.target.value);
      console.log(respuesta);
      setProducts(respuesta.data.data);
  }
    
  const openModal = (operation, id, name, description, purchasePrice, salePrice, stock) => {
      setId('');
      setName('');
      setDescription('');
      setPurchasePrice('');
      setSalePrice('');
      setStock(0);
      setOperation(operation);
      if(operation === 1){
        setTitle('Registrar producto');
      }else if(operation === 2){
        setTitle('Editar producto');
        setId(id);
        setName(name);
        setDescription(description);
        setPurchasePrice(purchasePrice);
        setSalePrice(salePrice);
        setStock(stock);
      }
      window.setTimeout(function(){
        document.getElementById('name').focus();
      }, 500);
  }

  const validarFormulario = async ()=> {
    let parametros;
    let metodo;
    let endpoint;
    let mensaje;
    if (name.trim() === '') {
      show_alerta('Escribe el nombre del producto', 'warning');
    }else if(description.trim() === ''){
      show_alerta('Escribe la descripción del producto', 'warning');
    }else if(isNaN(parseFloat(purchasePrice))) {
      show_alerta('Escribe un precio de compra válido', 'warning');
    }else if(isNaN(parseFloat(salePrice))) {
      show_alerta('Escribe un precio de venta válido', 'warning');
    }else if(isNaN(parseInt(stock))) {
      show_alerta('Escribe un stock válido', 'warning');
    }else{
      if (operation === 1) {
        parametros = {name: name.trim(), description: description.trim(), purchasePrice: purchasePrice, salePrice: salePrice, stock: stock};
        metodo = 'POST';
        endpoint = 'api/product/addproduct';
        mensaje = 'Producto registrado exitosamente';
      }else{
        parametros = {id: id, name: name.trim(), description: description.trim(), purchasePrice: purchasePrice, salePrice: salePrice, stock: stock};
        metodo = 'PUT';
        endpoint = 'api/product/updateproduct?id='+id;
        mensaje = 'Producto actualizado exitosamente';
      }
      enviarSolicitud(metodo,parametros,endpoint, mensaje);
    }
  }

  const enviarSolicitud = async (metodo, parametros, endpoint, mensaje)=>{
    let token = cookies.get('token');
      await axios({method: metodo, url: Contants.url+endpoint, data: parametros, headers: {"Authorization" : `Bearer ${token}`} }).then(function(response){
        show_alerta(mensaje, 'success');
        document.getElementById('btnCerrar').click();
        getProducts();
      }).catch(function(error){
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }

  const deleteProduct = (id, name)=>{
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Está seguro de eliminar el producto ${name}?`,
      icon: 'question',
      showCancelButton: true, confirmButtonText: 'Sí, eliminar',cancelButtonText: 'Cancelar'
    }).then((result)=>{
      if (result.isConfirmed) {
       setId(id);
       enviarSolicitud('DELETE', {}, 'api/product/removeproduct/'+id, 'Producto eliminado exitosamente'); 
      }
    });
  }

  return (
    <div className='App'>
      <MyNavBar></MyNavBar>
      <div className='container text-start'>
      <h3>Productos</h3>
        <div className='row mt-3'>
          <div className={cookies.get('roleId')==='1'?'col-md-4':'d-none'}>
            <div className='mx-auto'>
              <button onClick={()=>openModal(1)} className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalProducts'><i className='fa-solid fa-circle-plus'></i> Nuevo producto</button>
            </div>
          </div>
          <div className='col'></div>
          <div className='col-md-4'>
            <div className=' mx-auto'>
            <input onKeyUp={(event)=>sarchProducts(event)} className='form-control' placeholder='Buscar por nombre'></input>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
            <div className='col-12'>
              <div className='table-responsive'>
                <table className='table table-bordered table-striped'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PRODUCTO</th>
                      <th>DESCRIPCIÓN</th>
                      <th className={cookies.get('roleId')==='1'?'':'d-none'}>PRECIO DE COMPRA</th>
                      <th>PRECIO DE VENTA</th>
                      <th>EXISTENCIAS</th>
                      <th className={cookies.get('roleId')==='1'?'':'d-none'}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className='tblae-group-divider'>
                    {
                      products.map((product, i)=>(
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td className={cookies.get('roleId')==='1'?'':'d-none'}>${new Intl.NumberFormat('es-sv').format(product.purchasePrice)}</td>
                          <td>${new Intl.NumberFormat('es-sv').format(product.salePrice, 2)}</td>
                          <td>{product.stock}</td>
                          <td className={cookies.get('roleId')==='1'?'':'d-none'}>
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