'use strict';
app.controller('SearchItemPageCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
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

    $scope.showItem = function(item) {
        $rootScope.productLoading = true;
        $timeout(function() {  
            $rootScope.formData = {};
            $rootScope.formData = item; 
            $rootScope.productLoading = false;
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
