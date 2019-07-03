'use strict';
app.controller('ProductChatCtrl', ['$scope', '$sce', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $sce, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $rootScope.ProductViewData = {};
    $rootScope.chatMessage = {};
    $rootScope.chatData = [];
    $rootScope.chatMessage.isfile = 0;
    $rootScope.chatMessage.fileurl  = '-';
    

    $scope.getItem = function() {
        webServices.get('productchat/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.ProductViewData = getData.data.product;
                $scope.ChatUserData = getData.data;
                $rootScope.formLoading = false;
                if(($scope.ChatUserData.userid == $rootScope.user.id)||($rootScope.ProductViewData.ownerid == $rootScope.user.id)){
                    $rootScope.getChatContent();
                }else{
                    $state.go('app.usermain');
                }
                $timeout(function() {
                    $rootScope.$emit("callStickyMenu", {});
                    $scope.scrollTo();  
                }, 2000);
            } else {
                $rootScope.logout();
            }
        });
    };
    
    $scope.scrollTo = function() {
        $('html').animate({scrollTop: 700}, 'slow');
        if($rootScope.currentdevice == 'mobile'){
            $scope.windowheight = ($(window).height()) - 350;
            $('#chatbody').css('min-height', $scope.windowheight + 'px');
        }
    }

    $scope.changefollowstatus = function(followstatus,user) {
        if (followstatus) {
            var status = 0;
        } else {
            var status = 1;
        }
        webServices.put('followstatus/' + user + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.ProductViewData.isfollow = status;
            }
        });
    }

    $rootScope.getChatContent = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                $scope.loginFirebaseauth();
            } else if (user.uid == $rootScope.user.firebaseid) {
                $rootScope.ref = firebase.database().ref().child('productchat').child('/'+$rootScope.ProductViewData.id+'-'+$rootScope.ProductViewData.ownerid+'-'+$rootScope.ProductViewData.buyer.id+'/');
                $rootScope.chatData = $firebaseArray($rootScope.ref);
                $timeout(function() {
                    $rootScope.scrollMsgBody();
                }, 4000);
            }
        });
    }

    $scope.updatewishstatus = function(){
        var obj = {};
        obj.productid = $rootScope.ProductViewData.id;
        if($rootScope.ProductViewData.wishstatus == 1){
            obj.wishstatus = 0;
        }else{
            obj.wishstatus = 1;
        }
    
        webServices.put('updatewish' , obj).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.ProductViewData.wishstatus = obj.wishstatus;
            }
        });
    }

    $scope.loginFirebaseauth = function() {
        firebase.auth().signInWithEmailAndPassword($rootScope.user.email, 'password').then(function() {
            $rootScope.getChatContent();
        }).catch(function(error) {
            console.log(error);
        });
    }

    $rootScope.sendReplymessage = function() {
        var obj = {};
        obj.productid = $rootScope.ProductViewData.id;
        obj.productchatid = $stateParams.id;
        obj.lastmessage = $rootScope.chatMessage.message;
        obj.chattype = 1;
        if($rootScope.user.id == $rootScope.ProductViewData.ownerid){
            obj.userid = $rootScope.ProductViewData.buyer.id;
        }if($rootScope.user.id == $rootScope.ProductViewData.buyer.id){
            obj.userid = $rootScope.ProductViewData.ownerid;
        }
        $rootScope.updateUserMsg(obj);
        if ($rootScope.chatMessage.message) {
            firebase.auth().onAuthStateChanged(function(user) {
                $rootScope.ref.push({
                    user_id: $rootScope.user.id,
                    message: $rootScope.chatMessage.message,
                    isfile:$rootScope.chatMessage.isfile,
                    fileurl:$rootScope.chatMessage.fileurl,
                    created_at: firebase.database.ServerValue.TIMESTAMP,
                });
                $rootScope.chatMessage.message = '';
                $rootScope.chatMessage.isfile = 0;
                $rootScope.chatMessage.fileurl  = '-';
                $timeout(function() {
                    $rootScope.scrollMsgBody();
                }, 1000);
            });
        }
    }

    $rootScope.$watchCollection('chatData', function (newVal, oldVal) {  $timeout(function() {
                    $rootScope.scrollMsgBody();
                }, 2000); });

    $rootScope.updateUserMsg = function(Data){
        webServices.put('updateuserchat', Data).then(function(getData) {
            console.log(getData);
        });
    }

     $rootScope.sendchatattachment = function(files) {
        if (files && files.length) {
            var extn = files[0].name.split(".").pop();
            if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                if (files[0].size <= 2000000) {
                    var obj = {};
                    obj.file = files[0];
                    $rootScope.uploadchatattachment(obj);
                } else {
                    $rootScope.$emit("showerrormsg", files[0].name + ' size exceeds 2MB.');
                }
            } else {
                $rootScope.$emit("showerrormsg", files[0].name + ' format unsupported.');
            }
        }
    }

    $rootScope.uploadchatattachment = function(obj) {
        webServices.upload('uploadattachment', obj).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.chatMessage.fileurl = getData.data;
                $rootScope.chatMessage.message = 'Uploaded a File';
                $rootScope.chatMessage.isfile = 1;
                $rootScope.sendReplymessage();
            }
        });
    }

    $scope.gotouserProducts = function() {
        if($rootScope.ProductViewData.owner.id == $rootScope.user.id){
            $state.go('app.userproducts', {
                        'id': $rootScope.ProductViewData.buyer.id
                    });
        }else{
            $state.go('app.userproducts', {
                        'id': $rootScope.ProductViewData.owner.id
                    });
        }
    }

    $scope.getItem();

}]);