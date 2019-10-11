'use strict';
app.controller('ViewProductCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', '$stateParams', '$rootScope', function($scope, $http, $state, $timeout, webServices, $stateParams, $rootScope) {
    $rootScope.formData = {};
    $rootScope.isPopover = false;

    if($rootScope.currentdevice == 'mobile'){
        $state.go('app.viewitem',{'id':$stateParams.id});
    }
    
    if($rootScope.user){
        if($rootScope.user.username){
            $state.go('app.viewitem',{'id':$stateParams.id});
        }
    }
    
    $scope.getproducts = function() {
        webServices.get('getproducts').then(function(getData) {
            if(getData.status==200){
                $scope.products = getData.data;
                $scope.getItem();
            }
        });
    };

    $scope.getItem = function() {
        webServices.get('showproduct/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $scope.showItem(getData.data);
                $rootScope.formLoading = false;
                $rootScope.$emit("scrolltop", {});
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

    $rootScope.logintoProduct = function(product){
        $rootScope.redirectproduct = product;
        $rootScope.isPopover = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        $rootScope.issignin = true;
    }

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
