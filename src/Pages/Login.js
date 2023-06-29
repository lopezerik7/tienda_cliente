import { Component } from "react";

import * as Contants from '../constants';
import axios from "axios";
import { show_alerta } from "../functions";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Login extends Component {
    state = {
        form: {
            email: '',
            password: ''
        }
    }
    handleChange = async e=>{
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    iniciarSesion = async ()=>{
        if(this.state.form.email.trim() === '' || this.state.form.password.trim() === ''){
            show_alerta('Ingrese su correo y contraseña', 'warning');
            return;
        }
        await axios({method: 'POST', url: Contants.url+'api/user/auth', data: {
            "email": this.state.form.email,
            "password": this.state.form.password
        } }).then(function(response){
            return response;
          }).then(function(response){
            if (response.data.token !== undefined) {
                let data = response.data;
                cookies.set('id', data.data.id);
                cookies.set('roleId', data.data.role.id);
                cookies.set('roleNombre', data.data.role.name);
                cookies.set('name', data.data.name);
                cookies.set('email', data.data.email);
                cookies.set('token', data.token);
                window.location.href = './';
            }else{
                show_alerta('No puedo iniciar sesión.','error');
            }
          }).catch(function(error){
            console.log(error, 'catch');
            if (error.response.status === 401) {
                show_alerta('Credenciales incorrectas.','error');
            }else{
                show_alerta('Hubo un error en la solicitud.','error');
            }
            console.log('ERROR');
          });
    }

    componentDidMount(){
        if (cookies.get('token')) {
            window.location.href = './home';
        }
    }

    render(){
        return (
            <div className="container vh-100 d-flex h-100 justify-content-center align-items-center">
                
                <div className="w-25 text-center">
                <h2>
                    Iniciar sesion
                </h2><br></br><br></br>
                <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-pencil'></i></span>
                <input type='text' id='email' name='email' className='form-control' placeholder='Correo' onChange={this.handleChange}></input>
                </div>
                <br></br>
                <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-pencil'></i></span>
                <input type='text' id='password' name='password' className='form-control' placeholder='Contraseña' onChange={this.handleChange}></input>
                </div>
                <br></br>
                <button className="btn btn-primary" onClick={()=>this.iniciarSesion()}><i className="fa-solid fa-login"></i> Iniciar sesión</button>
            </div>
            </div>
        );
    }
}

export default Login;