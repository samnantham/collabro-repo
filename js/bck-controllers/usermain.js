'use strict';
app.controller('UserMainCtrl', ['$scope', '$http', '$state', 'authServices', 'webServices', 'utility', '$rootScope', '$timeout', function($scope, $http, $state, authServices, webServices, utility, $rootScope, $timeout) {
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

    if ($rootScope.user) {
        if (!$rootScope.user.username) {
            $rootScope.logout();
        }
    }

    $scope.getfeeds = function() {
        webServices.get('userfeeds/'+$scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.totalData = getData.data.total;
                $scope.feeds = $scope.feeds.concat(getData.data.data);
                if(!$scope.firstloadingcompleted){
                    $scope.getproducts();
                }else{
                    $rootScope.formLoading = false;
                }
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.openfeed = function(key,status){
        if(status)
        {
            var accordion = $('.accordion'), timeOut;
            var element = document.getElementById("accorditem"+key);
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                accordion.animate({
                scrollTop: 3 * (element.offsetTop/5)
                }, 450);
            }, 350);
        }
    }

    $scope.loadMoreRecords = function(){
        if($scope.feeds.length < $scope.totalData){
            $scope.pageno ++;
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

    $scope.gotofeedchat = function(feedid) {
        webServices.put('feedchat/' + feedid + '/' + $rootScope.user.id).then(function(getData) {
            if (getData.status == 200) {
                $state.go('app.userchats', {
                    'isfeed': 1,
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
    $scope.scrollTo = function(height) {
        $('html').animate({scrollTop: height}, 'slow');
    }

    $scope.getproducts = function() {
        webServices.get('gettypeproducts').then(function(getData) {
            if (getData.status == 200) {
                if (!$scope.firstloadingcompleted) {
                    $scope.firstloadingcompleted = true;
                    $rootScope.$emit("scrolltop", {});
                    $rootScope.$emit("callStickyMenu", {});
                    $scope.products = getData.data;
                }
                $timeout(function() {
                    $rootScope.formLoading = false;
                }, 2000);
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
                $scope.products[type][key].wishstatus = obj.wishstatus;
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
        if($scope.activetab == 'All'){
            webServices.get('sortuserproducts/' + type + '/' + key + '/' + order).then(function(getData) {
                if (getData.status == 200) {
                    $scope.products[type] = getData.data;
                    $rootScope.formLoading = false;
                    //$scope.scrollTo(350);
                }
            });
        }else{
            $scope.pagedata = [];
            $scope.typeproductdata = [];
            $scope.typespageno = 1;
            $scope.url = 'sortusertypeproducts/' + type + '/' + key + '/' + order +'?page='+$scope.typespageno;
            $scope.getAPIdata();
        }
    }

    $scope.filteruserproducts = function() {
        $scope.pagedata = [];
        $scope.url = 'filterproductbytype/' + $scope.activetab+'?page='+$scope.typespageno;
        $scope.getAPIdata();
    }

    $scope.getAPIdata = function(){
        webServices.get($scope.url).then(function(getData) {
            if (getData.status == 200) {
                $scope.typeproductdata = getData.data;
                $scope.pagedata[$scope.typespageno] = getData.data;
                $scope.pagination = {
                    current: $scope.typespageno
                };
                $rootScope.formLoading = false;
                //$scope.scrollTo(350);
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.pageChanged = function(newPage) {
        $scope.typespageno = newPage;
        if (!$scope.pagedata[$scope.typespageno]) {
            if($scope.activetab != 'All'){
                if($scope.issort){
                    $scope.sortproduct();
                }else{
                    $scope.filteruserproducts();
                }
            }
        } else {
            $scope.typeproductdata = $scope.pagedata[$scope.typespageno];
            //$scope.scrollTo(350);
        }
    };

    $scope.getfeeds();

}]);