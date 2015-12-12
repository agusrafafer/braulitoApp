/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('proveedorService', function($http, $q, wsFactory) {
    
    this.proveedores = function() {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/com.agura.datos.proveedor')
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.registrar = function(nombre, telefono, domicilio) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/com.agura.datos.proveedor', {nombre: nombre, telefono: telefono, domicilio: domicilio})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.modificar = function(idProveedor, nombre, telefono, domicilio) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/com.agura.datos.proveedor/edit', {idProveedor:idProveedor, nombre: nombre, telefono: telefono, domicilio: domicilio})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.eliminar = function(idProveedor) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/com.agura.datos.proveedor/del', {idProveedor: idProveedor})
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

        $http.get(wsFactory.url + '/com.agura.datos.proveedor/buscar/' + texto)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
});


