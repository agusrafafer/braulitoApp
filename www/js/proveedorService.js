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

        //$http.post(wsFactory.url + '/com.agura.datos.proveedor', {nombre: nombre, telefono: telefono, domicilio: domicilio})
        var parametros = nombre + 'çç' + telefono + 'çç' + domicilio;
        $http.get(wsFactory.url + '/com.agura.datos.proveedor/reg/' + parametros)
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

        //$http.post(wsFactory.url + '/com.agura.datos.proveedor/edit', {idProveedor:idProveedor, nombre: nombre, telefono: telefono, domicilio: domicilio})
        var parametros = idProveedor + 'çç' + nombre + 'çç' + telefono + 'çç' + domicilio;
        $http.get(wsFactory.url + '/com.agura.datos.proveedor/edit/' + parametros)
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

        //$http.post(wsFactory.url + '/com.agura.datos.proveedor/del', {idProveedor: idProveedor})
        $http.get(wsFactory.url + '/com.agura.datos.proveedor/del/' + idProveedor)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.buscar = function(texto, pagIni, pagTam) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;
        if (texto === '') {
            texto = '%20';
        }

        $http.get(wsFactory.url + '/com.agura.datos.proveedor/buscar/' + texto + '/' + pagIni + '/' + pagTam)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

});


