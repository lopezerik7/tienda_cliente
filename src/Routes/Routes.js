import React from 'react';
import { BrowserRouter, Route, Routes as Rutas } from 'react-router-dom';
import Login from '../Pages/Login';
import ShowProducts from '../Pages/ShowProducts';

function Routes(){
    return (
        <BrowserRouter>
            <Rutas>
            <Route path='/products' element={<ShowProducts></ShowProducts>}></Route>
            <Route path='/' element={<Login />}></Route>
            </Rutas>
        </BrowserRouter>
    );
}

export default Routes;