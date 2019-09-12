'use strict';
app.controller('RWBCtrl', ['$scope', '$sce', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $sce, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    $scope.rwb = {};

    $scope.getContent = function() {
        webServices.get('rewardsandbenefits').then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.rwb = getData.data;
                $scope.rwb.content = $sce.trustAsHtml($scope.rwb.content);
            }
        });
    };

    $scope.getContent();
}]);