'use strict';
app.controller('NotificationCtrl', ['$scope', '$modal', '$state', 'webServices', 'utility', '$rootScope', '$ngConfirm', function($scope, $modal, $state, webServices, utility, $rootScope, $ngConfirm) {
    $scope.firstloadingcompleted = false;
    $scope.notifications = [];
    $scope.productData = {};
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 8;
    
    if ($rootScope.user) {
        if (!$rootScope.user.username) {
            $rootScope.logout();
        }
    }

    $scope.getmyNotifications = function() {
        webServices.get('mynotifications/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.totalData = getData.data.total;
                $scope.notifications = $scope.notifications.concat(getData.data.data);
                if (!$scope.firstloadingcompleted) {
                    $scope.firstloadingcompleted = true;
                    $rootScope.$emit("scrolltop", {});
                    $rootScope.$emit("callStickyMenu", {});
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.loadMoreRecords = function() {
        if ($scope.getmyNotifications.length < $scope.totalData) {
            $rootScope.formLoading = true;
            $scope.pageno++;
            $scope.getmyNotifications();
        }
    }

    $scope.readmessage = function(notification, notificationtype, type, key) {
        if (!notification.status) {
            webServices.put('readnotification/' + notification.id).then(function(getData) {
                $rootScope.formLoading = false;
                if (type == 'single') {
                    $scope.notifications[key].status = 1;
                }
                if (getData.status == 200) {
                    $rootScope.getUserInfo();
                }
            });
        }

        if (notificationtype == 1) {
            $rootScope.ResponseData = {};
            webServices.get('commisionitem/' + notification.itemid).then(function(getData) {
                if (getData.status == 200) {
                    $rootScope.ResponseData = getData.data;
                    $rootScope.ResponseData.showdetails = 0;
                    $rootScope.ResponseData.isreject = 0;
                    $rootScope.ResponseData.commisionactive = 0;
                    $rootScope.ResponseData.iscounter = 0;
                    $rootScope.ResponseData.isaccept = 0;
                    $rootScope.ResponseData.isacceptoffer = 0;
                    if ($rootScope.ResponseData.startdate) {
                        $rootScope.ResponseData.productstartdate = new Date($rootScope.ResponseData.startdate);
                    }
                    if ($rootScope.ResponseData.enddate) {
                        $rootScope.ResponseData.productenddate = new Date($rootScope.ResponseData.enddate);
                    }
                    $rootScope.ResponseData.showdetails = true;
                    console.log($rootScope.ResponseData)
                    $rootScope.openModalPopup('responsemodal','ResponseModalCtrl');
                } else {
                    $rootScope.logout();
                }
            });
        } else if (notificationtype == 2) {
            webServices.get('project/' + notification.itemid).then(function(getData) {
                console.log(getData)
                if (getData.status == 200) {
                    $rootScope.notificationprojectData = getData.data;
                    $rootScope.collabthumb = 0;
                    $rootScope.openModalPopup('collaborateresponsemodal','CollaborateResponseModalCtrl');
                } else {
                    $rootScope.logout();
                }
            });
        }
    }
    
    $rootScope.gotocollabchat = function() {
        $rootScope.closepopoverItem();
        $state.go('app.projectdetails', {
            'id': $rootScope.notificationprojectData.member.project
        });
    }

    $scope.deletenotification = function(key, notification) {
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
                        webServices.delete('deletenotification/' + notification.id).then(function(getData) {
                            if (getData.status == 200) {
                                if (!notification.status) {
                                    $rootScope.user.notifications--;
                                }
                                $scope.notifications.splice(key, 1);
                            }
                        });
                    }
                },
                close: function() {}
            }
        });

    }

    $scope.getmyNotifications();
}]);