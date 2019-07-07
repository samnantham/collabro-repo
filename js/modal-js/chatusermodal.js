'use strict';
app.controller('ChatUserModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
    $scope.gotoproductchatpage = function(productchatid) {
        $rootScope.closepopoverItem();
        $state.go('app.productchat', {
            'id': productchatid
        });
    }

}]);