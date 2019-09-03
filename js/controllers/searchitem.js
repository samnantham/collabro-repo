'use strict';
app.controller('SearchItemPageCtrl', ['$scope', '$modal', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $modal, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $rootScope.formData = {};
    $rootScope.isPopover = false;
    $scope.keyword = $stateParams.keyword;
    if($rootScope.user){
        if($rootScope.user.username){
            $state.go('app.usermain');
        }
    }
    $scope.activetab = 'All';
    $scope.url = 'searchhomeproducts/' + $stateParams.keyword;

    $rootScope.searchData.keyword = $stateParams.keyword
    
    $scope.getproducts = function() {
        webServices.get($scope.url).then(function(getData) {
            if(getData.status==200){
                $scope.products = getData.data;
                $rootScope.$emit("scrolltop", {});
                $rootScope.formLoading = false;
            }
        });
    };

    $rootScope.searchproductslick = {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.slider-nav',
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
            };

    $scope.showItem = function(item) {
        $rootScope.formData = {};
        $rootScope.formData = item; 
        $timeout(function() {  
            $scope.dialogInst = $modal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    keyboard: false,
                    templateUrl: 'tpl/blocks/modals/popovermodal.html',
                    size: 'lg',
                    windowClass: 'popovermodal',
                });

        }, 1000);
    };



    $scope.sortproduct = function(type,key,order){
        $rootScope.formLoading = true;
        webServices.get('filtermainproducts/'+ type +'/'+ $scope.keyword +'/'+ key +'/'+ order).then(function(getData) {
            if(getData.status==200){
                $scope.products[type.toLowerCase()] = getData.data;
                $rootScope.formLoading = false;
            }
        });
    }

    $scope.setactivetab = function(tab) {
        $scope.pagedata = [];
        $scope.typeproductdata = [];
        $scope.typespageno = 1;
        $rootScope.formLoading = true;
        if (tab != $scope.activetab) {
            $scope.activetab = tab;
            $scope.filtertypeproducts();
        } else {
            $scope.activetab = 'All';
            $scope.getproducts();
        }
    }

     $scope.filtertypeproducts = function() {
        webServices.get('productbytype/' + $scope.activetab + '/' + $stateParams.keyword ).then(function(getData) {
            if (getData.status == 200) {
                $scope.typeproductdata = getData.data;
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.getproducts();
}]);
