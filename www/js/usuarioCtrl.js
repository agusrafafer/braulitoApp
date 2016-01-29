/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Onsen.controller('usuarioCtrl', function($rootScope, $scope, $http) {
//    usuarioCtrl($rootScope, $scope, $http);
//});


//El controlador de usuarios
function usuarioCtrl($scope, usuarioService, usuarioFactory, noticiaService, $window, configFactory) {

    $scope.usuario = "";
    $scope.nombre = "";
    $scope.apellido = "";
    $scope.mail = "";
    $scope.login = "";
    $scope.clave1 = "";
    $scope.clave2 = "";
    $scope.noticias = "";


    $scope.crearModalEnRunTime = function() {
        var elm = $("<ons-modal var=modal><ons-icon icon='ion-load-c' spin='true'></ons-icon><br><br>Aguarde...</ons-modal>");
        elm.appendTo($("body")); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object
    };

    $scope.getConfigFactory = function() {
        return configFactory.config;
    };

    $scope.registrarConfig = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        usuarioService.registrarConfig(configFactory.config.porcenBuen, configFactory.config.porcenRegu, configFactory.config.porcenMalo)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #25a6d9\">Config. registrada con exito</strong>'
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
    };

    //Método de logueo llamado desde la vista login.html
    $scope.validarLogin = function(login, password) {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        usuarioService.validarLogin(login, password)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        usuarioFactory.usuario = data.contenido;
                        $scope.usuario = usuarioFactory.usuario;
                        configFactory.config.porcenBuen = data.tiposCliente[0].aumentoExtra;
                        configFactory.config.porcenRegu = data.tiposCliente[1].aumentoExtra;
                        configFactory.config.porcenMalo = data.tiposCliente[2].aumentoExtra;
                        $scope.modal.hide();
                        $scope.app.slidingMenu.setMainPage('inicio.html');
                    } else {
                        $scope.usuario = "";
                        usuarioFactory.usuario = "";
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    $scope.usuario = "";
                    usuarioFactory.usuario = "";
                    $scope.modal.hide();
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                        default:
                            mensaje = "No se!!!";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">Usuario o Password incorrectos: ' + mensaje + '</strong>'
                    });
                });

    };

    $scope.isLogueado = function() {
        if (typeof (usuarioFactory.usuario) === "undefined")
            return false;
        if (usuarioFactory.usuario === "") {
            return false;
        }
        return true;
    };

    $scope.getIdUsuarioLogueado = function() {
        return usuarioFactory.usuario.idUsuario;
    };

    $scope.logout = function() {
        $scope.usuario = "";
        usuarioFactory.usuario = "";
        usuarioFactory.tituloMenu = "";
        $scope.app.slidingMenu.setMainPage('inicio.html');
    };

    $scope.getNombre = function() {
        return usuarioFactory.usuario.nombre;
    };
    $scope.getApellido = function() {
        return usuarioFactory.usuario.apellido;
    };

    $scope.abrioMenuIzq = function() {
        if ($scope.isLogueado()) {
            usuarioFactory.tituloMenu = "Hola " + usuarioFactory.usuario.nombre;
        } else {
            usuarioFactory.tituloMenu = "Braulito App";
        }
    };

    $scope.cerroMenuIzq = function() {
        usuarioFactory.tituloMenu = "Braulito App";
    };

    $scope.getTituloMenu = function() {
        return usuarioFactory.tituloMenu;
    };

    $scope.formatDate = function(fecha) {
        var d = new Date(fecha);
        return d;
    };

    $scope.abrirNoticia = function(link) {
        $window.open(link, "_blank");
    };

    $scope.proximamente = function() {
        $scope.ons.notification.alert({
            title: 'Info',
            messageHTML: '<strong style=\"color: #25a6d9\">Proximamente</strong>'
        });
    };


    cargarNoticias();

    function cargarNoticias() {
        var ancho = ($($window).width() / 2) - 150;
        ancho = ancho + "px";
        $("#clima").css({"margin-left": ancho});
        noticiaService.noticiasRss().success(function(data) {
            var x2js = new X2JS();
            if ($scope.noticias === "") {
                $scope.noticias = x2js.xml_str2json(data);
                $scope.noticias = $scope.noticias.rss.channel.item;
                $scope.noticias = $scope.noticias.slice(0, 3);
            }
        });
    }
    ;

}


Onsen.controller('usuarioCtrl', function($scope, usuarioService, usuarioFactory, noticiaService, $window, configFactory) {
    usuarioCtrl($scope, usuarioService, usuarioFactory, noticiaService, $window, configFactory);
});



