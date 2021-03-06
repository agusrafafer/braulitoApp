/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.factory('usuarioFactory', function() {
    return {
        usuario: "",
        tituloMenu: "Braulito App"
    };
});

Onsen.factory('clienteFactory', function() {
    return {
        items: [],
        seleccionado: "",
        textoBuscado: ""
    };
});

Onsen.factory('proveedorFactory', function() {
    return {
        items: [],
        seleccionado: "",
        textoBuscado: "",
        proveedoresSel: []
    };
});

Onsen.factory('productoFactory', function() {
    return {
        items: [],
        seleccionado: "",
        textoBuscado: ""
    };
});

Onsen.factory('tipoClienteFactory', function() {
    return {
        items: [],
        seleccionado: ""
    };
});

Onsen.factory('pedidoFactory', function() {
    return {
        items: [],
        seleccionado: "",
        pedidoBuscado: {
            idPedido: "",
            fechaIni: "",
            fechaFin: "",
            estado: ""
        },
        detallesSel: [],
        clienteSel: "",
        vieneDePedido: 0
    };
});

Onsen.factory('configFactory', function() {
    return {
        config: {
            porcenBuen: 0.0,
            porcenRegu: 0.0,
            porcenMalo: 0.0
        }
    };
});


Onsen.factory('wsFactory', function() {
    return {
        url: "http://braulito-agura.rhcloud.com/braulito/webresources",
        urlImpReporte: "http://braulito-agura.rhcloud.com/braulito/ImpresorReporte"
        //url: "http://localhost:8084/braulito/webresources",
        //urlImpReporte: "http://localhost:8084/braulito/ImpresorReporte"
    };
});

