'use strict';
app.controller('ProjectListCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $scope.projects = [];
    $scope.projectspagedata = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 6;
    $scope.url = 'myprojects/' + $scope.totalPerPage;

    $scope.getmyprojects = function() {
        webServices.get($scope.url + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.projectspagedata[$scope.pageno] = getData.data;
                $scope.projects = getData.data;
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.sortproject = function(key, order) {
        $rootScope.formLoading = true;
        $scope.pageno = 1;
        $scope.projects = [];
        $scope.projectspagedata = [];
        $scope.url = 'sortprojects/' + key + '/' + order + '/' + $scope.totalPerPage;
        $scope.getmyprojects();
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.projectspagedata[$scope.pageno]) {
            $scope.getmyprojects();
        } else {
            $scope.projects = $scope.projectspagedata[$scope.pageno];
        }
    };

    $scope.getmyprojects();

}]);