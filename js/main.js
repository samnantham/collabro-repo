'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$location', '$sce', '$sessionStorage', '$window', 'webServices', 'utility', '$rootScope', '$state', '$timeout', '$aside', 'Facebook', 'GoogleSignin', 'authServices', 'isMobile', '$modal', '$filter', 'ngNotify', 'webNotification', 'bowser', '$document',
        function($scope, $location, $sce, $sessionStorage, $window, webServices, utility, $rootScope, $state, $timeout, $aside, Facebook, GoogleSignin, authServices, isMobile, $modal, $filter, ngNotify, webNotification, bowser, $modalInstance, $document) {
            $rootScope.formLoading = true;
            $rootScope.pageloading = true;
            if (isMobile.phone) {
                $rootScope.currentdevice = 'mobile';
            } else {
                $rootScope.currentdevice = 'desktop';
            }

            $rootScope.isAsideOpen = false;
            $rootScope.userData = {};
            $rootScope.shareData = {};
            $rootScope.loginModel = {};
            $rootScope.user = {};
            $rootScope.registerModel = {};
            $rootScope.chatImages = {};
            $rootScope.forgotModel = {};
            $rootScope.categories = [];
            $rootScope.fromfriendspage = false;
            $rootScope.chatImages.show = false;
            $rootScope.fromfriendspage = false;
            $rootScope.ismodalopen = false;
            $rootScope.validextensions = angular.copy(app.imgextensions);
            $rootScope.servicetypes = angular.copy(app.servicetypes);
            $rootScope.requestservicetypes = angular.copy(app.requestservicetypes);
            $rootScope.requestcategories = angular.copy(app.requestcategories);
            $rootScope.todotypes = angular.copy(app.todotypes);
            $rootScope.projecttypes = angular.copy(app.projecttypes);
            $rootScope.periodtypes = angular.copy(app.periodtypes);
            $rootScope.locations = angular.copy(app.locations);
            $rootScope.currencies = angular.copy(app.currencies);
            $rootScope.times = angular.copy(app.times);
            $rootScope.validextensions = angular.copy(app.imgextensions);
            $rootScope.professions = angular.copy(app.professions);
            $rootScope.rentaltypes = angular.copy(app.rentaltypes);
            $rootScope.eventtypes = angular.copy(app.eventtypes);
            $rootScope.maxUploadsize = angular.copy(app.maxUploadsize);
            $rootScope.redirectroutes = angular.copy(app.redirectroutes);
            $rootScope.categories = [];
            $rootScope.registerModel.iscompany = '0';
            $scope.thisyear = new Date().getFullYear();
            $rootScope.IMGURL = app.imageurl;
            $rootScope.issignup = false;
            $rootScope.issignin = false;
            $rootScope.isforgotpw = false;
            $rootScope.googleloading = false;
            $rootScope.facebookloading = false;
            $rootScope.loginloading = false;
            $rootScope.registerloading = false;
            $rootScope.forgotloading = false;
            $rootScope.showsearch = true;
            $rootScope.ismodalPopover = false;
            $rootScope.menustatus = {
                isopen: false
            };
            $rootScope.keywords = []; /*['Make-Up Artist', 'Car Rental', 'Photography', 'Wardrobe', 'Interior Design', 'Trending Group', 'Decor and Lights', 'Wedding Gifts', 'Sparkling Shoes', 'Videography'];*/
            $rootScope.searchData = {};
            $rootScope.activebg = 'home';

            $rootScope.scrollbarConfig = {
                advanced: {
                    updateOnContentResize: true
                },
                scrollInertia: 400,
                setWidth: 300,
                axis: 'y',
                autoHideScrollbar: true
            }

            $rootScope.gotoMenu = function(menu){
                $rootScope.activemenu = menu;
            }

            $rootScope.$watch('formLoading', function() {
                if (!$rootScope.formLoading) {
                    if ($rootScope.pageloading) {
                        if (($rootScope.stateurl == 'home') || ($rootScope.stateurl == 'main') || ($rootScope.stateurl == 'searchitems')) {
                            if ($rootScope.stateurl == 'searchitems') {
                                $rootScope.setSliderConfig();
                            }
                            if (localStorage.userData && !isMobile.phone) {
                                var userData = JSON.parse(localStorage.userData);
                                if (userData.rememberme == 1) {
                                    $rootScope.userData = JSON.parse(localStorage.userData);
                                }
                            }
                        } else if ($rootScope.stateurl == 'usermain') {
                            $rootScope.setSliderConfig();
                        }
                        $rootScope.pageloading = false;
                    }
                    $timeout(function() {
                        $rootScope.$emit("callStickyMenu", {});
                    }, 1000);
                }
            });


            $rootScope.banners = ['img/Collaborate.png', 'img/BG1.png', 'img/features.jpg', 'img/benefits.jpg', 'img/tour.jpg', 'img/more.jpg'];

            $rootScope.openModal = function() {
                if (!$rootScope.ismodalopen) {
                    $rootScope.openModalPopup('productmodal', 'ProductModalCtrl');
                }
            }

            $rootScope.opentodoModal = function() {
                if (!$rootScope.ismodalopen) {
                    $rootScope.openModalPopup('todomodal', 'TodoModalCtrl');
                }
            }

            $rootScope.openRequestModal = function() {
                if (!$rootScope.ismodalopen) {
                    $rootScope.openModalPopup('requestmodal', 'RequestModalCtrl');
                }
            }

            $rootScope.productslick = {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.slider-nav',
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
            };

            $rootScope.logintoProduct = function(product) {
                $rootScope.redirectproduct = product;
                $rootScope.isPopover = false;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                $rootScope.issignin = true;
            }

            $rootScope.productthumbslick = {
                focusOnSelect: true,
                infinite: false,
                initialSlide: 0,
                slidesToShow: 5,
                asNavFor: '.slider-for',
                slidesToScroll: 1,
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
            };

            $rootScope.mobilethumbslick = {
                focusOnSelect: true,
                infinite: false,
                initialSlide: 0,
                slidesToShow: 3,
                asNavFor: '.slider-for',
                slidesToScroll: 1,
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
            };

            $rootScope.productslickmodal = {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                fade: true,
                asNavFor: '.slider-nav-modal',
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
            };



            $rootScope.modalproductthumbslick = {
                focusOnSelect: true,
                infinite: false,
                initialSlide: 0,
                slidesToShow: 3,
                asNavFor: '.slider-for-modal',
                slidesToScroll: 1,
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.slickCurrentIndex2 = currentSlide;
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
                    }
                }
            };

            $rootScope.convertDate = function(date) {
                return Date.parse(date);
            }

            $rootScope.openbroadcastModal = function() {
                if (!$rootScope.ismodalopen) {
                    $rootScope.openModalPopup('broadcastmodal', 'BroadcastModalCtrl');
                }
            }

            $rootScope.viewChatImg = function(chat) {
                $rootScope.chatImages = {};
                $rootScope.chatImages.show = true;
                $rootScope.chatImages.fileurl = chat.fileurl;
                var filenamearray = $rootScope.chatImages.fileurl.split("/");
                $rootScope.downloadfilename = filenamearray[filenamearray.length - 1];

                var dialogInst = $modal.open({
                    animation: true,
                    templateUrl: 'tpl/blocks/popover/chatimagepopover.html',
                    controller: 'DialogInstCtrl'
                });
            }

            $rootScope.openCollaborateResponseModal = function() {
                if (!$rootScope.ismodalopen) {
                    $rootScope.openModalPopup('collaborateresponsemodal', 'CollaborateResponseModalCtrl');
                }
            }

            $rootScope.goback = function() {
                history.back();
            }

            $rootScope.sharetosocial = function(data) {
                $rootScope.shareData = {};
                $rootScope.shareData = data;
                $rootScope.shareData.shareurl = app.productshareurl;
                $rootScope.sharetype = 'product';
                $rootScope.opensharepopover();

            }

            $rootScope.opensharepopover = function() {
                var dialogInst = $modal.open({
                    animation: true,
                    templateUrl: 'tpl/blocks/popover/sharepopover.html',
                    controller: 'DialogInstCtrl',
                    size: 'sm',
                    windowClass: 'share-popover',
                });
            }

            $rootScope.sharetodo = function(data){
                $rootScope.shareData = {};
                $rootScope.shareData = data;
                $rootScope.shareData.shareurl = app.todoshareurl;
                $rootScope.sharetype = 'todo';
                $rootScope.opensharepopover();
            }

            $rootScope.stoploading = function() {
                //$rootScope.$emit("scrolltop", {});
                $rootScope.formLoading = false;
                $rootScope.$emit("callStickyMenu", {});
            }

            $rootScope.screenWidth = window.innerWidth;

            $(window).resize(function() {
                $rootScope.screenWidth = window.innerWidth;
                $rootScope.setSliderConfig();
                //$state.reload();
                if ($rootScope.screenWidth < 800) {
                    $rootScope.currentdevice = 'mobile';
                } else {
                    $rootScope.currentdevice = 'desktop';
                    $rootScope.setSliderConfig();
                }
            });

            $rootScope.setSliderConfig = function() {
                if (!isMobile.phone) {
                    if (($rootScope.screenWidth >= 960) && ($rootScope.screenWidth < 1151)) {
                        $rootScope.scrollslides = 3;
                        $rootScope.slidecount = 3;
                    } else if (($rootScope.screenWidth > 1151) && ($rootScope.screenWidth < 1320)) {
                        $rootScope.scrollslides = 4;
                        $rootScope.slidecount = 4;
                    } else if (($rootScope.screenWidth >= 1320) && ($rootScope.screenWidth < 1500)) {
                        $rootScope.scrollslides = 4;
                        $rootScope.slidecount = 4;
                    } else {
                        $rootScope.scrollslides = 4;
                        $rootScope.slidecount = 4;
                    }
                } else {
                    $rootScope.slidecount = 2;
                    $rootScope.scrollslides = 2;
                }

                $scope.slickConfig = {
                    enabled: true,
                    autoplay: false,
                    draggable: false,
                    slidesToShow: $rootScope.slidecount,
                    slidesToScroll: $rootScope.scrollslides,
                };
            }

            $rootScope.fbshare = function() {
                if ($rootScope.sharetype == 'product') {
                    if ($rootScope.shareData.images[0].filetype == 1) {
                        var IMGURL = $rootScope.IMGURL + $rootScope.shareData.images[0].thumbnail;
                    } else {
                        var IMGURL = $rootScope.shareData.images[0].thumbnail;
                    }
                    Facebook.ui({
                        method: 'feed',
                        name: $rootScope.shareData.title,
                        link: $rootScope.shareData.shareurl + $rootScope.shareData.id,
                        picture: IMGURL,
                        caption: $rootScope.shareData.title,
                        description: $rootScope.shareData.description
                    }, function(response) {
                        if (response === null) {
                            console.log('was not shared');
                        } else {
                            if ((response == undefined) || (response.hasOwnProperty('error_code'))) {
                                console.log('not shared');
                            } else {
                                $rootScope.updateforsocialshare(1);
                                $rootScope.closepopoverItem();
                                console.log('shared success');
                            }
                        }
                    });
                } else if ($rootScope.sharetype == 'friend') {
                    var IMGURL = $rootScope.IMGURL + $rootScope.shareData.avatar;
                    Facebook.ui({
                        method: 'feed',
                        name: $rootScope.shareData.username,
                        link: $rootScope.shareData.shareurl + $rootScope.shareData.id,
                        picture: IMGURL,
                        caption: $rootScope.shareData.username,
                        description: $rootScope.shareData.aboutme
                    }, function(response) {
                        if (response === null) {
                            console.log('was not shared');
                        } else {
                            if ((response == undefined) || (response.hasOwnProperty('error_code'))) {
                                console.log('not shared');
                            } else {
                                //$rootScope.updateforsocialshare(1);
                                $rootScope.closepopoverItem();
                                console.log('shared success');
                            }
                        }
                    });
                } else if ($rootScope.sharetype == 'feed') {
                    var IMGURL = $rootScope.IMGURL + $rootScope.shareData.owner.avatar;
                    Facebook.ui({
                        method: 'feed',
                        name: $rootScope.shareData.title,
                        link: $rootScope.shareData.shareurl + $rootScope.shareData.id,
                        picture: IMGURL,
                        caption: $rootScope.shareData.title,
                        description: $rootScope.shareData.description
                    }, function(response) {
                        if (response === null) {
                            console.log('was not shared');
                        } else {
                            if ((response == undefined) || (response.hasOwnProperty('error_code'))) {
                                console.log('not shared');
                            } else {
                                //$rootScope.updateforsocialshare(1);
                                $rootScope.closepopoverItem();
                                console.log('shared success');
                            }
                        }
                    });
                } else if ($rootScope.sharetype == 'project') {
                    if ($rootScope.shareData.files[0].filetype == 1) {
                        var IMGURL = $rootScope.IMGURL + $rootScope.shareData.files[0].thumbnail;
                    } else {
                        var IMGURL = $rootScope.shareData.files[0].thumbnail;
                    }
                    Facebook.ui({
                        method: 'feed',
                        name: $rootScope.shareData.title,
                        link: $rootScope.shareData.shareurl + $rootScope.shareData.id,
                        picture: IMGURL,
                        caption: $rootScope.shareData.title,
                        description: $rootScope.shareData.description
                    }, function(response) {
                        if (response === null) {
                            console.log('was not shared');
                        } else {
                            if ((response == undefined) || (response.hasOwnProperty('error_code'))) {
                                console.log('not shared');
                            } else {
                                $rootScope.updateforsocialshare(1);
                                $rootScope.closepopoverItem();
                                console.log('shared success');
                            }
                        }
                    });
                }else if ($rootScope.sharetype == 'todo') {
                    if ($rootScope.shareData.images[0].filetype == 1) {
                        var IMGURL = $rootScope.IMGURL + $rootScope.shareData.images[0].thumbnail;
                    } else {
                        var IMGURL = $rootScope.shareData.images[0].thumbnail;
                    }
                    Facebook.ui({
                        method: 'feed',
                        name: $rootScope.shareData.title,
                        link: $rootScope.shareData.shareurl + $rootScope.shareData.id,
                        picture: IMGURL,
                        caption: $rootScope.shareData.title,
                        description: $rootScope.shareData.description
                    }, function(response) {
                        if (response === null) {
                            console.log('was not shared');
                        } else {
                            if ((response == undefined) || (response.hasOwnProperty('error_code'))) {
                                console.log('not shared');
                            } else {
                                $rootScope.updateforsocialshare(1);
                                $rootScope.closepopoverItem();
                                console.log('shared success');
                            }
                        }
                    });
                }

            }

            $rootScope.sharefeedtosocial = function(data) {
                $rootScope.shareData = {};
                $rootScope.shareData = data;
                $rootScope.shareData.shareurl = app.feedshareurl;
                $rootScope.sharetype = 'feed';
                $rootScope.opensharepopover();
            }

            $rootScope.closeproductModal = function() {
                $rootScope.formData = {};
                $rootScope.formData.type = '';
                $rootScope.viewingThumb = {};
                $rootScope.closepopoverItem();
            };

             $rootScope.closerequestModal = function() {
                $rootScope.formData = {};
                $rootScope.formData.type = '';
                $rootScope.viewingThumb = {};
                $rootScope.closepopoverItem();
            };

            $rootScope.closebroadcastModal = function() {
                $rootScope.formData = {};
                $rootScope.formData.type = '';
                $rootScope.viewingThumb = {};
                $rootScope.closepopoverItem();
            };

            $rootScope.closetodoModal = function() {
                $rootScope.todoData = {};
                $rootScope.todoData.type = '';
                $rootScope.viewingThumb = {};
                $rootScope.closepopoverItem();
            };

            

            $rootScope.closecollaboratemodal = function() {
                $rootScope.closepopoverItem();
                $rootScope.fromfriendspage = false;
                $rootScope.formData = {};
                $rootScope.formData.type = '';
                $rootScope.viewingThumb = {};
                $rootScope.resetProductItems();
            };

            $rootScope.labels = ["Profit Earned", "Rental Earned", "Experience Points", "Advertisement Spent"];
            $rootScope.Colors = ["#ffc500", "#ff1561", "#59c74a", "#00d8ff"];
            $rootScope.ChartOptions = {
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                },
                width: 500,
                height: 300,
                cutoutPercentage: 70,
                responsive: true,
                segmentShowStroke: false
            };

            if (!localStorage.showheader) {
                $rootScope.showheader = true;
            } else {
                $rootScope.showheader = false;
            }


            $rootScope.updateforsocialshare = function(type) {
                webServices.put('addsocialxp/' + type).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.$emit("showsuccessmsg", getData.data.message);
                        $rootScope.getUserInfo();
                    }
                });
            }

            $rootScope.updatestatus = function(status) {
                webServices.put('mystatus/' + status).then(function(getData) {
                    if (getData.status == 200) {
                        $sessionStorage.user.onlinestatus = status;
                        localStorage.user = JSON.stringify($sessionStorage.user);
                        $rootScope.user = $sessionStorage.user;
                    }
                });
            }

            $rootScope.sendattachment = function(files) {
                if (files && files.length) {
                    var extn = files[0].name.split(".").pop();
                    if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                        if (files[0].size <= $rootScope.maxUploadsize) {
                            var obj = {};
                            obj.file = files[0];
                            $rootScope.uploadattachment(obj);
                        } else {
                            $rootScope.$emit("showerrormsg", files[i].name + ' size exceeds 2MB.');
                        }
                    } else {
                        $rootScope.$emit("showerrormsg", files[i].name + ' format unsupported.');
                    }
                }
            }

            $rootScope.uploadattachment = function(obj) {
                webServices.upload('uploadattachment', obj).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.chatMessage.fileurl = getData.data;
                        $rootScope.chatMessage.message = 'Uploaded a File';
                        $rootScope.chatMessage.isfile = 1;
                        $rootScope.sendReplymessage();
                    }
                });
            }

            $rootScope.closepopoverItem = function() {
                $rootScope.formData = {};
                $rootScope.shareData = {};
                $rootScope.chatImages = {};
                $rootScope.ismodalopen = false;
                $rootScope.isPopover = false;
                $rootScope.iseditproduct = false;
                if ($rootScope.stateurl == 'viewproduct') {
                    if($rootScope.currentdevice == 'desktop'){
                        $state.go('app.main');
                    }else{
                        $state.go('app.mobilemain');
                    }
                }
                $('.modal-content > .ng-scope').each(function() {
                    $(this).scope().$dismiss();
                });
            }

            $rootScope.getUserInfo = function() {
                $scope.errors = [];
                webServices.get('getauthenticateduser').then(function(getData) {
                    if (getData.status == 200) {
                        $sessionStorage.user = getData.data;
                        localStorage.user = JSON.stringify($sessionStorage.user);
                        $rootScope.user = $sessionStorage.user;
                        var xppoints = $rootScope.user.experiencepoints * 100 / $rootScope.user.allowedXP;
                        $rootScope.chartdata = [0, 0, $rootScope.user.experiencepoints, 0];
                    } else if(getData.status == 401){
                        $scope.errors.push(getData.data.message);
                        $rootScope.$emit("showerrors", $scope.errors);
                        $rootScope.logout();
                    }else{
                        $rootScope.logout();
                    }
                });
            }

            $rootScope.getmyunreads = function() {
                webServices.get('myunreads').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.countData = getData.data;
                        if(($rootScope.countData.chatmessages > $rootScope.user.chatmessages) || ($rootScope.countData.notifications > $rootScope.user.notifications)){
                            $scope.showwebnotification();
                        }
                    }else{
                        $rootScope.logout();
                    }
                });
            }

            $rootScope.getSettings = function() {
                webServices.get('getsettings').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.settings = getData.data;
                    }
                });
            }

            $rootScope.addTocart = function(product) {
                webServices.post('cart/' + product).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.$emit("showsuccessmsg", getData.data.message);
                    } else {
                        $scope.errors = [];
                        $scope.errors.push(getData.data.message);
                        $rootScope.$emit("showerrors", $scope.errors);
                    }
                });
            }

            $rootScope.getCategories = function() {
                webServices.get('shopcategories').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.categories = getData.data;
                        $rootScope.loading = false;
                    } else {
                        $rootScope.$emit("showerror", getData);
                    }
                });
            }

            $rootScope.opencollaboratemodal = function() {
                if (!$rootScope.ismodalopen) {
                    $rootScope.openModalPopup('collaboratemodal', 'CollaborateModalCtrl');
                }
            }

            $rootScope.forgotpassword = function(form) {
                $scope.forgoterrors = {};
                if (form.$valid) {
                    $rootScope.loading = true;
                    $rootScope.forgotloading = true;
                    webServices.normalpost('forgotpassword', $rootScope.forgotModel).then(function(getData) {
                        $rootScope.loading = false;
                        $rootScope.forgotloading = false;
                        if (getData.status == 200) {
                            $scope.forgoterrors.successmsg = getData.data.message;
                        } else {
                            $scope.forgoterrors.errormsg = getData.data.message;
                        }
                    });
                }
            }

            $rootScope.gotoChat = function(productid) {
                webServices.get('product/' + productid).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.ItemData = getData.data;
                        if (!$rootScope.ItemData.chatData) {
                            webServices.put('productchat/' + productid).then(function(getData) {
                                if (getData.status == 200) {
                                    $rootScope.closepopoverItem();
                                    $state.go('app.productchat', {
                                        'id': getData.data.id
                                    });
                                }
                            });
                        } else {
                            $rootScope.closepopoverItem();
                            $state.go('app.productchat', {
                                'id': $rootScope.ItemData.chatData.id
                            });
                        }
                    }
                });
            }

            $rootScope.showAModal = function($modalInstance) {
                if (!$rootScope.termsofuse) {
                    $scope.gettermsofservice();
                }

                var dialogInst = $modal.open({
                    templateUrl: 'tpl/blocks/mobile/termspopup.html',
                    controller: 'DialogInstCtrl',
                    size: 'sm',
                });
            }

            $scope.closeheaderinfo = function() {
                localStorage.showheader = true;
                $rootScope.showheader = false;
            }

            $scope.googleLogin = function() {
                $rootScope.googleloading = true;
                $rootScope.loading = true;
                GoogleSignin.signIn().then(function(user) {
                    var response = user.w3;
                    $rootScope.loginModel.email = response.U3;
                    $rootScope.loginModel.password = response.Eea;
                    $rootScope.loginModel.username = response.ig;
                    $rootScope.loginModel.register_type = 3;
                    $rootScope.loginModel.image = response.Paa;
                    $scope.sociallogin();
                }, function(err) {
                    $rootScope.loading = false;
                    $rootScope.googleloading = false;
                    console.log(err);
                });
            }

            $rootScope.gotosearch = function(keyword) {
                $rootScope.searchData.keyword = keyword;
                $rootScope.showsearch = false;
                if (keyword && keyword.length > 0) {
                    if (($rootScope.stateurl == 'home') || ($rootScope.stateurl == 'searchitems')) {
                        $state.go('app.searchitems', {
                            'keyword': keyword,
                        });
                    } else {
                        $state.go('app.search', {
                            'keyword': keyword,
                        });
                    }
                }
            }

            $rootScope.searchedit = function() {
                $rootScope.showsearch = true;
            }

            $scope.facebooklogin = function() {
                $rootScope.facebookloading = true;
                $rootScope.loading = true;
                Facebook.login(function(response) {
                    if (response.status == 'connected') {
                        $scope.logged = true;
                        $scope.me();
                    } else {
                        $rootScope.facebookloading = false;
                        $rootScope.loading = false;
                    }

                });
            };

            $scope.me = function() {
                Facebook.api('/me?fields=name,email,picture', function(response) {
                    $rootScope.loginModel.email = response.email;
                    $rootScope.loginModel.password = response.id;
                    $rootScope.loginModel.username = response.name;
                    $rootScope.loginModel.register_type = 2;
                    $rootScope.loginModel.image = response.picture.data.url;
                    $scope.sociallogin();
                });
            };

            $scope.sociallogin = function(form) {
                $rootScope.loading = true;
                webServices.normalpost('sociallogin', $rootScope.loginModel).then(function(getData) {
                    $rootScope.loading = false;
                    $rootScope.googleloading = false;
                    $rootScope.facebookloading = false;
                    if (getData.status == 200) {
                        $sessionStorage.user = getData.data;
                        localStorage.user = JSON.stringify($sessionStorage.user);
                        $rootScope.user = $sessionStorage.user;
                        if (!$rootScope.user.firebaseid) {
                            $scope.createFirebaseauth();
                        } else {
                            $rootScope.goafterLogin();
                        }
                    } else {
                        $scope.loginerrors = getData.data.message;
                    }
                });
            };

            $scope.login = function(form) {
                $scope.loginerrors = {};
                $scope.errors = [];
                if (form.$valid) {
                    $rootScope.loading = true;
                    $rootScope.loginloading = true;
                    if ($rootScope.userData.rememberme) {
                        localStorage.userData = JSON.stringify($rootScope.userData);
                    } else {
                        localStorage.userData = '';
                    }

                    webServices.normalpost('login', $rootScope.userData).then(function(getData) {
                        if (getData.status == 200) {
                            $sessionStorage.user = getData.data;
                            localStorage.user = JSON.stringify($sessionStorage.user);
                            $rootScope.user = $sessionStorage.user;
                            if (!$rootScope.user.firebaseid) {
                                $scope.createFirebaseauth();
                            } else {
                                $scope.loginFirebaseauth();
                            }

                        } else {
                            $rootScope.loading = false;
                            $rootScope.loginloading = false;
                            $scope.loginerrors = getData.data.message;
                        }
                    });
                }
            };

            $rootScope.goafterLogin = function() {
                $rootScope.getUserInfo();
                $rootScope.issignin = false;
                $rootScope.issignup = false;
                $rootScope.loading = false;
                $rootScope.loginloading = false;
                $rootScope.searchData = {};
                if ($rootScope.isredirect) {
                    window.open($rootScope.redirecturl,"_self")
                    // $state.go('app.viewitem', ({
                    //     'id': $rootScope.redirectproduct
                    // }));
                } else {
                    $state.go('app.usermain');
                }
            }

            $scope.createFirebaseauth = function() {
                firebase.auth().createUserWithEmailAndPassword($rootScope.user.email, 'password').then(function() {
                    $scope.loginFirebaseauth();
                }).catch(function(error) {
                    console.log(error);
                });
            }

            $rootScope.sharetwitter = function() {
                var newwindow = window.open('https://twitter.com/share?url=https://twitter.com/share?url=' + $rootScope.shareData.shareurl + $rootScope.shareData.id, 'Twitter Share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                if (window.focus) {
                    newwindow.focus()
                }
                $timeout(function() {
                    $rootScope.updateforsocialshare(2);
                    $rootScope.closepopoverItem();
                }, 10000);
            }

            $rootScope.sharegoogle = function() {
                var newwindow = window.open('https://plus.google.com/share?url=' + $rootScope.shareData.shareurl + $rootScope.shareData.id, 'Google Share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                if (window.focus) {
                    newwindow.focus()
                }
                $timeout(function() {
                    $rootScope.updateforsocialshare(3);
                    $rootScope.closepopoverItem();
                }, 10000);
            }

            $rootScope.sharewhatsapp = function() {
                /*if(isMobile.phone){*/
                var newwindow = window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent($rootScope.shareData.shareurl + $rootScope.shareData.id), 'Whatsapp Share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                if (window.focus) {
                    newwindow.focus()
                }
                $timeout(function() {
                    $rootScope.updateforsocialshare(4);
                    $rootScope.closepopoverItem();
                }, 5000);
                /*}*/

            }


            $scope.loginFirebaseauth = function() {
                firebase.auth().signInWithEmailAndPassword($rootScope.user.email, 'password').then(function() {
                    $scope.getFirebaseUser();
                }).catch(function(error) {
                    console.log(error);
                });
            }


            $scope.getFirebaseUser = function() {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (!$rootScope.user.firebaseid) {
                        $scope.updatefirebaseid(user.uid)
                    } else {
                        $rootScope.goafterLogin();
                    }
                });
            }

            $scope.updatefirebaseid = function(firebaseid) {
                var obj = {
                    firebaseid: firebaseid
                };
                webServices.put('updatefirebaseid', obj).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.goafterLogin();
                    } else {
                        $rootScope.loading = false;
                        $rootScope.registerloading = false;
                        $scope.registererrors = getData.data.message;
                    }
                });
            }

            $scope.gettermsofservice = function() {
                webServices.get('termsofuse').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.termsofuse = getData.data;
                    }
                });
            };

            $rootScope.$on("showsuccessmsg", function(event, msg) {
                ngNotify.set(msg, {
                    type: 'success',
                    theme: 'pastel',
                    position: 'bottom',
                    duration: 3000,
                    sticky: false,
                    button: true,
                    html: false
                });
            });

            $rootScope.$on("showerrormsg", function(event, msg) {
                ngNotify.set(msg, {
                    type: 'error',
                    theme: 'pastel',
                    position: 'bottom',
                    duration: 3000,
                    sticky: false,
                    button: true,
                    html: false
                });
            });

            $rootScope.$on("callStickyMenu", function() {
                if (!isMobile.phone) {
                    $('.leftSidebar, .content, .rightSidebar').theiaStickySidebar({
                        additionalMarginTop: 50
                    });
                }
            });

            $rootScope.timeInterval = 6000;

            $rootScope.getnotiCount = function() {
                if ($rootScope.user.username) {
                    $rootScope.getmyunreads();
                }
                $timeout($rootScope.getnotiCount, $rootScope.timeInterval);
            }
            
            $timeout($rootScope.getnotiCount, $scope.timeInterval);

            $scope.showwebnotification = function() {
                var title = '';
                var message = '';
                if($rootScope.countData.chatmessages > $rootScope.user.chatmessages){
                    title += $rootScope.countData.chatmessages +' new chats';
                }if($rootScope.countData.notifications > $rootScope.user.notifications){
                    if($rootScope.countData.chatmessages > $rootScope.user.chatmessages){
                        title += ' & '
                    }
                    title += $rootScope.countData.notifications +' new notifications';       
                }
                $rootScope.getUserInfo();
                        
                webNotification.showNotification(title, {
                    body: 'You have a new message',
                    icon: 'img/favicon.ico',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000 
                }, function onShow(error, hide) {
        if (error) {
            webNotification.requestPermission(function onRequest(granted) {
                if (granted) {
                    console.log('Permission Granted.');
                } else {
                     window.alert('Unable to show notification due to Permission issue');
                    console.log('Permission Not Granted.');
                }
            });
        } else {
            console.log('Notification Shown.');
 
            setTimeout(function hideNotification() {
                console.log('Hiding notification....');
                hide(); //manually close the notification (you can skip this if you use the autoClose option)
            }, 5000);
        }
    });
            }

            $rootScope.$on("showerrors", function(event, errors) {
                angular.forEach(errors, function(errormsg, no) {
                    ngNotify.set(errormsg, {
                        type: 'error',
                        theme: 'pastel',
                        position: 'bottom',
                        duration: 3000,
                        sticky: false,
                        button: true,
                        html: false
                    });
                });
            });

            $scope.register = function(form) {
                $scope.registererrors = {};
                console.log('register')
                if (form.$valid) {
                    console.log('register form okay')
                    $rootScope.loading = true;
                    $rootScope.registerloading = true;
                    $rootScope.registerModel.userrole = 2;
                    $rootScope.registerModel.register_type = 1;
                    $rootScope.registerModel.created_by = 1;
                    webServices.normalpost('userregister', $rootScope.registerModel).then(function(getData) {
                        console.log(getData)
                        if (getData.status == 200) {
                            $sessionStorage.user = getData.data;
                            localStorage.user = JSON.stringify($sessionStorage.user);
                            $rootScope.user = $sessionStorage.user;
                            $rootScope.registerModel = {};
                            $rootScope.issignin = false;
                            $rootScope.issignup = false;
                            $rootScope.loading = false;
                            $rootScope.registerloading = false;
                            $scope.createFirebaseauth();

                        } else {
                            $rootScope.loading = false;
                            $rootScope.registerloading = false;
                            $scope.registererrors = getData.data.message;
                        }
                    });

                }
            };

            $rootScope.logout = function() {
                $rootScope.loading = false;
                firebase.auth().signOut();
                $rootScope.userData = {};
                $rootScope.user = {};
                $scope.closeAside();
                authServices.logout();
            }


            $rootScope.showhidepopup = function(type) {
                if (type == 'signin') {
                    $rootScope.issignin = !$rootScope.issignin;
                    $rootScope.issignup = false;
                    $rootScope.isforgotpw = false;
                } else if (type == 'signup') {
                    $rootScope.issignup = !$rootScope.issignup;
                    $rootScope.issignin = false;
                    $rootScope.isforgotpw = false;
                } else {
                    $rootScope.isforgotpw = !$rootScope.isforgotpw;
                    $rootScope.issignin = false;
                    $rootScope.issignup = false;
                }
            }

            $rootScope.changebg = function(bg) {
                $rootScope.activebg = bg;
            }

            $rootScope.$on('$locationChangeStart', function (event, current, previous) {
                $rootScope.redirecturl = '';
                $rootScope.isredirect = false;
                angular.forEach($rootScope.redirectroutes, function(state) {
                    if(current.includes('home') || current.includes('viewproduct') ||  current.includes('mobilemain')){
                        if(previous.includes(state)){
                            $rootScope.isredirect = true;
                            $rootScope.redirecturl = previous;
                            if($rootScope.currentdevice == 'desktop'){
                                if($rootScope.redirecturl.includes('viewproduct')){
                                    $rootScope.redirecturl.replace('viewproduct','viewitem');
                                }
                            }
                        }
                    }
                });
                
                $rootScope.formLoading = true;
                $rootScope.pageloading = true;
                var paths = $location.path().split('/');

                if (paths[1] != 'mobile') {
                    $rootScope.stateurl = paths[1];
                } else {
                    $rootScope.stateurl = paths[2];
                }
                $rootScope.getSettings();
                $rootScope.closepopoverItem();
                $rootScope.userData = {};
                $rootScope.searchData = {};
                $rootScope.closePopover();

                if (authServices.currentUser()) {
                    $rootScope.getUserInfo();
                }
                if ($rootScope.currentdevice == 'mobile') {
                    $scope.closeAside();
                }
            });

            $rootScope.closePopover = function() {
                $rootScope.issignin = false;
                $rootScope.issignup = false;
                $rootScope.isforgotpw = false;
                $scope.forgoterrors = {};
                $scope.loginerrors = {};
                $scope.registererrors = {};
            };

            $scope.asideState = {
                open: false
            };

            $scope.closeAside = function() {
                if ($scope.asideInstance) {
                    $scope.asideInstance.close();
                }
            }

            $rootScope.openModalPopup = function(modalfile, modalcontroller) {
                $rootScope.ismodalopen = true;
                var dialogInst = $modal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'tpl/blocks/modals/' + modalfile + '.html',
                    controller: modalcontroller,
                    controllerAs: '$ctrl',
                    size: 'lg',
                    windowClass: modalfile,
                });
            }

            $rootScope.closeModal = function() {
                $modalInstance.dismiss('cancel');
            };

            $scope.openAside = function(position, backdrop) {

                function postClose() {
                    $rootScope.isAsideOpen = false;
                    $scope.asideState.open = false;
                }

                if (!$rootScope.isAsideOpen) {
                    $rootScope.isAsideOpen = true;
                    $scope.asideInstance = $aside.open({
                        templateUrl: 'tpl/blocks/mobile/sidemenu.html',
                        placement: position,
                        size: 'sm',
                        backdrop: backdrop,
                    });
                }

                $scope.asideInstance.result.then(postClose, postClose);
            }
        }
    ])
    .controller('DialogInstCtrl', function($scope, $modalInstance, $rootScope) {
        $scope.closeModal = function() {
            $rootScope.isAsideOpen = false;
            $modalInstance.dismiss('cancel');
        };
    });