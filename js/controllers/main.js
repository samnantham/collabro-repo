'use strict';
app.controller('MainPageCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', function($scope, $http, $state, $timeout, webServices, utility, $rootScope) {

    $rootScope.formData = {};
    $rootScope.isPopover = false;
    $scope.nextclicks = 0;
    $scope.prevclicks = 0;
    $scope.nextclickcount = 0;
    $scope.prevclickcount = 0;
    if($rootScope.user){
        if($rootScope.user.username){
            $state.go('app.usermain');
        }
    }
    
    $scope.getproducts = function() {
        webServices.get('getproducts').then(function(getData) {
            if(getData.status==200){
                $scope.products = getData.data;
                $rootScope.formLoading = false;
            }
        });
    };

    $scope.slickConfig2 = {
                autoplay: false,
                dots: $scope.slickDots,
                enabled: true,
                focusOnSelect: true,
                infinite: $scope.slickInfinite,
                initialSlide: 0,
                slidesToShow: 4,
                slidesToScroll: 1,
                method: {},
                event: {
                    afterChange: function (event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function (event, slick) {
                          slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
        };

    $scope.showItem = function(item) {
        if($rootScope.formData.title){
            $rootScope.formData = {};
        }else{
            $rootScope.formData = item; 
        }
    };

    $scope.sortproduct = function(type,key,order){
        $rootScope.formLoading = true;
        webServices.get('filtermainproducts/'+type+'/'+key+'/'+order).then(function(getData) {
            if(getData.status==200){
                $scope.products[type.toLowerCase()] = getData.data;
                $rootScope.formLoading = false;
            }
        });
    }

    $scope.getproducts();
}]);
