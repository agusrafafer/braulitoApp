/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('pedidoService', function($http, $q, wsFactory) {

    this.pedidos = function() {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.pedido')
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.registrar = function(idCliente, detalles, idUsuLogueado, total) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        var parametros = idCliente + 'çç' + detalles + 'çç' + idUsuLogueado + 'çç' + total;
        $http.get(wsFactory.url + '/com.agura.datos.pedido/reg/' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.modificar = function(idPedido, idCliente, detalles, idUsuLogueado, total) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        //$http.post(wsFactory.url + '/com.agura.datos.producto/edit', {idProducto: idProducto, nombre: nombre, codigo: codigo, precio: precio, fechaVto: fechaVto, cant: cantidad, proveedores: proveedores})
        var parametros = idPedido + 'çç' + idCliente + 'çç' + detalles + 'çç' + idUsuLogueado + 'çç' + total;
        $http.get(wsFactory.url + '/com.agura.datos.pedido/edit/' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.eliminar = function(idPedido) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.pedido/del/' + idPedido)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.buscar = function(idPedido, estado, fechaIni, fechaFin, pagIni, pagTam) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;
        if (idPedido === '') {
            idPedido = '%20';
        }
        if (estado === '') {
            estado = '%20';
        }
        if (fechaIni === '' || fechaIni === null) {
            fechaIni = '%20';
        } else {
            fechaIni = (fechaIni.getFullYear() + '-'
                    + ('0' + (fechaIni.getMonth() + 1)).slice(-2)
                    + '-' + ('0' + (fechaIni.getDate())).slice(-2));
        }
        if (fechaFin === '' || fechaFin === null) {
            fechaFin = '%20';
        } else {
            fechaFin = (fechaFin.getFullYear() + '-'
                    + ('0' + (fechaFin.getMonth() + 1)).slice(-2)
                    + '-' + ('0' + (fechaFin.getDate())).slice(-2));
        }

        $http.get(wsFactory.url + '/com.agura.datos.pedido/buscar/' + idPedido + '/' + estado + '/' + fechaIni + '/' + fechaFin + '/' + pagIni + '/' + pagTam)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.cobrar = function(idPedido, cobro) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        var parametros = idPedido + 'çç' + cobro;
        $http.get(wsFactory.url + '/com.agura.datos.pedido/gain/' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

});


