/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function productoCtrl($scope, usuarioFactory, productoFactory, productoService, proveedorService, proveedorFactory, pedidoFactory) {

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

    $scope.productos = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        $scope.pagIni = 0;
        $scope.pagTam = 10;
        productoFactory.textoBuscado = "";
        
        productoService.buscar(productoFactory.textoBuscado, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        productoFactory.items = data.contenido;
                        $scope.modal.hide();
                        $scope.app.navigator.resetToPage('productos.html');
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


    $scope.getProductos = function() {
        return productoFactory.items;

    };

    $scope.getProductoSeleccionado = function() {
        return productoFactory.seleccionado;
    };

    $scope.editarVer = function(index) {
        productoFactory.seleccionado = productoFactory.items[index];
        productoFactory.seleccionado.fechaVencimiento = new Date(productoFactory.seleccionado.fechaVencimiento);
        productoFactory.seleccionado.proveedoresSel = productoFactory.seleccionado.proveedorCollection;
        $scope.app.navigator.pushPage('productosAM.html');
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

    $scope.seleccionarProductoPedido = function(index) {
        var idx = -1;
        for (var i = 0; i < pedidoFactory.detallesSel.length; i++) {
            if (pedidoFactory.detallesSel[i].idProducto.idProducto === productoFactory.items[index].idProducto) {
                idx = i;
                break;
            }
        }
        if (idx === -1) {
            var objStr = "{\"idDetallePedido\" : 0, \n\
                \"subTotal\" : 0.00, \n\
                \"cantidad\" : 1, \n\
                \"precioProducto\" : " + productoFactory.items[index].precio + ", \n\
                \"idProducto\" : " + JSON.stringify(productoFactory.items[index]) + ", \n\
                \"idPedido\" : {}}";
            pedidoFactory.detallesSel.push(JSON.parse(objStr));
        }
        $scope.app.navigator.pushPage('pedidosAM.html');
    };

    $scope.validarEdicion = function() {
        if (productoFactory.seleccionado.proveedoresSel.length > 0) {
            $scope.crearModalEnRunTime();
            $scope.modal.show();
            if (productoFactory.seleccionado.idProducto !== 0) {
                //Estoy modificando
                productoService.modificar(productoFactory.seleccionado.idProducto, productoFactory.seleccionado.producto, productoFactory.seleccionado.codigo, productoFactory.seleccionado.precio, productoFactory.seleccionado.fechaVencimiento, productoFactory.seleccionado.stockCollection[productoFactory.seleccionado.stockCollection.length - 1].cantidad, JSON.stringify(productoFactory.seleccionado.proveedoresSel))
                        .then(function(data) {
                            var respuesta = data.respuesta;
                            if (respuesta === 'OK') {
                                $scope.modal.hide();
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #25a6d9\">Producto modificado con exito</strong>',
                                    callback: function() {
                                        $scope.productos();
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
                //Estoy guardando nombre, codigo, precio, fechaVto
                productoService.registrar(productoFactory.seleccionado.producto, productoFactory.seleccionado.codigo, productoFactory.seleccionado.precio, productoFactory.seleccionado.fechaVencimiento, productoFactory.seleccionado.stockCollection[productoFactory.seleccionado.stockCollection.length - 1].cantidad, JSON.stringify(productoFactory.seleccionado.proveedoresSel))
                        .then(function(data) {
                            var respuesta = data.respuesta;
                            if (respuesta === 'OK') {
                                $scope.modal.hide();
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #25a6d9\">Producto registrado con exito</strong>',
                                    callback: function() {
                                        $scope.productos();
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
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Debe seleccionar al menos un proveedor</strong>'
            });
        }
    };

    $scope.atrasEdicion = function() {
        $scope.productos();
    };

    $scope.adelanteEdicion = function() {
        var objStr = "{\"idProducto\" : 0, \n\
                \"producto\" : \"\", \n\
                \"precio\" : 0.00, \n\
                \"codigo\" : \"\", \n\
                \"fechaVencimiento\" : " + Date.now() + ", \n\
                \"detallePedidoCollection\" : [ ], \n\
                \"stockCollection\" : [ ], \n\
                \"proveedorCollection\" : [ ], \n\
                \"detalleCompraCollection\" : [ ]}";
        productoFactory.seleccionado = JSON.parse(objStr);
        productoFactory.seleccionado.fechaVencimiento = new Date(productoFactory.seleccionado.fechaVencimiento);
        productoFactory.seleccionado.proveedoresSel = [];
        $scope.app.navigator.pushPage('productosAM.html');
    };

    $scope.promptBuscar = function() {
        $scope.ons.notification.prompt({
            title: 'Info',
            message: "Buscar...",
            callback: function(texto) {
                productoFactory.textoBuscado = texto;
                $scope.buscar(productoFactory.textoBuscado);
            }
        });
    };

    $scope.buscar = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        $scope.pagIni = 0;
        $scope.pagTam = 10;

        productoService.buscar(productoFactory.textoBuscado, $scope.pagIni, $scope.pagTam)
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
    
    $scope.traerMas = function() {
        $scope.trayendo = true;

        $scope.pagIni = $scope.pagTam;
        $scope.pagTam = $scope.pagTam + 10;

        productoService.buscar(productoFactory.textoBuscado, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    //Agrego los elementos que trae data al array items de publicacionFactory
                    Array.prototype.push.apply(productoFactory.items, data.contenido);
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
            message: '¿Seguro desea eliminar ese producto?',
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
                        var idProducto = productoFactory.seleccionado.idProducto;

                        productoService.eliminar(idProducto)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idDevuelto = data.contenido;
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            messageHTML: '<strong style=\"color: #25a6d9\">Producto eliminado con exito</strong>',
                                            callback: function() {
                                                $scope.productos();
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

    $scope.promptBuscarProveedor = function() {
        if (productoFactory.seleccionado.proveedoresSel.length === 0) {
            $scope.ons.notification.prompt({
                title: 'Info',
                message: "Buscar...",
                callback: function(texto) {
                    $scope.buscarProveedor(texto);
                }
            });
        } else {
            proveedorFactory.items = productoFactory.seleccionado.proveedoresSel.slice(0);
            $scope.dialogFiltroProveedor.show();
        }
    };

    $scope.buscarProveedor = function(texto) {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        if (texto !== '') {
            proveedorService.buscar(texto)
                    .then(function(data) {
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            proveedorFactory.items = data.contenido;
                            $scope.modal.hide();
                            $scope.dialogFiltroProveedor.show();
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
        } else {
            $scope.modal.hide();
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Ingrese un nombre de proveedor para buscar</strong>'
            });
        }
    };

    $scope.getProveedores = function() {
        return proveedorFactory.items;
    };

    $scope.getProveedorSeleccionado = function() {
        return proveedorFactory.seleccionado;
    };

    $scope.setProveedorSeleccionado = function(index) {
        var idx = productoFactory.seleccionado.proveedoresSel.indexOf(proveedorFactory.items[index]);
        if (idx > -1) {
            productoFactory.seleccionado.proveedoresSel.splice(idx, 1);
        } else {
            productoFactory.seleccionado.proveedoresSel.push(proveedorFactory.items[index]);
        }
    };


}

Onsen.controller('productoCtrl', function($scope, usuarioFactory, productoFactory, productoService, proveedorService, proveedorFactory, pedidoFactory) {
    productoCtrl($scope, usuarioFactory, productoFactory, productoService, proveedorService, proveedorFactory, pedidoFactory);
});



