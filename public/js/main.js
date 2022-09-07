
function init(){
    fetch('https://primerentregablegnovatto.glitch.me/api/productos', {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            'Access-Control-Allow-Credentials': 'true'
        }
    })
        .then(response => response.json())
        .then(json => {
            if(json.error != undefined){
                alert(json.msj);
                throw new Error(json.msj);
            }
            renderProductos(json);
        })
        .catch(err => console.log(err));
}

function renderProductos(productos) {
    const cuerpoProductosHTML = productos.map((producto)=>{
        return `<tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.codigo}</td>
                    <td><img src=${producto.imagenUrl} height="50px" width="50px" alt="Imagen no disponible"></td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td><button hidden="true" id="btn_editar_producto">Editar</button></td>
                    <td><button hidden="true" id="btn_borrar_producto">Borrar</button></td>
                </tr>`
    });
    const tablaProductos = `<div class="table-responsive">
                                <table class="table table-dark">
                                    <tr style="color: yellow;"> <th>ID</th> <th>Titulo</th> <th>Precio</th> <th>Imagen</th><th>Precio</th><th>Stock</th></tr>
                                    ${cuerpoProductosHTML}
                                </table>
                            </div>`
    document.getElementById('listadoProductos').innerHTML = tablaProductos;
}

document.getElementById("btn_guardar")
    .onclick = (ev => {
    if (document.getElementById("isAdmin").checked) {
        let nuevoProducto = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            codigo: document.getElementById("codigo").value,
            imagenUrl: document.getElementById("imagenUrl").value,
            precio: document.getElementById("precio").value,
            stock: document.getElementById("stock").value
        };
        fetch('https://primerentregablegnovatto.glitch.me/api/productos', {
            method: "POST",
            body: JSON.stringify(nuevoProducto),
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "admin": true,
                'Access-Control-Allow-Credentials': 'true'
            }
        })
            .then(response => response.json())
            .then(json => {
                if(json.error != undefined){
                    alert(json.msj);
                } else {
                    alert(json.msj);
                }
                console.log(json);
                init();
            })
            .catch(err => console.log(err));
    } else {
        alert("Funcionalidad solo para administradores")
    }
});

function checkAdmin(checkbox) {
    // if (checkbox.checked){
    //     alert("lo apretaron");
    // } else {
    //     alert("deschecqued");
    // }
}

init();