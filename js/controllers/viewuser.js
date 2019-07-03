'use strict';
app.controller('ViewUserCtrl', ['$scope', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', function($scope, $http, $state, $stateParams, webServices, utility, $rootScope) {
    $scope.ispagechanged = false;
    $scope.activetab = 'profile';
    $scope.bottomactivetab = 'followers';
    $scope.profileedit = false;
    $scope.addressedit = false;
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 8;
    if($rootScope.currentdevice == 'mobile'){
        $scope.totalPerPage = 12;
    }
    $scope.pagination = {
        current: 1
    };
    $scope.pagedata = [];
    $scope.userProducts = [];
    $scope.pagedata = [];

    if ($rootScope.user) {
        if (!$rootScope.user.username) {
            $rootScope.logout();
        }
    }

    $scope.setUserData = function(){
        webServices.get('user/'+$stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $scope.userData = getData.data;
                $rootScope.stoploading();
            } else {
                $rootScope.logout();
            }
        });
    }

     $scope.openOTPModal = function() {
        $('#OTPModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }


    $scope.getUserProducts = function(){
        webServices.get('userproducts/'+$stateParams.id+'?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.userProducts = getData.data;
                $scope.pagedata[$scope.pageno] = getData.data;
                if(!$scope.userData.id){
                    $scope.setUserData();
                }else{
                    $rootScope.formLoading = false;
                    if($scope.ispagechanged){
                        $scope.ispagechanged = false;
                        $scope.scrollTo();
                    }
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.pagedata[$scope.pageno]) {
            $scope.ispagechanged = true;
            $rootScope.formLoading = true;
            $scope.getUserProducts();
        } else {
            $scope.userProducts = $scope.pagedata[$scope.pageno];
        }
    };

    $scope.scrollTo = function() {
        $('html').animate({scrollTop: 800}, 'slow');
    }

    $scope.getfriendsfollowers = function() {
        webServices.get('myrecentfriendsandfollowers').then(function(getData) {
            if (getData.status == 200) {
                $scope.friendsandfollowers = getData.data;
                $scope.getchartData();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.getchartData = function() {
        webServices.get('userchartdata/'+$stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $scope.chartData = getData.data;
                $scope.getBottomData();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.getBottomData = function() {
        webServices.get('userotherinfo/'+$stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $scope.otherData = getData.data;
                $scope.getUserProducts();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.setactivetab = function(tab){
        if(tab!=$scope.activetab){
            $scope.profileedit = false;
            $scope.addressedit = false;
            $scope.activetab = tab;
        }
    }

    if($rootScope.user.id == $stateParams.id){
        $state.go('app.mydashboard');
    }else{
        $scope.getfriendsfollowers();
    }

    $scope.changefollowstatus = function(followstatus) {
        if (followstatus) {
            var status = 0;
        } else {
            var status = 1;
        }
        webServices.put('followstatus/' + $stateParams.id + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                $scope.userData.isfollow = status;
            }
        });
    }


}]);