'use strict';
app.controller('CollaborateResponseModalCtrl', ['$scope', '$http', '$state', 'authServices', '$sessionStorage', 'webServices', 'utility', '$rootScope', 'Facebook', 'GoogleSignin', function($scope, $http, $state, authServices, $sessionStorage, webServices, utility, $rootScope, Facebook, GoogleSignin) {
    $rootScope.openCommisionModal = function() {
        $rootScope.commisionactive = 0;
        $scope.productData = {};
        $scope.productData.status = 1;
        $rootScope.formLoading = false;
        $rootScope.setcommisionData();
        $('#CommisionModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    $rootScope.addcommisionFeature = function() {
        if ($rootScope.commisionData.featuretext) {
            var obj = {};
            obj.feature = $rootScope.commisionData.featuretext;
            $rootScope.commisionData.featuretext = "";
            $rootScope.commisionData.features.push(obj);
            $scope.productData.status = 0;
        }
    }

    $rootScope.acceptcollaboration = function() {
        webServices.put('acceptmembercollaboration/' + $rootScope.notificationprojectData.member.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.closepopoverItem();
            }
        });
    };


    $rootScope.removecommisionFeature = function(key) {
        $rootScope.commisionData.features.splice(key, 1);
        $scope.productData.status = 0;
    }

    $rootScope.changecommisionactive = function(key) {
        $rootScope.commisionactive = key;
    }

    $rootScope.sendcommisionData = function() {
        $rootScope.formLoading = true;
        $scope.productData.productdetails = $rootScope.commisionData;
        $scope.productData.productid = $rootScope.commisionData.id;
        $scope.productData.ownerid = $rootScope.commisionData.ownerid;
        $scope.productData.buyerid = $rootScope.user.id;
        $scope.productData.buyercommisionstatus = 1;
        $scope.productData.status = 0;
        $scope.productData.isnew = $rootScope.isfirst;
        if ($scope.commisionData.hasbargain) {
            $scope.productData.buyercommisionstatus = 3;
        }

        webServices.post('bargainproduct', $scope.productData).then(function(getData) {
            if (getData.status == 200) {
                 $rootScope.$emit("showsuccessmsg", getData.data.message);
                if($rootScope.stateurl == 'app.viewitem'){
                    $scope.productData = {};
                    $rootScope.getItem();
                    $rootScope.formLoading = false;
                }else if($rootScope.stateurl == 'app.search'){
                    $rootScope.getproducts();
                }
                
                $('#CommisionModal').modal('hide');
            } else if (getData.status == 401) {
                $scope.errors = utility.getError(getData.data.message);
                $scope.showerrors();
            } else {
                $rootScope.$emit("showerror", getData);
            }
        });
    }
}]);