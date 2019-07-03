'use strict';
app.controller('FeedCtrl', ['$scope', '$http', '$state', 'authServices', '$sessionStorage', 'webServices', 'utility', '$rootScope', 'Facebook', 'GoogleSignin', '$ngConfirm', function($scope, $http, $state, authServices, $sessionStorage, webServices, utility, $rootScope, Facebook, GoogleSignin, $ngConfirm) {
    $scope.wishedfeeddata = [];
    $scope.myfeeddata = [];
    $scope.wishedfeeds = [];
    $scope.myfeeds = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 8;
    $scope.activetab = 'wishedfeed';
    
    if ($rootScope.user) {
        if (!$rootScope.user.username) {
            $rootScope.logout();
        }
    }

    $scope.getmyfeeds = function() {
        webServices.get('myfeeds/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.myfeeds = getData.data;
                $scope.myfeeddata[$scope.pageno] = getData.data;
                $scope.myfeedpagination = {
                    current: $scope.pageno
                };
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.setactivetab = function(tab) {
        if (tab != $scope.activetab) {
            $scope.activetab = tab;
            $rootScope.formLoading = true;
            if (tab == 'myfeed') {
                $scope.getmyfeeds();
            } else if (tab == 'wishedfeed') {
                $scope.getwishedfeeds();
            }
        }
    }

    $scope.updatefeedwish = function(feed, key) {
        webServices.put('feedstatus/' + feed.id + '/' + 0).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.$emit("showsuccessmsg", getData.data.message);
                $scope.getwishedfeeds();
            }
        });
    }

    $scope.gotofeedchat = function(feedid) {
        webServices.put('feedchat/' + feedid + '/' + $rootScope.user.id).then(function(getData) {
            if (getData.status == 200) {
                $state.go('app.feedchat', {
                    'chatid': getData.data.id
                });
            }
        });
    }

    $scope.removefeed = function(key,feedid) {
        $ngConfirm({
            title: 'Are you sure want to delete?',
            content: 'Not possible to recover once you delete',
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Delete',
                    btnClass: 'btn-red',
                    action: function() {
                        webServices.delete('feed/' + feedid).then(function(getData) {
                            if (getData.status == 200) {
                                $scope.getmyfeeds();
                            }
                        });
                    }
                },
                close: function() {}
            }
        });
        
    }

    $scope.getwishedfeeds = function() {
        webServices.get('wishedfeeds/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.wishedfeeds = getData.data;
                $scope.wishedfeeddata[$scope.pageno] = getData.data;
                $scope.wishedfeedpagination = {
                    current: $scope.pageno
                };
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if ($scope.activetab == 'myfeed') {
            if (!$scope.myfeeddata[$scope.pageno]) {
                $scope.getmyfeeds();
            } else {
                $scope.myfeeds = $scope.myfeeddata[$scope.pageno];
            }
        } else if ($scope.activetab == 'wishedfeed') {
            if (!$scope.wishedfeeddata[$scope.pageno]) {
                $scope.getwishedfeeds();
            } else {
                $scope.wishedfeeds = $scope.wishedfeeddata[$scope.pageno];
            }
        }
    };


    $scope.getwishedfeeds();
}]);