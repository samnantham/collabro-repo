'use strict';
app.controller('ViewItemCtrl', ['$scope', '$sce', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', function($scope, $sce, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter) {
    $rootScope.viewData = {};
    $rootScope.chatMessage = {};
    $rootScope.formLoading = true;

    $rootScope.getItem = function() {
        webServices.get('product/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.viewData = getData.data;
                if (!$rootScope.viewData.userview) {
                    $scope.viewproduct();
                }
                console.log($rootScope.viewData)
                $rootScope.viewData.showExtra = 0;
                if ($rootScope.viewData.showmap) {
                    if($rootScope.viewData.postalcode){
                        $scope.getLatandLong($rootScope.viewData.postalcode +' , '+ $rootScope.viewData.address);
                    }else{
                        $scope.getLatandLong($rootScope.viewData.address);
                    }
                }
                $rootScope.stoploading();
            } else {
                $rootScope.logout();
            }
        });
    };

    $rootScope.setcommisionData = function() {
        $rootScope.commisionData = angular.copy($rootScope.viewData);
        if ($rootScope.commisionData.startdate) {
            $rootScope.commisionData.productstartdate = new Date($rootScope.commisionData.startdate);
        }
        if ($rootScope.commisionData.enddate) {
            $rootScope.commisionData.productenddate = new Date($rootScope.commisionData.enddate);
        }
        $rootScope.commisionData.counteroffer = 0;
        $rootScope.commisionData.isaccept = 0;
        $rootScope.formLoading = false;
        //$rootScope.commisionData.features = $rootScope.viewData.features;
    }

    $rootScope.showCommision = function() {
        $rootScope.formLoading = true;
        if (!$rootScope.viewData.commisionData) {
            $rootScope.isfirst = 1;
            $timeout(function() {
                $rootScope.commisionactive = 0;
                $scope.productData = {};
                $scope.productData.status = 1;
                $rootScope.formLoading = false;
                $rootScope.setcommisionData();
                $rootScope.openModalPopup('commisionmodal','CommisionModalCtrl');
                //$rootScope.openCommisionModal();
            }, 2000);
        } else {
            $rootScope.isfirst = 0;
            webServices.get('commisionitem/' + $rootScope.viewData.commisionData.commisionitem[0].id).then(function(getData) {
                if (getData.status == 200) {
                    $rootScope.ResponseData = getData.data;
                    console.log($rootScope.ResponseData)
                    $rootScope.ResponseData.showdetails = 1;
                    $rootScope.ResponseData.commisionactive = 0;
                    $rootScope.ResponseData.iscounter = 0;
                    if ($rootScope.ResponseData.startdate) {
                        $rootScope.ResponseData.productstartdate = new Date($rootScope.ResponseData.startdate);
                    }
                    if ($rootScope.ResponseData.enddate) {
                        $rootScope.ResponseData.productenddate = new Date($rootScope.ResponseData.enddate);
                    }
                    $timeout(function() {
                        $rootScope.openModalPopup('responsemodal','ResponseModalCtrl');
                        $rootScope.formLoading = false;
                    }, 2000);
                }else
                {
                    $rootScope.logout();
                }
            });
        }
    }

    $scope.updatewishstatus = function(){
        var obj = {};
        obj.productid = $rootScope.viewData.id;
        if($rootScope.viewData.wishstatus == 1){
            obj.wishstatus = 0;
        }else{
            obj.wishstatus = 1;
        }
    
        webServices.put('updatewish' , obj).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.viewData.wishstatus = obj.wishstatus;
            }
        });
    }


    $scope.viewproduct = function() {
        webServices.put('viewproduct/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.viewData.noofviews++;
            }
        });
    }

    $scope.changefollowstatus = function() {
        if ($scope.viewData.isfollow) {
            var status = 0;
        } else {
            var status = 1;
        }

        webServices.put('followstatus/' + $rootScope.viewData.owner.id + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                $scope.viewData.isfollow = getData.data;
                if (status) {
                    $rootScope.viewData.owner.followers++;
                } else {
                    $rootScope.viewData.owner.followers--;
                }
            }
        });
    }

    $rootScope.editProduct = function() {
        $rootScope.iseditproduct = true;
        $rootScope.editproductid = $rootScope.viewData.id;
        $rootScope.openModal();
    }

    $rootScope.editRequest = function() {
        $rootScope.iseditproduct = true;
        $rootScope.editproductid = $rootScope.viewData.id;
        $rootScope.openRequestModal();
    }

    $scope.getLatandLong = function(address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $rootScope.viewData.latitude = results[0].geometry.location.lat();
                $rootScope.viewData.longitude = results[0].geometry.location.lng();
                $scope.geopos = angular.copy(app.geopos);

                $scope.customIcon = {
                    "scaledSize": [32, 32],
                    "url": "https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Google_Maps.png"
                };
            } else {
                $rootScope.viewData.showmap = 0;
            }
        });
    }

    $scope.getItem();


}]);