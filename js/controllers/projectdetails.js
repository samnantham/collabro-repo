'use strict';
app.controller('ProjectDetailCtrl', ['$scope', '$sce', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $sce, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $rootScope.projectData = {};
    $rootScope.chatMessage = {};
    $rootScope.chatMessage.isfile = 0;
    $rootScope.chatMessage.fileurl  = '-';
    

    $scope.getItem = function() {
        webServices.get('project/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.projectData = getData.data;
                $rootScope.ispresentmember = false;
                if($rootScope.user.id == $rootScope.projectData.ownerid){
                    $rootScope.ispresentmember = true;
                }
                else{
                    angular.forEach($rootScope.projectData.members, function(member){
                      if(member.userid == $rootScope.user.id){
                        $rootScope.ispresentmember = true;
                      }
                    });
                }
                if(!$rootScope.ispresentmember){
                    $state.go('app.usermain');
                }else{
                    $rootScope.getChatContent();
                    // $timeout(function() {
                    //     $scope.scrollTo();  
                    // }, 4000);
                }
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.scrollTo = function() {
        if($rootScope.currentdevice == 'mobile'){
            console.log($(window).height());
            $scope.windowheight = ($(window).height()) - 274;
            $('#chatbody').css('min-height', $scope.windowheight + 'px');
        }
    }


    $rootScope.getChatContent = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                $scope.loginFirebaseauth();
            } else if (user.uid == $rootScope.user.firebaseid) {
                $rootScope.ref = firebase.database().ref().child('groupchat').child('project-'+$rootScope.projectData.id);
                $rootScope.chatData = $firebaseArray($rootScope.ref);
                $timeout(function() {
                    //$rootScope.scrollMsgBody();
                }, 2000);
            }
        });
    }

    $rootScope.shareprojecttosocial = function(data){
        $rootScope.shareData = {};
        $rootScope.shareData = data;
        $rootScope.shareData.shareurl = app.projectshareurl;
        $rootScope.sharetype = 'project';
        $rootScope.opensharepopover();
    }

    $scope.loginFirebaseauth = function() {
        firebase.auth().signInWithEmailAndPassword($rootScope.user.email, 'password').then(function(user) {
            console.log(user)
            $rootScope.getChatContent();
        }).catch(function(error) {
            console.log(error);
        });
    }

    $rootScope.sendReplymessage = function() {
        var obj = {};
        obj.productid = $rootScope.projectData.id;
        obj.productchatid = 0;
        obj.lastmessage = $rootScope.chatMessage.message;
        obj.chattype = 2;
        $rootScope.updateUserMsg(obj);
        if(($rootScope.chatMessage.message)||($rootScope.chatMessage.fileurl)) {
            firebase.auth().onAuthStateChanged(function(user) {
                $rootScope.ref.push({
                    user_id: $rootScope.user.id,
                    username: $rootScope.user.username,
                    message: $rootScope.chatMessage.message,
                    avatar:$rootScope.user.avatar,
                    isfile:$rootScope.chatMessage.isfile,
                    fileurl:$rootScope.chatMessage.fileurl,
                    created_at: firebase.database.ServerValue.TIMESTAMP,
                });
                $rootScope.chatMessage.message = '';
                $rootScope.chatMessage.isfile = 0;
                $rootScope.chatMessage.fileurl  = '-';
                $timeout(function() {
                    //$rootScope.scrollMsgBody();
                }, 1000);
               
            });
        }
    }

    $rootScope.$watchCollection('chatData', function (newVal, oldVal) {  $timeout(function() {
                    //$rootScope.scrollMsgBody();
                }, 2000); });
    
    $rootScope.updateUserMsg = function(Data){
        webServices.put('updateuserchat', Data).then(function(getData) {
        });
    }

    $rootScope.editProject = function() {
        $rootScope.iseditproject = true;
        $rootScope.editprojectid = $rootScope.projectData.id;
        $rootScope.opencollaboratemodal();
    }
    
    $scope.getItem();


}]);