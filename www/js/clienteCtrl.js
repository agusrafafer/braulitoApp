/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function clienteCtrl($scope, usuarioFactory, clienteFactory, tipoClienteFactory, clienteService, pedidoFactory) {

    $scope.trayendo = false;
    $scope.pagIni = 0;
    $scope.pagTam = 10;
    
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

    $scope.clientes = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        $scope.pagIni = 0;
        $scope.pagTam = 10;
        clienteFactory.textoBuscado = "";

        clienteService.buscar(clienteFactory.textoBuscado, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        clienteFactory.items = data.contenido;
                        $scope.modal.hide();
                        $scope.app.navigator.resetToPage('clientes.html');
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
    
    $scope.getTextoBuscado = function() {
        return clienteFactory.textoBuscado;
    };

    $scope.getClientes = function() {
        return clienteFactory.items;
    };

    $scope.getClienteSeleccionado = function() {
        return clienteFactory.seleccionado;
    };

    $scope.editarVer = function(index) {
        clienteFactory.seleccionado = clienteFactory.items[index];
        tipoClienteFactory.seleccionado = clienteFactory.seleccionado.idTipoCliente;
        $scope.app.navigator.pushPage('clientesAM.html');
    };

    $scope.getVieneDePedido = function() {
      return pedidoFactory.vieneDePedido;  
    };
    
    $scope.set1VieneDePedido = function() {
      pedidoFactory.vieneDePedido = 1;  
    };
    
    $scope.set0VieneDePedido = function() {
      pedidoFactory.vieneDePedido = 0;  
    };
    
    $scope.seleccionarClientePedido = function(index) {
      pedidoFactory.clienteSel = clienteFactory.items[index];
      $scope.app.navigator.pushPage('pedidosAM.html');
    };

    $scope.tiposCliente = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        clienteService.tiposCliente()
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        $scope.modal.hide();
                        tipoClienteFactory.items = data.contenido;
                        tipoClienteFactory.seleccionada = "";
                        var dialogo = $scope.dialogFiltroTC;
                        dialogo.show();
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

    $scope.getTiposCliente = function() {
        return tipoClienteFactory.items;
    };


    $scope.getTipoClienteSeleccionado = function() {
        return tipoClienteFactory.seleccionado;
    };

    $scope.setTipoClienteSeleccionado = function(index) {
        tipoClienteFactory.seleccionado = tipoClienteFactory.items[index];
        clienteFactory.seleccionado.idTipoCliente = tipoClienteFactory.seleccionado;
        $scope.dialogFiltroTC.hide();
    };

    $scope.validarEdicion = function() {
        var mensaje = '';

        if (tipoClienteFactory.seleccionado === '') {
            mensaje = 'Debe seleccionar un tipo de cliente';
        }


        if (mensaje !== '') {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
            });
        } else {
            if (clienteFactory.seleccionado.idCliente !== 0) {
                //Estoy modificando
                clienteService.modificar(clienteFactory.seleccionado.idCliente, clienteFactory.seleccionado.cliente, clienteFactory.seleccionado.telefono, clienteFactory.seleccionado.celular, clienteFactory.seleccionado.domicilio, clienteFactory.seleccionado.idTipoCliente.idTipoCliente)
                        .then(function(data) {
                            var respuesta = data.respuesta;
                            if (respuesta === 'OK') {
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #25a6d9\">Cliente modificado con exito</strong>',
                                    callback: function() {
                                        $scope.clientes();
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
                clienteService.registrar(clienteFactory.seleccionado.cliente, clienteFactory.seleccionado.telefono, clienteFactory.seleccionado.celular, clienteFactory.seleccionado.domicilio, clienteFactory.seleccionado.idTipoCliente.idTipoCliente)
                        .then(function(data) {
                            var respuesta = data.respuesta;
                            if (respuesta === 'OK') {
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #25a6d9\">Cliente registrado con exito</strong>',
                                    callback: function() {
                                        $scope.clientes();
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
        }
    };

    $scope.atrasEdicion = function() {
        $scope.clientes();
    };

    $scope.adelanteEdicion = function() {
        var objStr = "{\"idCliente\" : 0, \"cliente\" : \"\", \"telefono\" : \"\", \"celular\" : \"\",\n\
\"domicilio\" : \"\", \"fechaAlta\" : \"\", \"pedidoCollection\" : [ ], \"idTipoCliente\" : {}}";
        clienteFactory.seleccionado = JSON.parse(objStr);

        $scope.app.navigator.pushPage('clientesAM.html');
    };
    
    $scope.promptBuscar = function() {
        $scope.ons.notification.prompt({
            title: 'Info',
            message: "Buscar...",
            callback: function(texto) {
                clienteFactory.textoBuscado = texto;
                $scope.buscar();
            }
        });
    };
    
    $scope.buscar = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        $scope.pagIni = 0;
        $scope.pagTam = 10;
        
        clienteService.buscar(clienteFactory.textoBuscado, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        clienteFactory.items = data.contenido;
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
    
    $scope.traerMas = function() {
        $scope.trayendo = true;

        $scope.pagIni = $scope.pagTam;
        $scope.pagTam = $scope.pagTam + 10;

        clienteService.buscar(clienteFactory.textoBuscado, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    //Agrego los elementos que trae data al array items de publicacionFactory
                    Array.prototype.push.apply(clienteFactory.items, data.contenido);
                    $scope.trayendo = false;
                })
                .catch(function(data, status) {
                    $scope.trayendo = false;
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
                }).finally(function() {
        });

    };

    $scope.eliminar = function() {
        $scope.crearModalEnRunTime();

        $scope.ons.notification.confirm({
            message: '¿Seguro desea eliminar ese cliente?',
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
                        var idCliente = clienteFactory.seleccionado.idCliente;

                        clienteService.eliminar(idCliente)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idDevuelto = data.contenido;
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            messageHTML: '<strong style=\"color: #25a6d9\">Cliente eliminado con exito</strong>',
                                            callback: function() {
                                                $scope.clientes();
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

Onsen.controller('clienteCtrl', function($scope, usuarioFactory, clienteFactory, tipoClienteFactory, clienteService, pedidoFactory) {
    clienteCtrl($scope, usuarioFactory, clienteFactory, tipoClienteFactory, clienteService, pedidoFactory);
});



