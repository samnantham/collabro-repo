'use strict';
app.controller('SearchCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $scope.keyword = $stateParams.keyword;
    $rootScope.viewData = {};
    $scope.pagedata = [];
    $scope.products = [];
    $scope.alsolikeproducts = [];
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 12;
    $scope.pagination = {
        current: 1
    };

    $rootScope.selectedkey = '';

    $scope.url = 'searchproducts/' + $scope.keyword;

    $scope.getcounts = function() {
        webServices.get('searchhomecounts').then(function(getData) {
            if (getData.status == 200) {
                $rootScope.counts = getData.data;
                $rootScope.getproducts();
            } else {
                $rootScope.$emit("showerror", getData);
            }
        });
    };

    $rootScope.getproducts = function() {
        webServices.get($scope.url + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.pagedata[$scope.pageno] = getData.data;
                $scope.products = getData.data;
                if($rootScope.selectedkey != ''){
                    $rootScope.viewData = $scope.products.data[$rootScope.selectedkey];
                }
                if($scope.alsolikeproducts.length == 0){
                    $scope.alsolikeproducts();
                }else{
                    $rootScope.formLoading = false;
                }
            } else{
                $rootScope.logout();
            }

        });
    };

    $scope.searchsortproduct = function( key, order) {
        $rootScope.formLoading = true;
        $scope.url = 'searchsortproducts/' + $scope.keyword + '/' + key + '/' + order;
        $rootScope.getproducts();
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.pagedata[$scope.pageno]) {
            $rootScope.getproducts();
        } else {
            $scope.products = $scope.pagedata[$scope.pageno];
        }
    };

    $scope.alsolikeproducts = function() {
        webServices.get('alsolikedproducts').then(function(getData) {
            if (getData.status == 200) {
                $scope.alsolikeproducts = getData.data;
                $rootScope.formLoading = false;
                $rootScope.$emit("scrolltop", {});
                $rootScope.$emit("callStickyMenu", {});
            } else{
                $rootScope.logout();
            }
        });
    };


    $scope.showitem = function(key,data) {
        $rootScope.formLoading = true;
        $rootScope.viewData = {};
        $rootScope.selectedkey = key;
        $timeout(function() {         
            $rootScope.viewData = data;
            $rootScope.formLoading = false;
            $rootScope.$emit("scrolltop", {});
        }, 2000);
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

    $scope.changefollowstatus = function() {
        if ($rootScope.viewData.isfollow) {
            var status = 0;
        } else {
            var status = 1;
        }

        webServices.put('followstatus/' + $rootScope.viewData.owner.id + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.viewData.isfollow = getData.data;
                if (status) {
                    $rootScope.viewData.owner.followers++;
                } else {
                    $rootScope.viewData.owner.followers--;
                }
            }
        });
    }

   
    $scope.updatewishstatus = function(product,type,key){
        var obj = {};
        obj.productid = product.id;
        if(product.wishstatus == 1){
            obj.wishstatus = 0;
        }else{
            obj.wishstatus = 1;
        }

        webServices.put('updatewish' , obj).then(function(getData) {
            if (getData.status == 200) {
                if(type=='search'){
                    $scope.products.data[key].wishstatus = obj.wishstatus;
                }else if(type=='likedproducts'){
                    $scope.alsolikeproducts[key].wishstatus = obj.wishstatus;
                }else if(type=='preview'){
                    $rootScope.viewData.wishstatus = obj.wishstatus;
                }
            }
        });
    }

    $rootScope.showCommision = function() {
        $rootScope.formLoading = true;
        if (!$rootScope.viewData.commisionData) {
            $rootScope.isfirst = 1;
            $timeout(function() {
                $rootScope.openCommisionModal();
            }, 2000);
        } else {
            $rootScope.isfirst = 0;
            webServices.get('commisionitem/' + $rootScope.viewData.commisionData.commisionitem[0].id).then(function(getData) {
                if (getData.status == 200) {
                    $rootScope.ResponseData = getData.data;
                    $rootScope.ResponseData.showdetails = 0;
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

    $scope.getcounts();

}]);