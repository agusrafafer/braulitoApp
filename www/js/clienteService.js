/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('clienteService', function($http, $q, wsFactory) {
    
    this.clientes = function() {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.cliente')
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.tiposCliente = function() {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.tipocliente')
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.registrar = function(nombre, telefono, celular, domicilio, idTipoCliente) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/com.agura.datos.cliente', {nombre: nombre, telefono: telefono, celular: celular, domicilio: domicilio, idTipoCliente: idTipoCliente})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.modificar = function(idCliente, nombre, telefono, celular, domicilio, idTipoCliente) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/com.agura.datos.cliente/edit', {idCliente:idCliente, nombre: nombre, telefono: telefono, celular: celular, domicilio: domicilio, idTipoCliente: idTipoCliente})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.eliminar = function(idCliente) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/com.agura.datos.cliente/del', {idCliente: idCliente})
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

        $http.get(wsFactory.url + '/com.agura.datos.cliente/buscar/' + texto)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
});


