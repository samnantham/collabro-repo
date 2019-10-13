'use strict';
app.controller('UserMainCtrl', ['$scope', '$http', '$state', 'authServices', 'webServices', 'utility', '$rootScope', '$timeout', function($scope, $http, $state, authServices, webServices, utility, $rootScope, $timeout) {
    $rootScope.formLoading = true;
    $scope.issort = false;
    $scope.firstloadingcompleted = false;
    $scope.products = [];
    $scope.typeproductdata = [];
    $scope.feeds = [];
    $scope.pagedata = [];
    $scope.activetab = 'All';
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 8;
    $scope.typespageno = 1;
    $scope.typestotalPerPage = 12;
    $scope.pagination = {
        current: 1
    };

    $scope.getfeeds = function() {
        webServices.get('userfeeds/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.lastpage = getData.data.last_page;
                $scope.feeds = $scope.feeds.concat(getData.data.data);
                if (!$scope.firstloadingcompleted) {
                    $scope.getproducts();
                } else {
                    $rootScope.formLoading = false;
                }
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.openfeed = function(key, status) {
        if (status) {
            var accordion = $('.accordion'),
                timeOut;
            var element = document.getElementById("accorditem" + key);
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                accordion.animate({
                    scrollTop: 3 * (element.offsetTop / 5)
                }, 450);
            }, 350);
        }
    }

    $scope.loadMoreRecords = function() {
        if ($scope.lastpage <= $scope.pageno) {
            $scope.pageno++;
            $scope.getfeeds();
        }
    }

    $scope.updatefeedwish = function(feed, key) {
        var wishstatus = 1;
        if (feed.wishstatus == 1) {
            wishstatus = 0;
        }
        webServices.put('feedstatus/' + feed.id + '/' + wishstatus).then(function(getData) {
            if (getData.status == 200) {
                $scope.feeds[key].wishstatus = wishstatus;
                $rootScope.$emit("showsuccessmsg", getData.data.message);
            }
        });
    }

    $scope.currentIndex = 0;
    $scope.autoplay = true;

    $scope.gotofeedchat = function(feedid) {
        webServices.put('feedchat/' + feedid + '/' + $rootScope.user.id).then(function(getData) {
            if (getData.status == 200) {
                $state.go('app.feedchat', {
                    'chatid': getData.data.id
                });
            }
        });
    }

    $scope.changefollowstatus = function(user, isfollow) {
        if (isfollow) {
            var status = 0;
        } else {
            var status = 1;
        }

        webServices.put('followuser/' + user.id + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                angular.forEach($scope.feeds, function(feed) {
                    if (feed.owner.id == user.id) {
                        feed.isfollow = status;
                    }
                });
            }
        });
    }
    
    /* $(window).scroll(function () { 
        console.log($(window).scrollTop());
    });
*/

    $scope.setcoverslickconfig = function(){
        $scope.coverslickConfig = {
                autoplay: $scope.autoplay,
                autoplaySpeed: 2000,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                method: {},
                event: {
                    afterChange: function(event, slick, currentSlide, nextSlide) {
                        $scope.currentIndex = currentSlide;
                        if(currentSlide > 0){
                            var previous = currentSlide - 1;
                        }else{
                            var previous = $scope.sliders.length - 1;
                        } 
                        $scope.sliders[$scope.currentIndex].isloaded = true;
                        if($scope.sliders[$scope.currentIndex].filetype == 2){
                            if($scope.sliders[$scope.currentIndex].file.includes('soundcloud')){   
                                $("#soundcloud"+$scope.currentIndex+" iframe").attr('id','sciframe'+$scope.currentIndex);
                            }
                        }
                        var slideData = $scope.sliders[$scope.currentIndex];
                        if(slideData.filetype == 2){
                            $scope.coverslickConfig.method.slickPause();
                        }else{
                            $scope.coverslickConfig.method.slickPlay();
                        }
                        if($scope.sliders[previous].isloaded)
                        {   if($scope.sliders[previous].filetype == 2){
                                if($scope.sliders[previous].file.includes('vimeo')){   
                                    $('#vimeo'+previous+' iframe')[0].contentWindow.postMessage('{"method":"unload"}','*');
                                }else if($scope.sliders[previous].file.includes('youtu')){   
                                    $('#youtube'+previous+' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
                                }else{
                                    var widget = SC.Widget('sciframe'+previous);
                                    widget.pause()
                                }
                            }
                        }
                    },
                    init: function(event, slick) {
                        slick.slickGoTo($scope.currentIndex); // slide to correct index when init
                    }
                }
            };
            $rootScope.formLoading = false;
    }

    $scope.getproducts = function() {
        $scope.firstloadingcompleted = true;
        webServices.get('gettypeproducts').then(function(getData) {
            if (getData.status == 200) {
                $scope.products = getData.data;
                var sliderinfo = $rootScope.user.cover.coverfiles;
                $scope.sliders = sliderinfo;
                angular.forEach(sliderinfo, function(slider, no) {
                    slider.isloaded = false;
                    if(slider.filetype == 2){
                        if(slider.file.includes('youtu')){
                            var videodata = slider.file.split('/');
                            slider.file = 'https://www.youtube.com/embed/'+videodata[videodata.length - 1]+'?autoplay=1&enablejsapi=1';
                        }else if(slider.file.includes('vimeo')){
                            var videodata = slider.file.split('/');
                             slider.file = 'https://player.vimeo.com/video/'+videodata[videodata.length - 1]+'?api=1&player_id=player'+no;
                            //player.vimeo.com/video/
                        }
                    }
                });
                $scope.setcoverslickconfig();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.updatewishstatus = function(product, type, key) {
        var obj = {};
        obj.productid = product.id;
        if (product.wishstatus == 1) {
            obj.wishstatus = 0;
        } else {
            obj.wishstatus = 1;
        }

        webServices.put('updatewish', obj).then(function(getData) {
            if (getData.status == 200) {
                if($scope.activetab == 'All'){
                    $scope.products[type][key].wishstatus = obj.wishstatus;
                }else{
                    $scope.typeproductdata.data[key].wishstatus = obj.wishstatus;
                }
                $rootScope.$emit("showsuccessmsg", getData.data.message);
            }
        });
    }

    $scope.setactivetab = function(tab) {
        $scope.issort = false;
        $scope.pagedata = [];
        $scope.typeproductdata = [];
        $scope.typespageno = 1;
        $rootScope.formLoading = true;
        if (tab != $scope.activetab) {
            $scope.activetab = tab;
            $scope.filteruserproducts();
        } else {
            $scope.activetab = 'All';
            $scope.getproducts();
        }
    }

    $scope.sortproduct = function(type, key, order) {
        $scope.issort = true;
        $rootScope.formLoading = true;
        if ($scope.activetab == 'All') {
            webServices.get('sortuserproducts/' + type + '/' + key + '/' + order).then(function(getData) {
                if (getData.status == 200) {
                    $scope.products[type] = getData.data;
                    $rootScope.formLoading = false;
                }
            });
        } else {
            $scope.pagedata = [];
            $scope.typeproductdata = [];
            $scope.typespageno = 1;
            $scope.url = 'sortusertypeproducts/' + type + '/' + key + '/' + order + '?page=' + $scope.typespageno;
            $scope.getAPIdata();
        }
    }

    $scope.filteruserproducts = function() {
        $scope.pagedata = [];
        $scope.url = 'filterproductbytype/' + $scope.activetab + '?page=' + $scope.typespageno;
        $scope.getAPIdata();
    }

    $scope.getAPIdata = function() {
        webServices.get($scope.url).then(function(getData) {
            if (getData.status == 200) {
                $scope.typeproductdata = getData.data;
                $scope.pagedata[$scope.typespageno] = getData.data;
                $scope.pagination = {
                    current: $scope.typespageno
                };
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.pageChanged = function(newPage) {
        $rootScope.formLoading = true;
        $scope.typespageno = newPage;
        if (!$scope.pagedata[$scope.typespageno]) {
            if ($scope.activetab != 'All') {
                if ($scope.issort) {
                    $scope.sortproduct();
                } else {
                    $scope.filteruserproducts();
                }
            }
        } else {
            $scope.typeproductdata = $scope.pagedata[$scope.typespageno];
            $rootScope.formLoading = false;
        }
    };

    $scope.getfeeds();

}]);