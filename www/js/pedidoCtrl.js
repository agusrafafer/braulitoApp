/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function pedidoCtrl($scope, usuarioFactory, usuarioService, productoFactory, productoService, pedidoFactory, pedidoService) {

    /*
     * En el modelo siempre se debe usar el operador punto
     * <input type="number"
     * name="totalPagar" placeholder="0" 
     * ng-model="cobroRecibidoPedido.valor" 
     * min="0" maxlength="5" ng-maxlength="5"> 
     */
    $scope.cobroRecibidoPedido = {
        valor: 0.00
    };

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

    $scope.pedidos = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        pedidoService.pedidos()
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        pedidoFactory.items = data.contenido;
                        $scope.modal.hide();
                        $scope.app.navigator.resetToPage('pedidos.html');
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


    $scope.getPedidos = function() {
        return pedidoFactory.items;

    };

    $scope.getPedidoSeleccionado = function() {
        return pedidoFactory.seleccionado;
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

    $scope.getClienteSel = function() {
        return pedidoFactory.clienteSel;
    };

    $scope.quitarClienteSel = function() {
        pedidoFactory.clienteSel = "";
        $scope.app.navigator.resetToPage('pedidosAM.html');
    };

    $scope.getDetallesSel = function() {
        return pedidoFactory.detallesSel;
    };

    $scope.quitarDetalleSel = function(index) {
        var idx = -1;
        for (var i = 0; i < pedidoFactory.detallesSel.length; i++) {
            if (pedidoFactory.detallesSel[i].idProducto.idProducto === pedidoFactory.detallesSel[index].idProducto.idProducto) {
                idx = i;
                break;
            }
        }
        if (idx > -1) {
            //Este codigo sirve para eliminar un elemento del array
            //pedidoFactory.productosSel.splice(idx, 1);
            pedidoFactory.detallesSel.splice(idx, 1);
        }
        $scope.app.navigator.resetToPage('pedidosAM.html');
    };

    $scope.getPrecioSugeridoProducto = function(index) {
        var precio = pedidoFactory.detallesSel[index].precioProducto;
        precio = precio + ($scope.getAumento() * precio / 100);
        precio = precio.toFixed(2);
        return precio;
    };

    $scope.getSubTotalDetPedido = function(index) {
        var subTotalDet = 0.00;
        var precio = pedidoFactory.detallesSel[index].precioProducto;
        subTotalDet = pedidoFactory.detallesSel[index].cantidad * (precio + ($scope.getAumento() * precio / 100)) + 0.00;
        subTotalDet = subTotalDet.toFixed(2);
        return subTotalDet;
    };

    $scope.getTotalPedido = function() {
        var total = 0;
        for (var i = 0; i < pedidoFactory.detallesSel.length; i++) {
            total += pedidoFactory.detallesSel[i].precioProducto * pedidoFactory.detallesSel[i].cantidad;
        }
        total = total + ($scope.getAumento() * total / 100);
        total = total.toFixed(2);
        return total;
    };

    $scope.getAumento = function() {
        var aumento = 0.0;
        if (pedidoFactory.clienteSel !== "") {
            switch (pedidoFactory.clienteSel.idTipoCliente.tipo) {
                case "Bueno":
                    aumento = 0.0;
                    break;
                case "Reg":
                    aumento = 5;
                    break;
                case "Malo":
                    aumento = 10;
                    break;
            }
        }
        return aumento;
    };

    $scope.recibirCobro = function() {
        if ($scope.cobroRecibidoPedido.valor > 0) {
            var saldo = pedidoFactory.seleccionado.total - pedidoFactory.seleccionado.cobro;
            if ($scope.cobroRecibidoPedido.valor <= saldo) {
                $scope.crearModalEnRunTime();
                $scope.modal.show();
                pedidoService.cobrar(pedidoFactory.seleccionado.idPedido, $scope.cobroRecibidoPedido.valor)
                        .then(function(data) {
                            var respuesta = data.respuesta;
                            if (respuesta === 'OK') {
                                $scope.modal.hide();
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #25a6d9\">Cobro registrado con exito</strong>',
                                    callback: function() {
                                        $scope.pedidos();
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
                                messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                            });
                        });

            } else {
                $scope.ons.notification.alert({
                    title: 'Info',
                    messageHTML: '<strong style=\"color: #ff3333\">El cobro no puede superar el saldo del pedido</strong>'
                });
                $scope.cobroRecibidoPedido.valor = 0.00;
            }
        } else {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">El cobro debe ser mayor a 0</strong>'
            });
        }
    };

    $scope.editarVer = function(index) {
        pedidoFactory.seleccionado = pedidoFactory.items[index];
        pedidoFactory.vieneDePedido = 1;
        pedidoFactory.detallesSel = pedidoFactory.seleccionado.detallePedidoCollection;
        pedidoFactory.clienteSel = pedidoFactory.seleccionado.idCliente;
        $scope.app.navigator.pushPage('pedidosAM.html');
    };

    $scope.validarEdicion = function() {
        if (pedidoFactory.clienteSel !== "") {
            if (pedidoFactory.detallesSel.length > 0) {
                $scope.crearModalEnRunTime();
                $scope.modal.show();
                if (pedidoFactory.seleccionado.idPedido !== 0) {
                    //Estoy modificando
                    pedidoService.modificar(pedidoFactory.seleccionado.idPedido, pedidoFactory.clienteSel.idCliente, JSON.stringify(pedidoFactory.detallesSel), usuarioFactory.usuario.idUsuario, $scope.getTotalPedido())
                            .then(function(data) {
                                var respuesta = data.respuesta;
                                if (respuesta === 'OK') {
                                    $scope.modal.hide();
                                    $scope.ons.notification.alert({
                                        title: 'Info',
                                        messageHTML: '<strong style=\"color: #25a6d9\">Pedido modificado con exito</strong>',
                                        callback: function() {
                                            $scope.pedidos();
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
                                    messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                                });
                            });
                } else {
                    //Estoy guardando 
                    pedidoService.registrar(pedidoFactory.clienteSel.idCliente, JSON.stringify(pedidoFactory.detallesSel), usuarioFactory.usuario.idUsuario, $scope.getTotalPedido())
                            .then(function(data) {
                                var respuesta = data.respuesta;
                                if (respuesta === 'OK') {
                                    $scope.modal.hide();
                                    $scope.ons.notification.alert({
                                        title: 'Info',
                                        messageHTML: '<strong style=\"color: #25a6d9\">Pedido registrado con exito</strong>',
                                        callback: function() {
                                            $scope.pedidos();
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
                                    messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                                });
                            });
                }
            } else {
                $scope.modal.hide();
                $scope.ons.notification.alert({
                    title: 'Info',
                    messageHTML: '<strong style=\"color: #ff3333\">Debe seleccionar productos</strong>'
                });
            }
        } else {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Debe seleccionar un cliente</strong>'
            });
        }
    };

    $scope.atrasEdicion = function() {
        $scope.pedidos();
    };

    $scope.adelanteEdicion = function() {
        var objStr = "{\"idPedido\" : 0, \n\
                \"numero\" : 0, \n\
                \"total\" : 0.00, \n\
                \"estado\" : \"PRESUPUESTO\", \n\
                \"fecha\" : " + Date.now() + ", \n\
                \"detallePedidoCollection\" : [ ], \n\
                \"cobro\" : 0.00, \n\
                \"fechaUltimoCobro\" : null, \n\
                \"idUsuario\" : {}, \n\
                \"idCliente\" : {}}";
        pedidoFactory.seleccionado = JSON.parse(objStr);
        pedidoFactory.vieneDePedido = 1;
        pedidoFactory.detallesSel = [];
        pedidoFactory.clienteSel = "";
        $scope.app.navigator.pushPage('pedidosAM.html');
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

        productoService.buscar(texto)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        productoFactory.items = data.contenido;
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
            message: '¿Seguro desea eliminar ese pedido?',
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
//                        var idPedido = pedidoFactory.seleccionado.idPedido;

                        pedidoService.eliminar(pedidoFactory.seleccionado.idPedido)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idDevuelto = data.contenido;
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            messageHTML: '<strong style=\"color: #25a6d9\">Pedido eliminado con exito</strong>',
                                            callback: function() {
                                                $scope.pedidos();
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

Onsen.controller('pedidoCtrl', function($scope, usuarioFactory, usuarioService, productoFactory, productoService, pedidoFactory, pedidoService) {
    pedidoCtrl($scope, usuarioFactory, usuarioService, productoFactory, productoService, pedidoFactory, pedidoService);
});


