'use strict';
app.controller('HomeCtrl', ['$scope', '$state', '$rootScope', '$timeout', 'webServices', 'anchorSmoothScroll', function($scope, $state, $rootScope, $timeout, webServices, anchorSmoothScroll) {

    $rootScope.formLoading = true;
    $rootScope.activemenu = 'home';
    // $scope.backgroundimages = ['img/backgrounds/background1.jpg', 'img/backgrounds/background2.jpg', 'img/backgrounds/background3.jpg', 'img/backgrounds/background4.jpg', 'img/backgrounds/background5.jpg'];
    if ($rootScope.user) {
        if ($rootScope.user.username) {
            $state.go('app.usermain');
        }
    }

   /* $scope.photos = [{
            src: 'https://skitterp-4b51.kxcdn.com/images/mountains/3-sand-mountain-clouds.jpg',
            title: 'Donec sollicitudin molestie',
            description: 'Vivamus suscipit tortor eget felis porttitor volutpat. Donec sollicitudin molestie malesuada.',
            url: 'http://www.google.com'
        },
        {
            src: 'https://skitterp-4b51.kxcdn.com/images/mountains/4-landscape-with-tree-hills-and-lake.jpg',
            title: 'Vivamus suscipit tortor',
            description: 'Vivamus suscipit tortor eget felis porttitor volutpat. Donec sollicitudin molestie malesuada.',
            url: 'http://www.facebook.com'
        },
        {
            src: 'https://skitterp-4b51.kxcdn.com/images/mountains/2-utah-mountain-sky-nature-golden-hour-sunset.jpg',
            title: 'Ttortor eget felis porttitor',
            description: 'Vivamus suscipit tortor eget felis porttitor volutpat. Donec sollicitudin molestie malesuada.',
            url: 'http://www.linkedin.com'
        }
    ];*/

    $scope.skitterOption = {
        auto_play: true,
        navigation: false,
        dots: false,
        fullscreen: true,
        interval: 4000,
        theme: 'clean',
        label_animation:'fixed',
        with_animations: ['cube', 'cubeRandom', 'block', 'cubeStop', 'cubeStopRandom', 'cubeHide', 'cubeSize', 'horizontal', 'showBars', 'showBarsRandom', 'tube', 'fade', 'fadeFour', 'paralell', 'blind', 'blindHeight', 'blindWidth', 'directionTop', 'directionBottom', 'directionRight', 'directionLeft', 'cubeSpread', 'glassCube', 'glassBlock', 'circles', 'circlesInside', 'circlesRotate', 'cubeShow', 'upBars', 'downBars', 'hideBars', 'swapBars', 'swapBarsBack', 'swapBlocks', 'cut']
    }

    $scope.getBanners = function() {
        $scope.photos = [];
        webServices.get('getbanners').then(function(getData) {
            
            if (getData.status == 200) {
                $scope.backgroundimages = getData.data;
                angular.forEach($scope.backgroundimages , function(data, no) {
                    var obj = {};
                    obj.src = $rootScope.IMGURL + data.image;
                    obj.title = data.banner_main_text;
                    obj.description = data.banner_sub_text;
                    obj.button = data.button_text;
                    obj.url = data.link;
                    $scope.photos.push(obj);
                });
                $rootScope.formLoading = false;
                console.log($scope.photos)
            } else {
                $rootScope.logout();
            }
        });
    };

    if ($rootScope.currentdevice == 'desktop') {
        $rootScope.formLoading = true;
        $scope.getBanners();
    } else {
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 2000);
    }
}]);