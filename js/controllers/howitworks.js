'use strict';
app.controller('HIWCtrl', ['$scope', '$sce', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $sce, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    $scope.hiw = {};

    $scope.getContent = function() {
        webServices.get('howitworks').then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.hiw = getData.data;
                $scope.hiw.content = $sce.trustAsHtml($scope.hiw.content);
            }
        });
    };

    $scope.getContent();
}]);