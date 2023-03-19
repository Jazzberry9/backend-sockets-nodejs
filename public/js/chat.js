// referencias
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const users = document.querySelector('#users');
const idMensajes = document.querySelector('#idMensajes');
const btnSalir = document.querySelector('#btnSalir');

let usuario = null;
let socket  = null;

const validarJWT = async () => {
    // validar de local store
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error(' No hay Token en el servidor') 
    }

    const resp = await fetch('http://localhost:8080/api/auth', {
        headers : { 'x-token' : token }
    })
    const { usuario: userX, token: tokenX } = await resp.json();
    localStorage.setItem('token', tokenX);
    usuario = userX;
    document.title = usuario.nombre;

    await empezarSockets();
}

const empezarSockets = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    // conectado
    socket.on('connect', () =>{
        console.log('conectao');
    })
    // desconectado
    socket.on('disconnect', () =>{
        console.log('disconectao');
    })
    // recibiendo mensajes
    socket.on('recibir-mensaje', printMensajes);
    socket.on('usuarios-activos', printUsuarios);

    socket.on('mensaje-privado', (payload) =>{
        console.log('payload info', payload);
    })
}

const printUsuarios= ( usuarios = [] ) => {
    let ususariosHtml = '';

    usuarios.forEach( ({nombre, uid}) => {

        ususariosHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });
    users.innerHTML = ususariosHtml;
}

const printMensajes= ( mensajes = [] ) => {
    let mensajesHtml = '';

    mensajes.forEach( ({nombre, mensaje}) => {
        
    const time = new Date();
    const tiempo = time.getHours() + ':' + time.getMinutes();
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-muted">${tiempo} - </span>
                    <span class="text-primary">${nombre}:</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    idMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode})=>{
    
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    
    // validando cuando el cliente presione enter
    if ( keyCode !== 13){
        return;
    }
    if ( mensaje.length === 0){
        return;
    }
    
    socket.emit('enviar-mensaje', {mensaje, uid})
    txtMensaje.value = '';
})

const main = async () => {

    // validar jwt
    await validarJWT();

    

}

main();





 