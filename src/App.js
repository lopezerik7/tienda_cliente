import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ShowProducts from './Pages/ShowProducts';
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function App() {
  return (
    
    // <BrowserRouter>
    //   <Routes>
    //     <Route path='/' element={<ShowProducts></ShowProducts>}></Route>
    //   </Routes>
    // </BrowserRouter>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default App;
