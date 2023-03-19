const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require('../models/mensajes');

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket, io) => {
 
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !usuario ){
        return socket.disconnect();
    }

    // agregar usuario conectado
    chatMensajes.conectarUsuario(  usuario )
    io.emit('usuarios-activos', chatMensajes.usersArray);
    io.emit('recibir-mensaje', chatMensajes.ultimos10Mensajes);

    socket.join( usuario.id );

    // limpair cuando alguien se desconecta
    socket.on('disconnect', () =>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usersArray);
    })

    // enviando mensaje
    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if ( uid ){
            // mensaje privado
            socket.to( uid ).emit('mensaje-privado', {de: usuario.nombre, mensaje})
        } else {
            // ese id es de arriba.
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensaje', chatMensajes.ultimos10Mensajes)    
        }
        
        
    })

    
}

module.exports = {
    socketController
}