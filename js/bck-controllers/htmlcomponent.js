'use strict';
app.controller('HTMLComponentCtrl', ['$scope', '$http', '$state', '$timeout', '$rootScope', function($scope, $http, $state, $timeout ,$rootScope) {
  
    $timeout(function() {
        $rootScope.formLoading = false;
    }, 2000);
    
}]);