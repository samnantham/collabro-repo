'use strict';
app.controller('ViewTodoCtrl', ['$scope', '$sce', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $sce, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $rootScope.formLoading = true;
    $rootScope.todoData = {};

    $scope.getTodo = function() {
        webServices.get('todo/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.todoData = getData.data;
                if($rootScope.todoData.type == 'Project'){
                    $rootScope.todoData.images = $rootScope.todoData.projectinfo.files;
                }
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.getTodo();


}]);