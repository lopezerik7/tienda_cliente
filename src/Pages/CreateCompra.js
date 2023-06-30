import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { show_alerta } from '../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Contants from '../constants';

import Cookies from "universal-cookie";
import MyNavBar from '../components/MyNavBar';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Router, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const cookies = new Cookies();

const CreateCompra = () => {
    const [details, setDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(()=>{
      if (!cookies.get('token')) {
        window.location.href = '/';
      }
      getProducts();
    }, []);

    const getProducts = async () => {
      const respuesta = await axios.get(Contants.url+'api/product/getall');
      setProducts(respuesta.data.data);
  }

  const addProductToCart = (productId)=>{
    let quantity = parseInt(document.getElementById('quantity'+productId).value);

    if (!quantity) {
      toast.error('Agregue la cantidad a comprar');
      return;
    }
    let result = details.find(detail => detail.product.id === productId);
    let product = products.find(product => product.id === productId);

    let detalles = details;

    if (result === undefined) {  
      detalles.push({productid: product.id, product: product, quantity: quantity, total: quantity*product.salePrice });
    } else {
      let index = detalles.findIndex(detail => detail.product.id === productId);
      detalles[index].quantity =quantity;
      detalles[index].total =quantity*product.salePrice;
    }
    
    let valorTotal = 0;
    detalles.forEach(element => {
      valorTotal+= element.total;
    });
    setDetails(detalles);
    setTotal(valorTotal);
    toast.success('Se agregó el producto '+product.name+' al carrito.', {duration: 3000});
  }

  const addRemoveProduct = (productId, add = true)=>{
    let detalles = details;
    let index = detalles.findIndex(detail => detail.product.id === productId);
    if (add === true) {
      detalles[index].quantity += 1;
      detalles[index].total =detalles[index].quantity*detalles[index].product.salePrice;
    } else {
      detalles[index].quantity -= 1;

      if (detalles[index].quantity === 0) {
        detalles = detalles.filter(obj => obj.product.id !== productId);
        toast.success('Se eliminó el producto del carrito.');
      }else{
        detalles[index].total =detalles[index].quantity*detalles[index].product.salePrice;
      }
    }
    
    let valorTotal = 0;
    detalles.forEach(element => {
      valorTotal+= element.total;
    });
    setDetails(detalles);
    setTotal(valorTotal);
  }

  const navigate = useNavigate();

  const enviarSolicitud = async ()=>{
    if(details.length === 0){
      show_alerta('No ha agregado productos al carrito.', 'warning');
      return;
    }
      await axios({method: 'POST', url: Contants.url+'api/sale/addsale', data: {
        userid: cookies.get('id'),
        details: details
      }, headers: {"Authorization" : `Bearer ${cookies.get('token')}`} }).then(function(response){
        show_alerta('Compra creada exitosamente.', 'success');
        
        navigate('/compras', { replace: true });
      }).catch(function(error){
        show_alerta(error.response.data.message, 'error');
        console.log(error);
      });
  }

  const validateQuantity = (productId, stock)=>{
    let e = document.getElementById('quantity'+productId);
    if(e.value>stock){
      e.value = stock;
      toast('Cantidad máxima para este producto es '+stock, {icon: '⚠'});
    }else if(e.value<0){
      e.value = 1;
      toast('Cantidad mínima es 1', {icon: '⚠'});
    }
  }

  return (
    <div className='App'>
      
      <MyNavBar></MyNavBar>
      <div className='container text-start'>
      <h3><i className='fa-solid fa-arrow-left' onClick={()=>window.history.back()}></i> Nueva compra</h3>
        <div className='mt-3'>
        <Form>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          <b>Cliente:</b>
        </Form.Label>
        <Col sm="10">
          <Form.Control plaintext readOnly value={cookies.get('name')} />
        </Col>
        <Form.Label column sm="2">
          <b>Correo electronico:</b>
        </Form.Label>
        <Col sm="10">
          <Form.Control plaintext readOnly value={cookies.get('email')} />
        </Col>
        <Form.Label column sm="2">
          <b>Total a pagar:</b>
        </Form.Label>
        <Col sm="10">
          <Form.Control plaintext readOnly value={'$ '+(total.toFixed(2))} className='fw-bold h5'/>
        </Col>
      </Form.Group>
      </Form>
        </div>
        <div className='d-flex justify-content-between'>
          <h3><i className='fa-solid fa-cart-shopping'></i> Carrito</h3>
              <button className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modalProductsCarrito'><i className='fa-solid fa-circle-plus'></i> Agregar producto al carrito</button>
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
                      <th>CANTIDAD</th>
                      <th>PRECIO</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className='tblae-group-divider'>
                    {
                      details.map((detalle, i)=>(
                        <tr key={i}>
                          <td>{i+1}</td>
                          <td>{detalle.product.name}</td>
                          <td>{detalle.product.description}</td>
                          <td><i className='fa-solid fa-minus' style={{color: "red"}} onClick={()=>addRemoveProduct(detalle.product.id, false)}></i> {detalle.quantity} <i className='fa-solid fa-plus' style={{color: "green"}} onClick={()=>addRemoveProduct(detalle.product.id, true)}></i></td>
                          <td>$ {detalle.product.salePrice.toFixed(2)}</td>
                          <td>$ {detalle.total.toFixed(2)}</td>
                        </tr>
                      ))
                    }
                    { details.length === 0?<tr><td colSpan='6' className='text-center'>Carrito vacío</td></tr>:'' }
                  </tbody>
                </table>
              </div>
            </div>
        </div>
        <div>
          <Button variant='success' size="lg" onClick={()=>enviarSolicitud()}><i className='fa-solid fa-paper-plane'></i> Enviar</Button>
        </div>
      </div>
      <div id='modalProductsCarrito' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>Agregar productos a la compra</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id'></input>
              <div className='table-responsive'>
                <table className='table table-bordered table-striped'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PRODUCTO</th>
                      <th>DESCRIPCIÓN</th>
                      <th className='text-center'>DISPONIBLES</th>
                      <th>CANTIDAD A COMPRAR</th>
                      <th>PRECIO</th>
                      <th>ACCION</th>
                    </tr>
                  </thead>
                  <tbody className='table-group-divider'>
                    {
                      products.map((product, i)=>(
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td className={product.stock===0?'text-danger text-center':'text-center'}>{product.stock}</td>
                          <td><input type='number' className='form-control' placeholder='Cantidad' id={'quantity'+product.id} disabled={product.stock===0?true:false} max={product.stock} min='1' onChange={()=>validateQuantity(product.id, product.stock)}></input></td>
                          <td>${product.salePrice.toFixed(2)}</td>
                          <td><Button className='btn btn=primary' disabled={product.stock===0?true:false} onClick={()=>addProductToCart(product.id)}><i className='fa-solid fa-plus'></i> Agregar</Button></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' aria-label='Close' id='btnCerrar'><i className='fa-solid fa-close'></i> Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCompra