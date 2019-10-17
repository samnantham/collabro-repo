'use strict';
app.controller('FeedChatCtrl', ['$scope', '$sce', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $sce, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $scope.chatid = $stateParams.chatid;
    $scope.feed =
    $rootScope.chatMessage = {};
    $rootScope.chatMessage.isfile = 0;
    $rootScope.chatMessage.fileurl  = '-';

    $scope.getFeedChat = function() {
        webServices.get('feedchat/' + $scope.chatid).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.feedchat = getData.data;
                $scope.feedData = getData.data.feed;
                if (($rootScope.user.id == $scope.feedchat.userid) || ($rootScope.user.id == $scope.feedchat.feed.owner.id)) {
                    $scope.chattype = 'feedchat';
                    $scope.firebaseurl = '/feed-' + $scope.feedchat.id + '/';
                    $rootScope.getChatContent();
                } else {
                    $state.go('app.usermain');
                }
            } else {
                $rootScope.logout();
            }
        
        });
    }

    $scope.updatefeedwish = function(feed, key) {
        var wishstatus = 1;
        if ($scope.feedchat.wishstatus == 1) {
            wishstatus = 0;
        }
        webServices.put('feedstatus/' + $scope.feedchat.feed.id + '/' + wishstatus).then(function(getData) {
            if (getData.status == 200) {
                $scope.feedchat.wishstatus = wishstatus;
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
                $rootScope.sendReplymessage();
            }
        });
    }

    $rootScope.sendReplymessage = function() {
        var obj = {};
        obj.productchatid = 0;
        obj.productid = $scope.feedchat.id;
        obj.lastmessage = $rootScope.chatMessage.message;
        obj.chattype = 3;
        if ($rootScope.user.id == $scope.feedchat.feed.owner.id) {
            obj.userid = $scope.feedchat.userid;
        } else {
            obj.userid = $scope.feedchat.feed.owner.id;
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
                    //$rootScope.scrollMsgBody();
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
                $scope.getFeedChat();
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

        if($rootScope.user.id == $scope.feedchat.userid){
            var userid = $scope.feedchat.feed.owner.id;
        }else{
            var userid = $scope.feedchat.userid;
        }

        webServices.put('followstatus/' + userid + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                if(type == 'private'){
                    $scope.chatInfo.isfollow = status;
                }else if(type == 'feed'){
                    $scope.feedchat.isfollow = status;
                }
            }
        });
    }

    $scope.gotouserProducts = function() {
        if($rootScope.user.id == $scope.feedchat.userid){
            var userid = $scope.feedchat.feed.owner.id;
        }else{
            var userid = $scope.feedchat.userid;
        }
        
        $state.go('app.userproducts', {
            'id': userid
        });
    }

    $scope.getfriendsfollowers();


}]);