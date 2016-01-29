/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('usuarioService', function($http, $q, wsFactory) {

    this.validarLogin = function(login, password) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        //$http.post(wsFactory.url + '/com.agura.datos.usuario/login', {usuario: login, clave: password})
        $http.get(wsFactory.url + '/com.agura.datos.usuario/login/' + login + '/' + password)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.registrarConfig = function(porcBuen, porcReg, porcMalo) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        var parametros = porcBuen + 'çç' + porcReg + 'çç' + porcMalo;
        $http.get(wsFactory.url + '/com.agura.datos.usuario/regConfig/' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

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

    this.redondearNumero = function(numero) {
        var decimals = 2;
        decimals = Math.pow(10, decimals);

        var intPart = Math.floor(numero);
        var fracPart = (numero % 1) * decimals;
        fracPart = fracPart.toFixed(0);

        if (fracPart > 50) {
            intPart += 1;
        }

        return intPart;
    };

});

