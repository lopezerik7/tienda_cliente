import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Cookies from "universal-cookie";

const cookies = new Cookies();

function MyNavBar() {
    const cerrarSesion = ()=>{
        cookies.remove('id', { path: '/' });
        cookies.remove('roleId', { path: '/' });
        cookies.remove('roleNombre', { path: '/' });
        cookies.remove('name', { path: '/' });
        cookies.remove('email', { path: '/' });
        cookies.remove('token', { path: '/' });
        window.location.href = './';
    }
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="./products">Inicio</Navbar.Brand>
        <Navbar.Brand onClick={()=>cerrarSesion()} href="#">Cerrar sesión</Navbar.Brand>
        {/* <Navbar.Link onClick={()=>alert('hola')} href="#"></Navbar.Link> */}
      </Container>
    </Navbar>
  );
}

export default MyNavBar;