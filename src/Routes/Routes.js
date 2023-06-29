import React from 'react';
import { BrowserRouter, Route, Routes as Rutas } from 'react-router-dom';
import Login from '../Pages/Login';
import ShowProducts from '../Pages/ShowProducts';
import Compras from '../Pages/Compras';
import CreateCompra from '../Pages/CreateCompra';
import Home from '../Pages/Home';

function Routes(){
    return (
        <BrowserRouter>
            <Rutas>
            <Route path='/products' element={<ShowProducts></ShowProducts>}></Route>
            <Route path='/' element={<Home></Home>}></Route>
            <Route path='/compras' element={<Compras></Compras>}></Route>
            <Route path='/compras/nueva-compra' element={<CreateCompra></CreateCompra>}></Route>
            <Route path='/login' element={<Login />}></Route>
            </Rutas>
        </BrowserRouter>
    );
}

export default Routes;