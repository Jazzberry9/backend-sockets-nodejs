const miForm = document.querySelector('form');

miForm.addEventListener('submit', e =>{
    e.preventDefault();

    const formData = {};

    for( let el of miForm.elements){
        if (el.name.length > 0){
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.error(msg);
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html'
    })
    .catch(err => console.log(err))
})

function handleCredentialResponse(response) {

    // Google Token: ID_Token
    // console.log('ID TOKEN', response.credential);
    const body = { id_token: response.credential} // Esto es lo que regresa de google, saved in 

    fetch('http://localhost:8080/api/auth/google',{
        method: 'POST', // el fetch es un get, esto lo transforma a post junto con headers.
        headers: {
            'Content-Type':'application/json' // para decir que estamos mandando un json
        },
        body: JSON.stringify(body) // esto pq tiene que estar serializado el body
    })
        .then(resp => resp.json()) // el readable string
        .then( ({token}) =>{ // Esta es la respuesta del servidor.
            localStorage.setItem('token', token);
            window.location = 'chat.html';
            // localStorage.setItem('email', datos.usuario.correo)
        })
        .catch(console.warn) // Que salga el error si algo sale mal
    }

    const button = document.getElementById('googleSignOut');
    button.onclick = () => {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke( localStorage.getItem( 'token'), done =>{
            localStorage.clear();
            // location.reload();
        } ) ;
}

