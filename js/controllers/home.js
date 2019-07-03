'use strict';
app.controller('HomeCtrl', ['$scope', '$state', '$rootScope', '$timeout','webServices', function($scope, $state, $rootScope, $timeout, webServices) {
    
    // $scope.backgroundimages = ['img/backgrounds/background1.jpg', 'img/backgrounds/background2.jpg', 'img/backgrounds/background3.jpg', 'img/backgrounds/background4.jpg', 'img/backgrounds/background5.jpg'];
    $rootScope.formLoading = true;
    if ($rootScope.user) {
        if ($rootScope.user.username) {
            $state.go('app.usermain');
        }
    }

    $scope.getBanners = function() {
        webServices.get('getbanners').then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
               	$scope.backgroundimages = getData.data;
               	console.log($scope.backgroundimages)
            } else{
                $rootScope.logout();
            }
        });
    };

    $scope.getBanners();
}]);