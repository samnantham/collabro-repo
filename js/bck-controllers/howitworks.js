'use strict';
app.controller('HIWCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    $rootScope.formLoading = true;
    $scope.hiw = {};

    $scope.getContent = function() {
        webServices.get('gethowitworks').then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.hiw = getData.data;
                $rootScope.$emit("scrolltop", {});
                $rootScope.$emit("callStickyMenu", {});
            } else{
                $rootScope.logout();
            }
        });
    };

   
    $scope.getContent();

}]);