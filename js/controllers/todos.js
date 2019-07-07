'use strict';
app.controller('TodoListCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $scope.todos = [];
    $scope.todospagedata = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 6;
    $scope.url = 'mytodos/' + $scope.totalPerPage;

    $scope.getmytodos = function() {
        webServices.get($scope.url + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.todospagedata[$scope.pageno] = getData.data;
                $scope.todos = getData.data;
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.sortproject = function(key, order) {
        $rootScope.formLoading = true;
        $scope.pageno = 1;
        $scope.todos = [];
        $scope.todospagedata = [];
        $scope.url = 'sorttodos/' + key + '/' + order + '/' + $scope.totalPerPage;
        $scope.getmytodos();
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.todospagedata[$scope.pageno]) {
            $scope.getmytodos();
        } else {
            $scope.todos = $scope.todospagedata[$scope.pageno];
        }
    };

    $scope.getmytodos();

}]);