'use strict';
app.controller('PrivateChatsCtrl', ['$scope', '$sce', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $sce, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $scope.isfeed = $stateParams.isfeed;
    $scope.chatid = $stateParams.chatid;
    $rootScope.chatMessage = {};
    $rootScope.chatMessage.isfile = 0;
    $rootScope.chatMessage.fileurl  = '-';

    $scope.getPrivateChat = function() {
        webServices.get('privatechat/' + $scope.chatid).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.chatInfo = getData.data;
                if (($rootScope.user.id == $scope.chatInfo.firstuser) || ($rootScope.user.id == $scope.chatInfo.seconduser)) {
                    $scope.chattype = 'privatechat';
                    $scope.firebaseurl = '/private-' + $scope.chatInfo.id + '/';
                    $rootScope.getChatContent();
                    $timeout(function() {
                        $scope.scrollTo();  
                    }, 4000);
                } else {
                    $state.go('app.usermain');
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.getFeedChat = function() {
        webServices.get('feedchat/' + $scope.chatid).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.feedData = getData.data;
                if (($rootScope.user.id == $scope.feedData.userid) || ($rootScope.user.id == $scope.feedData.feed.owner.id)) {
                    $scope.chattype = 'feedchat';
                    $scope.firebaseurl = '/feed-' + $scope.feedData.id + '/';
                    $rootScope.getChatContent();
                    $timeout(function() {
                        $scope.scrollTo();  
                    }, 4000);
                } else {
                    $state.go('app.usermain');
                }
            } else {
                $rootScope.logout();
            }
        
        });
    }
    
    $scope.scrollTo = function() {
        $('html').animate({scrollTop: 700}, 'slow');
        if($rootScope.currentdevice == 'mobile'){
            $scope.windowheight = ($(window).height()) - 350;
            $('.chatmessagecontainer').css('min-height', $scope.windowheight + 'px');
        }
    }

    $scope.updatefeedwish = function(feed, key) {
        var wishstatus = 1;
        if ($scope.feedData.wishstatus == 1) {
            wishstatus = 0;
        }
        webServices.put('feedstatus/' + $scope.feedData.feed.id + '/' + wishstatus).then(function(getData) {
            if (getData.status == 200) {
                $scope.feedData.wishstatus = wishstatus;
            }
        });
    }

    $rootScope.getChatContent = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                $scope.loginFirebaseauth();
            } else if (user.uid == $rootScope.user.firebaseid) {
                $rootScope.ref = firebase.database().ref().child($scope.chattype).child($scope.firebaseurl);
                $rootScope.chatData = $firebaseArray($rootScope.ref);
                $timeout(function() {
                    $rootScope.scrollMsgBody();
                }, 2000);
            }
        });
    }

    $scope.loginFirebaseauth = function() {
        firebase.auth().signInWithEmailAndPassword($rootScope.user.email, 'password').then(function(user) {
            $rootScope.getChatContent();
        }).catch(function(error) {
            console.log(error);
        });
    }

    $rootScope.sendPrivateReplymessage = function() {
        var obj = {};
        obj.productchatid = 0;
        obj.productid = $scope.chatInfo.id;
        obj.lastmessage = $rootScope.chatMessage.message;
        obj.chattype = 4;
        if ($rootScope.user.id == $scope.chatInfo.firstuser) {
            obj.userid = $scope.chatInfo.seconduser;
        } else {
            obj.userid = $scope.chatInfo.firstuser;
        }
        if ($rootScope.chatMessage.message) {
            $rootScope.updateUserMsg(obj);
            firebase.auth().onAuthStateChanged(function(user) {
                $rootScope.ref.push({
                    user_id: $rootScope.user.id,
                    username: $rootScope.user.username,
                    message: $rootScope.chatMessage.message,
                    avatar: $rootScope.user.avatar,
                    isfile: $rootScope.chatMessage.isfile,
                    fileurl: $rootScope.chatMessage.fileurl,
                    created_at: firebase.database.ServerValue.TIMESTAMP,
                });
                $timeout(function() {
                    $rootScope.scrollMsgBody();
                    $rootScope.chatMessage.message = '';
                    $rootScope.chatMessage.isfile = 0;
                    $rootScope.chatMessage.fileurl = '-';
                }, 500);
            });
        }
    }

    $rootScope.$watchCollection('chatData', function (newVal, oldVal) {  $timeout(function() {
                    $rootScope.scrollMsgBody();
                }, 2000); });

    $rootScope.senduserchatattachment = function(files) {
        if (files && files.length) {
            var extn = files[0].name.split(".").pop();
            if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                if (files[0].size <= $rootScope.maxUploadsize) {
                    var obj = {};
                    obj.file = files[0];
                    $rootScope.uploaduserchatattachment(obj);
                } else {
                    $rootScope.$emit("showerrormsg", files[0].name + ' size exceeds 2MB.');
                }
            } else {
                $rootScope.$emit("showerrormsg", files[0].name + ' format unsupported.');
            }
        }
    }

    $rootScope.uploaduserchatattachment = function(obj) {
        webServices.upload('uploadattachment', obj).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.chatMessage.fileurl = getData.data;
                $rootScope.chatMessage.message = 'Uploaded a File';
                $rootScope.chatMessage.isfile = 1;
                if($scope.isfeed == 1){
                    $rootScope.sendFeedReplymessage();
                }else{
                    $rootScope.sendPrivateReplymessage();
                }
            }
        });
    }

    $rootScope.sendFeedReplymessage = function() {
        var obj = {};
        obj.productchatid = 0;
        obj.productid = $scope.feedData.id;
        obj.lastmessage = $rootScope.chatMessage.message;
        obj.chattype = 3;
        if ($rootScope.user.id == $scope.feedData.feed.owner.id) {
            obj.userid = $scope.feedData.userid;
        } else {
            obj.userid = $scope.feedData.feed.owner.id;
        }
        $rootScope.updateUserMsg(obj);
        if ($rootScope.chatMessage.message) {
            firebase.auth().onAuthStateChanged(function(user) {
                $rootScope.ref.push({
                    user_id: $rootScope.user.id,
                    username: $rootScope.user.username,
                    message: $rootScope.chatMessage.message,
                    avatar: $rootScope.user.avatar,
                    isfile: $rootScope.chatMessage.isfile,
                    fileurl: $rootScope.chatMessage.fileurl,
                    created_at: firebase.database.ServerValue.TIMESTAMP,
                });
                $timeout(function() {
                    $rootScope.scrollMsgBody();
                    $rootScope.chatMessage.message = "";
                    $rootScope.chatMessage.isfile = 0;
                    $rootScope.chatMessage.fileurl = '-';
                }, 500);
            });
        }
    }

    $rootScope.updateUserMsg = function(Data) {
        webServices.put('updateuserchat', Data).then(function(getData) {
            console.log(getData);
        });
    }

    $scope.getfriendsfollowers = function() {
        webServices.get('myrecentfriendsandfollowers').then(function(getData) {
            if (getData.status == 200) {
                $scope.friendsandfollowers = getData.data;
                if ($scope.isfeed == 0) {
                    $scope.getPrivateChat();
                } else if ($scope.isfeed == 1) {
                    $scope.getFeedChat();
                }
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.changefollowstatus = function(type,followstatus) {
        
        if (followstatus) {
            var status = 0;
        } else {
            var status = 1;
        }

        if(type == 'private'){
            if($rootScope.user.id == $scope.chatInfo.firstuser){
                var userid = $scope.chatInfo.seconduser;
            }else{
                var userid = $scope.chatInfo.firstuser;
            }
        }else if(type == 'feed'){
            if($rootScope.user.id == $scope.feedData.userid){
                var userid = $scope.feedData.feed.owner.id;
            }else{
                var userid = $scope.feedData.userid;
            }
        }
        
        webServices.put('followstatus/' + userid + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                if(type == 'private'){
                    $scope.chatInfo.isfollow = status;
                }else if(type == 'feed'){
                    $scope.feedData.isfollow = status;
                }
            }
        });
    }

    $scope.gotouserProducts = function() {
        if($scope.isfeed == 1){
            if($rootScope.user.id == $scope.feedData.userid){
                var userid = $scope.feedData.feed.owner.id;
            }else{
                var userid = $scope.feedData.userid;
            }
        }else{
            if($rootScope.user.id == $scope.chatInfo.firstuser){
                var userid = $scope.chatInfo.seconduser;
            }else{
                var userid = $scope.chatInfo.firstuser;
            }
        }
        $state.go('app.userproducts', {
                        'id': userid
                    });
    }

    $scope.getfriendsfollowers();


}]);