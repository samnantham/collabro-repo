'use strict';
app.controller('UserChatsCtrl', ['$scope', '$http', '$state', 'authServices', '$ngConfirm', 'webServices', 'utility', '$rootScope', 'Facebook', 'GoogleSignin', function($scope, $http, $state, authServices, $ngConfirm, webServices, utility, $rootScope, Facebook, GoogleSignin) {
    $scope.firstloadingcompleted = false;
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 10;
    $scope.chatusers = [];
    
    if ($rootScope.user) {
        if (!$rootScope.user.username) {
            $state.go('app.usermain');
        }
    }
    $rootScope.$emit("scrolltop", {});
    $scope.url = 'mychatusers/';

    $scope.getmyChatUsers = function() {
        webServices.get($scope.url + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.totalData = getData.data.total;
                $scope.chatusers = $scope.chatusers.concat(getData.data.data);
                $rootScope.formLoading = false;
                if (!$scope.firstloadingcompleted) {
                    $rootScope.$emit("scrolltop", {});
                    $rootScope.$emit("callStickyMenu", {});
                    $scope.firstloadingcompleted = true;
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.filterchats = function(type) {
        $scope.chatusers = [];
        $scope.pageno = 1;
        $rootScope.formLoading = true;
        $scope.url = 'filterchatusers/' + type + '/';
        $scope.getmyChatUsers();
    }

    $scope.loadMoreRecords = function() {
        if ($scope.chatusers.length < $scope.totalData) {
            $rootScope.formLoading = true;
            $scope.pageno++;
            $scope.getmyChatUsers();
        }
    }

    $scope.removechat = function(key, chat) {
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
                        webServices.delete('deleteuserchat/' + chat.id).then(function(getData) {
                            if (getData.status == 200) {
                                if (!chat.status) {
                                    $rootScope.user.chatmessages--;
                                }
                                $scope.chatusers.splice(key, 1);
                            }
                        });
                    }
                },
                close: function() {}
            }
        });

    }

    $scope.gotochatpage = function(key, data) {
        if (!data.status) {
            webServices.put('readuserchat/' + data.id).then(function(getData) {
                $scope.chatusers[key].status = 1;
                if ($rootScope.user.chatmessages > 0) {
                    $rootScope.user.chatmessages--;
                }
                if (data.chattype == 1) {
                    $state.go('app.productchat', {
                        'id': data.productchatid
                    });
                } else if (data.chattype == 2) {
                    $state.go('app.projectdetails', {
                        'id': data.productid
                    });
                } else if (data.chattype == 3) {
                    $state.go('app.userchats', {
                        'isfeed': 1,
                        'chatid': data.productid
                    });
                } else if (data.chattype == 4) {
                    $state.go('app.userchats', {
                        'isfeed': 0,
                        'chatid': data.productid
                    });
                }
            });
        } else {
            if (data.chattype == 1) {
                $state.go('app.productchat', {
                    'id': data.productchatid
                });
            } else if (data.chattype == 2) {
                $state.go('app.projectdetails', {
                    'id': data.productid
                });
            } else if (data.chattype == 3) {
                $state.go('app.userchats', {
                    'isfeed': 1,
                    'chatid': data.productid
                });
            } else if (data.chattype == 4) {
                $state.go('app.userchats', {
                    'isfeed': 0,
                    'chatid': data.productid
                });
            }
        }

    }

    $scope.getmyChatUsers();
}]);