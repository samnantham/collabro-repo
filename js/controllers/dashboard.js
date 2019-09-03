'use strict';
app.controller('DashboardCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', 'authServices', '$ngConfirm','$modal', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, authServices, $ngConfirm, $modal) {
    
    $scope.userData = {};
    $scope.activetab = 'profile';
    $scope.bottomactivetab = 'followers';
    $scope.centeractivetab = 'xpearning';
    $scope.profileedit = false;
    $scope.addressedit = false;
    $scope.ispagechanged = false;
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 8;
    $scope.pagination = {
        current: 1
    };
    $scope.pagedata = [];
    $scope.myProducts = [];

    if ($rootScope.user) {
        if (!$rootScope.user.username) {
            $rootScope.logout();
        }
    }

    $scope.updateInterestarea = function(item){
        webServices.put('myinterestarea',item).then(function(getData) {
            if (getData.status == 200) {
            } else if (getData.status == 401) {
                $scope.errors = utility.getError(getData.data.message);
                $rootScope.$emit("showerrors", $scope.errors);
            }
        });
    }

    $scope.setMyData = function() {
        $rootScope.formLoading = false;
        $timeout(function() {
            $scope.userData = angular.copy($rootScope.user);
        }, 1000);
    }

    $scope.openOTPModal = function() {
        webServices.get('getmyotp').then(function(getData) {
            console.log(getData)
            if (getData.status == 200) {
                $scope.otpData = {};
                $scope.otpData.otp = '';
                $scope.otperrors = {};
                $rootScope.openModalPopup('otpmodal','OTPModalCtrl');
            }
        });
    }

    $scope.openChatlistModal = function(chats) {
        if (chats.length > 0) {
            $scope.chats = [];
            $scope.chats = chats;
            $rootScope.openModalPopup('chatusersmodal','ChatUserModalCtrl');
        }
    }


    $scope.getMyProducts = function() {
        webServices.get('myproducts?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.myProducts = getData.data;
                $scope.pagedata[$scope.pageno] = getData.data;
                if (!$scope.userData.id) {
                    $scope.setMyData();
                } else {
                    $rootScope.formLoading = false;
                    if($scope.ispagechanged){
                        $scope.ispagechanged = false;
                        //$scope.scrollTo();
                    }
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.removeproduct = function(product) {
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
                        webServices.delete('product/' + product.id).then(function(getData) {
                            if (getData.status == 200) {
                                $scope.getMyProducts();
                            }
                        });
                    }
                },
                close: function() {}
            }
        });

    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.pagedata[$scope.pageno]) {
            $scope.ispagechanged = true;
            $scope.getMyProducts();
        } else {
            $scope.myProducts = $scope.pagedata[$scope.pageno];
            //$scope.scrollTo();
        }
    };

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
        webServices.get('mychartdata').then(function(getData) {
            if (getData.status == 200) {
                $scope.chartData = getData.data;
                $scope.getBottomData();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.getBottomData = function() {
        webServices.get('myotherinfo').then(function(getData) {
            if (getData.status == 200) {
                $scope.otherData = getData.data;
                $scope.getMyProducts();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.setactivetab = function(tab) {
        if (tab != $scope.activetab) {
            $scope.profileedit = false;
            $scope.addressedit = false;
            $scope.activetab = tab;
            $scope.passwordData = {};
        }
    }

    $scope.setbottomactivetab = function(tab) {
        if (tab != $scope.bottomactivetab) {
            $scope.bottomactivetab = tab;
        }
    }

    $scope.setcenteractivetab = function(tab) {
        if (tab != $scope.centeractivetab) {
            $scope.centeractivetab = tab;
        }
    }

    $scope.showhideedit = function() {
        if ($scope.activetab == 'profile') {
            $timeout(function() {
                $scope.profileedit = !$scope.profileedit;
                if ($scope.profileedit) {
                    $scope.editData = {};
                    $scope.editData = angular.copy($scope.userData);
                    if (!$scope.editData.website) {
                        $scope.editData.website = 'collabro.com/' + $scope.userData.username;
                    }
                    console.log($scope.profileedit);
                }
            }, 1000);
        } else if ($scope.activetab == 'address') {
            $timeout(function() {
                $scope.addressedit = !$scope.addressedit;
                $scope.setMyData();
            }, 1000);
        }
    }

    $scope.saveProfile = function(form) {
        $scope.errors = [];
        if (form.$valid) {
            $rootScope.formLoading = true;
            webServices.upload('profileinfo', $scope.editData).then(function(getData) {
                $rootScope.formLoading = false;
                if (getData.status == 200) {
                    $rootScope.getUserInfo();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $scope.setMyData();
                    $scope.profileedit = false;
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    console.log($scope.errors);
                    $rootScope.$emit("showerrors", $scope.errors);
                }

            });
        } else {
            if (!form.country.$valid) {
                $scope.errors.push('Please enter your country');
            }
            if (!form.profession.$valid) {
                $scope.errors.push('Please enter your profession');
            }
            if (!form.phonenumber.$valid) {
                $scope.errors.push('Please enter your phonenumber');
            }
            if (!form.username.$valid) {
                $scope.errors.push('Please enter your name');
            }
            $rootScope.$emit("showerrors", $scope.errors);
        }
    }

    $scope.saveAddress = function(form) {
        $scope.errors = [];
        if (form.$valid) {
            $rootScope.formLoading = true;
            webServices.upload('addressinfo', $scope.userData).then(function(getData) {
                $rootScope.formLoading = false;
                if (getData.status == 200) {
                    $rootScope.getUserInfo();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $scope.setMyData();
                    $scope.addressedit = false;
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    $rootScope.$emit("showerrors", $scope.errors);
                }

            });
        } else {
            if (!form.address.$valid) {
                $scope.errors.push('Please enter your address');
            }
            if (!form.postalcode.$valid) {
                $scope.errors.push('Please enter your postalcode');
            }
            if (!form.phonenumber.$valid) {
                $scope.errors.push('Please enter your phonenumber');
            }
            if (!form.email.$valid) {
                $scope.errors.push('Please enter your email');
            }
            if (!form.countrycode.$valid) {
                $scope.errors.push('Please enter your countrycode');
            }
            $rootScope.$emit("showerrors", $scope.errors);
        }
    }

     $scope.changePassword = function(form) {
        $scope.errors = [];
        if (form.$valid) {
            $rootScope.formLoading = true;
            webServices.post('changepassword', $scope.passwordData).then(function(getData) {
                $rootScope.formLoading = false;
                if (getData.status == 200) {
                    $rootScope.getUserInfo();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $scope.setMyData();
                    $scope.passwordData = {};
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    $rootScope.$emit("showerrors", $scope.errors);
                }

            });
        } else {
            
            if (!form.confirmpassword.$valid) {
                $scope.errors.push('Please confirm your new password');
            }if (!form.newpassword.$valid) {
                $scope.errors.push('Please enter your new password and minimum 8 charecters needed');
            }if (!form.currentpassword.$valid) {
                $scope.errors.push('Please enter your Current Password');
            }
    
            $rootScope.$emit("showerrors", $scope.errors);
        }
    }


    $scope.uploadProfileimg = function(files) {
        if (files && files.length) {
            var extn = files[0].name.split(".").pop();
            if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                if (files[0].size <= $rootScope.maxUploadsize) {
                    $scope.editData.profileimg = files[0];
                } else {
                    $rootScope.$emit("showerrormsg", files[0].name + ' size exceeds 2MB.');
                }
            } else {
                $rootScope.$emit("showerrormsg", files[0].name + ' format unsupported.');
            }
        }
    }

    $scope.getfriendsfollowers();

}]);