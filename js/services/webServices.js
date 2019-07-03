(function() {
    'use strict';

    angular.module('ui.load')
        .service('webServices', webServices);

    function webServices($q, $http, $sessionStorage, $rootScope, authServices, Upload) {

        var APIURL = app.apiurl;
        var obj = {};
        console.log(authServices.getToken());
        return {
            get: function(q) {
                var deferred = $q.defer();
                var splitUrl = APIURL + q;
                if (splitUrl.indexOf('?page') > 0) {
                    var URL = APIURL + q;
                } else {
                    var URL = APIURL + q;
                }

                var start = new Date().getTime();
                $http({
                    method: 'GET',
                    url: URL,
                    cache: false,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    //authServices.logout();
                    deferred.resolve(response);
                });
                return deferred.promise;
            },
            
            post: function(q, object) {
                var deferred = $q.defer();
                var splitUrl = APIURL + q;
                var check = splitUrl.indexOf('login');

                if (check > 0) {
                    URL = splitUrl;
                } else {
                    URL = splitUrl;
                }

                $http({
                    method: 'POST',
                    url: URL,
                    data: object,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.resolve(err);
                });
                return deferred.promise;
            },

            downloadpdf: function(q) {
                var deferred = $q.defer();
                var URL = APIURL + q;

                $http({
                    method: 'GET',
                    url: URL,
                    cache: false,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }).then(function(response) {
                    deferred.resolve(response);
                    /*var Buf = response.data;
                    var filename = 'file.pdf';
                    var contentType = response.config.headers["Content-Type"];
                    var linkElement = document.createElement('a');
                    try {
                        var blob = new Blob([Buf], { type: contentType });
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", filename);
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    } catch (ex) {
                        console.log(ex);
                    }*/
                }, function(response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            },


            put: function(q, object) {
                var deferred = $q.defer();
                var splitUrl = APIURL + q;
                URL = splitUrl;

                $http({
                    method: 'PUT',
                    url: URL,
                    data: object,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.resolve(err);
                });
                return deferred.promise;
            },
            normalpost: function(q, object) {
                var deferred = $q.defer();
                var URL = APIURL + q;

                $http({
                    method: 'POST',
                    url: URL,
                    data: object,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(err) {
                    deferred.resolve(err);
                });
                return deferred.promise;
            },

            delete: function(q, object) {
                var deferred = $q.defer();
                $http({
                    method: 'delete',
                    url: APIURL + q,
                    data: object,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            },

            upload: function(q, data) {

                var deferred = $q.defer();
                var URL = APIURL + q;
                var start = new Date().getTime();

                Upload.upload({
                    url: URL,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/json'
                    },
                    data: data
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.resolve(response);
                }, function(evt) {
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ');
                });

                return deferred.promise;

            },

            putupload: function(q, data) {

                var deferred = $q.defer();
                var URL = APIURL + q;
                var start = new Date().getTime();
                data._method = 'PUT';
                Upload.upload({
                    url: URL,
                    headers: {
                        'Authorization': "Bearer " + authServices.getToken(),
                        'Content-Type': 'application/json'
                    },
                    data: data
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.resolve(response);
                }, function(evt) {
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ');
                });

                return deferred.promise;

            },
        }
    }

})();