'use strict';
app.controller('HomeCtrl', ['$scope', '$state', '$rootScope', '$timeout', function($scope, $state, $rootScope, $timeout) {
    $scope.bgkey = 0;
    $scope.backgroundimages = ['img/backgrounds/background1.jpg', 'img/backgrounds/background2.jpg', 'img/backgrounds/background3.jpg', 'img/backgrounds/background4.jpg', 'img/backgrounds/background5.jpg'];

    if ($rootScope.user) {
        if ($rootScope.user.username) {
            $state.go('app.usermain');
        } else {
            $timeout(function() {
                $scope.getBGS();
            }, 2000);
        }
    } else {
        $timeout(function() {
            $scope.getBGS();
        }, 2000);
    }

    $scope.getBGS = function() {
        $timeout(function() {
            $rootScope.formLoading = false;
            var homelis = document.getElementsByClassName('homepgbgs');
            angular.forEach(homelis, function(li,key) {
                $('.cb-slideshow li:nth-child('+(key+1)+') span').css("background-image", "url('"+$scope.backgroundimages[key]+"'");
                $('.cb-slideshow li:nth-child('+(key+1)+') span').css("-webkit-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') span').css("-moz-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') span').css("-o-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') span').css("-ms-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') span').css("animation-delay", (key * 6)+"s");

                $('.cb-slideshow li:nth-child('+(key+1)+') div').css("-webkit-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') div').css("-moz-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') div').css("-o-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') div').css("-ms-animation-delay", (key * 6)+"s");
                $('.cb-slideshow li:nth-child('+(key+1)+') div').css("animation-delay", (key * 6)+"s");
            });
        }, 2000);
        
    }
}]);