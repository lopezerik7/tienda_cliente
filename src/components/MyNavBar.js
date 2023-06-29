import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import Cookies from "universal-cookie";

const cookies = new Cookies();

function MyNavBar() {
  const navigate = useNavigate();
    const cerrarSesion = ()=>{
      if(cookies.get('token')){
        cookies.remove('id', { path: '/' });
        cookies.remove('roleId', { path: '/' });
        cookies.remove('roleNombre', { path: '/' });
        cookies.remove('name', { path: '/' });
        cookies.remove('email', { path: '/' });
        cookies.remove('token', { path: '/' });
        window.location.href = './';
      }else{
        navigate('/login', { replace: true });
      }
    }
    const location = useLocation();
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#">Tienda</Navbar.Brand>
        
        <Nav className='me-auto'>
        <LinkContainer to='/'>
          <Nav.Link href="#" className={location.pathname === '/home'?'active':''}>Inicio</Nav.Link>
        </LinkContainer>
        <LinkContainer to='/products'>
          <Nav.Link href="#" className={location.pathname === '/products'?'active':''}>Productos</Nav.Link>
        </LinkContainer>
        <LinkContainer to='/compras' className={cookies.get('token')?'':'d-none'}>
        <Nav.Link href="#" className={location.pathname === '/compras' || location.pathname === '/compras/nueva-compra' ?'active':''}>Compras</Nav.Link>
        </LinkContainer>
        </Nav>
        {/* <Nav className="me-auto">
            <Nav.Link href="/products" className={location.pathname === '/products'?'active':''}>Productos</Nav.Link>
            <Nav.Link href="/compras" className={location.pathname === '/compras' || location.pathname === '/compras/nueva-compra' ?'active':''}>Compras</Nav.Link>
        </Nav> */}

            {/* <NavLink className={(navData) => (navData.isActive ? "active" : '')} to="./products">Productos</NavLink>
            <NavLink className={(navData) => (navData.isActive ? "active" : '')} to="./compras">Compras</NavLink> */}
        <Navbar.Brand href="#" onClick={()=>cerrarSesion()}>{ cookies.get('token')?'Cerrar sesión':'Iniciar sesión' } </Navbar.Brand>
        {/* <Navbar.Link onClick={()=>alert('hola')} href="#"></Navbar.Link> */}
      </Container>
    </Navbar>
  );
}

export default MyNavBar;