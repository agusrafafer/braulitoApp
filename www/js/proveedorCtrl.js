/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function proveedorCtrl($scope, usuarioFactory, proveedorFactory, proveedorService) {

    $scope.crearModalEnRunTime = function() {
        var elm = $("<ons-modal var=modal><ons-icon icon='ion-load-c' spin='true'></ons-icon><br><br>Aguarde...</ons-modal>");
        elm.appendTo($("body"));
        ons.compile(elm[0]);
    };

    $scope.isLogueado = function() {
        if (typeof (usuarioFactory.usuario) === "undefined")
            return false;
        if (usuarioFactory.usuario === "") {
            return false;
        }
        return true;
    };

    $scope.proveedores = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        proveedorService.proveedores()
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        proveedorFactory.items = data.contenido;
                        $scope.modal.hide();
                        $scope.app.navigator.resetToPage('proveedores.html');
                    } else {
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    $scope.modal.hide();
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
                    });
                });
    };


    $scope.getProveedores = function() {
        return proveedorFactory.items;
    };

    $scope.getProveedorSeleccionado = function() {
        return proveedorFactory.seleccionado;
    };

    $scope.editarVer = function(index) {
        proveedorFactory.seleccionado = proveedorFactory.items[index];
        $scope.app.navigator.pushPage('proveedoresAM.html');
    };

    $scope.validarEdicion = function() {
        if (proveedorFactory.seleccionado.idProveedor !== 0) {
            //Estoy modificando
            proveedorService.modificar(proveedorFactory.seleccionado.idProveedor, proveedorFactory.seleccionado.proveedor, proveedorFactory.seleccionado.telefono, proveedorFactory.seleccionado.domicilio)
                    .then(function(data) {
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #25a6d9\">Proveedor modificado con exito</strong>',
                                callback: function() {
                                    $scope.proveedores();
                                }
                            });
                        } else {
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                            });
                        }
                    })
                    .catch(function(data, status) {
                        var mensaje = "No autorizado.";
                        switch (status) {
                            case 401:
                                mensaje = "No autorizado.";
                                break;
                        }
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                        });
                    });
        } else {
            //Estoy guardando
            proveedorService.registrar(proveedorFactory.seleccionado.proveedor, proveedorFactory.seleccionado.telefono, proveedorFactory.seleccionado.domicilio)
                    .then(function(data) {
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #25a6d9\">Proveedor registrado con exito</strong>',
                                callback: function() {
                                    $scope.proveedores();
                                }
                            });
                        } else {
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                            });
                        }
                    })
                    .catch(function(data, status) {
                        var mensaje = "No autorizado.";
                        switch (status) {
                            case 401:
                                mensaje = "No autorizado.";
                                break;
                        }
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                        });
                    });
        }
    };

    $scope.atrasEdicion = function() {
        $scope.proveedores();
    };

    $scope.adelanteEdicion = function() {
        var objStr = "{\"idProveedor\" : 0, \n\
                \"proveedor\" : \"\", \n\
                \"fechaAlta\" : \"\", \n\
                \"telefono\" : \"\", \n\
                \"domicilio\" : \"\", \n\
                \"marcaCollection\" : [ ]}";
        proveedorFactory.seleccionado = JSON.parse(objStr);

        $scope.app.navigator.pushPage('proveedoresAM.html');
    };
    
    $scope.promptBuscar = function() {
        $scope.ons.notification.prompt({
            title: 'Info',
            message: "Buscar...",
            callback: function(texto) {
                $scope.buscar(texto);
            }
        });
    };
    
    $scope.buscar = function(texto) {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        proveedorService.buscar(texto)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        proveedorFactory.items = data.contenido;
                        $scope.modal.hide();
                        //Array.prototype.push.apply(publicacionFactory.items, data.contenido);
                    } else {
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    $scope.modal.hide();
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
                    });
                });
    };

    $scope.eliminar = function() {
        $scope.crearModalEnRunTime();

        $scope.ons.notification.confirm({
            message: '¿Seguro desea eliminar ese proveedor?',
            buttonLabels: ['No', 'Si'],
            title: 'Info',
            callback: function(idx) {
                switch (idx) {
                    case 0:
                        // Presiono No
//                        $scope.modal.hide();
                        break;
                    case 1:
                        // Presiono Si
                        $scope.modal.show();
                        var idProveedor = proveedorFactory.seleccionado.idProveedor;

                        proveedorService.eliminar(idProveedor)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idDevuelto = data.contenido;
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            messageHTML: '<strong style=\"color: #25a6d9\">Proveedor eliminado con exito</strong>',
                                            callback: function() {
                                                $scope.proveedores();
                                            }
                                        });
                                    } else {
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                                        });
                                    }
                                })
                                .catch(function(data, status) {
                                    $scope.modal.hide();
                                    var mensaje = "No autorizado.";
                                    switch (status) {
                                        case 401:
                                            mensaje = "No autorizado.";
                                            break;
                                    }
                                    $scope.ons.notification.alert({
                                        title: 'Info',
                                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
                                    });
                                });
                        break;
                }
            }
        });
    };

}

Onsen.controller('proveedorCtrl', function($scope, usuarioFactory, proveedorFactory, proveedorService) {
    proveedorCtrl($scope, usuarioFactory, proveedorFactory, proveedorService);
});



