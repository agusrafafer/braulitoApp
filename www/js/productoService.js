/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('productoService', function($http, $q, wsFactory) {

    this.productos = function() {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.producto')
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.registrar = function(nombre, codigo, precio, fechaVto, cantidad, proveedores) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        //$http.post(wsFactory.url + '/com.agura.datos.producto', {nombre: nombre, codigo: codigo, precio: precio, fechaVto: fechaVto, cant: cantidad, proveedores: proveedores})
        var parametros = nombre + 'çç' + codigo + 'çç' + precio + 'çç' + fechaVto.getTime() + 'çç' + cantidad + 'çç' + proveedores;
        $http.get(wsFactory.url + '/com.agura.datos.producto/reg/' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.modificar = function(idProducto, nombre, codigo, precio, fechaVto, cantidad, proveedores) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        //$http.post(wsFactory.url + '/com.agura.datos.producto/edit', {idProducto: idProducto, nombre: nombre, codigo: codigo, precio: precio, fechaVto: fechaVto, cant: cantidad, proveedores: proveedores})
        var parametros = idProducto + 'çç' + nombre + 'çç' + codigo + 'çç' + precio + 'çç' + fechaVto.getTime() + 'çç' + cantidad + 'çç' + proveedores;
        $http.get(wsFactory.url + '/com.agura.datos.producto/edit/' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.eliminar = function(idProducto) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        //$http.post(wsFactory.url + '/com.agura.datos.producto/del', {idProducto: idProducto})
        $http.get(wsFactory.url + '/com.agura.datos.producto/del/' + idProducto)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.buscar = function(texto) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.producto/buscar/' + texto)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

});


