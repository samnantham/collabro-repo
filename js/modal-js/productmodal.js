'use strict';
app.controller('ProductModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
    $rootScope.activediv = 'info';
    $rootScope.viewingThumb = {};
    $rootScope.formData.type = '';
    $rootScope.formData.images = [];
    $scope.isOpen = false;

    $rootScope.resetProductItems = function() {
        if ($rootScope.categories.length == 0) {
            $rootScope.getCategories();
        }
        $rootScope.viewingThumb = {};
        $rootScope.formData.title = "";
        $rootScope.formData.description = "";
        $rootScope.formData.featuretext = '';
        $rootScope.formData.featurelength = '';
        $rootScope.formData.productfile = '';
        $rootScope.activediv = 'info';
        $rootScope.formData.embedvideo = '';
        $rootScope.formData.location = $scope.locations[0];
        $rootScope.formData.currency = $scope.currencies[0];
        $rootScope.formData.periodtype = $scope.periodtypes[0];
        $rootScope.formData.hasbargain = 0;
        $rootScope.formData.images = [];
        $rootScope.formData.features = [];
        $rootScope.brands = [];
        $rootScope.formData.thumbimage = 0;
        $rootScope.formData.hasstartdate = 0;
        $rootScope.formData.hasenddate = 0;
        $rootScope.formData.productstartdate = '';
        $rootScope.formData.productenddate = ''
        $rootScope.formData.starttime = '08:00';
        $rootScope.formData.isprivate = 0;
        $rootScope.formData.showmap = 0;
        $rootScope.formData.endtime = '20:00';
        if ($rootScope.user && $rootScope.user.userinfo) {
            if ($rootScope.user.userinfo.secondaryaddress != 'null') {
                $rootScope.formData.address = $rootScope.user.userinfo.secondaryaddress;
            } else {
                $rootScope.formData.address = '';
            }
            if ($rootScope.user.userinfo.secondaryemail != 'null') {
                $rootScope.formData.email = $rootScope.user.userinfo.secondaryemail;
            } else {
                $rootScope.formData.email = $rootScope.user.email;
            }
            if ($rootScope.user.userinfo.secondaryphonenumber != 'null') {
                $rootScope.formData.phoneno = $rootScope.user.userinfo.secondaryphonenumber;
            } else {
                $rootScope.formData.phoneno = $rootScope.user.phonenumber;
            }
            if ($rootScope.user.userinfo.postalcode > 0) {
                $rootScope.formData.postalcode = $rootScope.user.userinfo.postalcode;
            } else {
                $rootScope.formData.postalcode = '';
            }

            $rootScope.formLoading = false;
        }
        $rootScope.hideerrors();
    }

    $rootScope.seteventFeatures = function() {
        if ($rootScope.formData.type == 'Service') {
            $rootScope.formData.features = angular.copy(app.Servicefeatures);
        }
        if ($rootScope.formData.type == 'Shop') {
            $rootScope.formData.features = angular.copy(app.Shopfeatures);
        }
        if ($rootScope.formData.type == 'Rental') {
            $rootScope.formData.features = angular.copy(app.Rentalfeatures);
        }
        if ($rootScope.formData.type == 'Event') {
            $rootScope.formData.features = angular.copy(app.Eventfeatures);
        }
    }

    $rootScope.clearDate = function(type) {
        if (type == 'start') {
            $rootScope.formData.productstartdate = '';
        } else {
            $rootScope.formData.productenddate = '';
        }
    }

    $rootScope.validURL = function(url) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        return !!pattern.test(url);
    }

    $rootScope.validvideo = function(url){
        var status = false;
        if (url.includes('youtu')) {
            status = true;   
        } else if (url.includes('vimeo')) {
            status = true;
        } else if (url.includes('soundcloud')) {
            status = true;
        }
        return status;
    }

    $rootScope.changeVideo = function(key) {
        $rootScope.editkey = key;
        $rootScope.formData.embedvideo = $rootScope.formData.images[$rootScope.selectedKey].file;
        $rootScope.ismodalPopover = false;
    }

    $rootScope.uploadvideo = function() {
        if (($rootScope.validURL($rootScope.formData.embedvideo))&&($rootScope.validvideo($rootScope.formData.embedvideo))) {
            $rootScope.viewingThumb = {};
            $rootScope.videoerror = false;
            var newobj = {};
            newobj.filetype = 2;
            newobj.file = $rootScope.formData.embedvideo;
            var thumbnail = $rootScope.formData.embedvideo;
            if ($rootScope.formData.embedvideo.includes('youtu')) {
                if (thumbnail.includes('youtu.')) {
                    var splitted = thumbnail.split("youtu.be");
                    var videothumb = splitted[1].replace('/', '');
                } else {
                    if (thumbnail.includes('watch')) {
                        var splitted = thumbnail.split("v=");
                        var videothumb = splitted[1];
                    } else if (thumbnail.includes('embed')) {
                        var splitted = thumbnail.split("embed");
                        var videothumb = splitted[1].replace('/', '');
                    }
                }

                newobj.thumbnail = 'http://img.youtube.com/vi/' + videothumb + '/0.jpg';
            } else if ($rootScope.formData.embedvideo.includes('vimeo')) {
                newobj.thumbnail = 'img/vimeo.png';
            } else if ($rootScope.formData.embedvideo.includes('soundcloud')) {
                newobj.thumbnail = 'img/soundcloud.png';
            }
            if ($rootScope.editkey) {
                $rootScope.formData.images[$rootScope.editkey] = newobj;
                $rootScope.viewingThumb = newobj;
                $rootScope.formData.thumbimage = $rootScope.selectedKey;
                $rootScope.selectedKey = null;
                $rootScope.editkey = null;
            } else {
                if ($rootScope.formData.images.length < 6) {
                    $rootScope.formData.images.push(newobj);
                    $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.formData.images.length - 1];
                    $rootScope.formData.thumbimage = $rootScope.formData.images.length - 1;
                    $rootScope.selectedKey = null;
                    $rootScope.editkey = null;
                } else if ($rootScope.formData.images.length >= 6) {
                    $rootScope.$emit("showerrormsg", 'Already 6 items uploaded.');
                }
            }
            $rootScope.formData.embedvideo = '';
        }else{
            $rootScope.$emit("showerrormsg", 'Please upload valid video url.');
            $rootScope.formData.embedvideo = '';
        }
    }

    $rootScope.chooseItem = function(key) {
        $rootScope.ismodalPopover = true;
        $rootScope.selectedKey = key;
        $rootScope.formData.thumbimage = $rootScope.selectedKey;
        if ($rootScope.formData.images[$rootScope.selectedKey].filetype == 1) {
            $rootScope.formData.embedvideo = "";
        }
        $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.selectedKey];
    }

    $rootScope.closeItem = function() {
        $rootScope.ismodalPopover = false;
        $rootScope.viewingThumb = {};
        $rootScope.selectedKey = null;
        $rootScope.editkey = null;
    }

    $rootScope.closeModalPopover = function() {
        if ($rootScope.ismodalPopover) {
            $rootScope.ismodalPopover = false;
            $rootScope.selectedKey = null;
            $rootScope.editkey = null;
            $rootScope.viewingThumb = {};
        }
    }

    $rootScope.removefileItem = function() {
        $rootScope.formData.images.splice($rootScope.selectedKey, 1);
        $rootScope.ismodalPopover = false;
        $rootScope.viewingThumb = {};
        $rootScope.selectedKey = null;
        $rootScope.editkey = null;
    }

    $rootScope.viewThumb = function() {
        $rootScope.ismodalPopover = false;
        $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.selectedKey];
    }

    $rootScope.replaceImage = function(files,key) {
        if (files && files.length) {
            $rootScope.editkey = key;
            var extn = files[0].name.split(".").pop();
            if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                if (files[0].size <= $rootScope.maxUploadsize) {
                    var newobj = {};
                    newobj.file = files[0];
                    newobj.filename = files[0].name;
                    newobj.filetype = 1;
                    newobj.isfile = 1;
                    $rootScope.converttobase64(files[0], newobj);
                } else {
                    $rootScope.$emit("showerrormsg", files[i].name + ' size exceeds 2MB.');
                }
            } else {
                $rootScope.$emit("showerrormsg", files[i].name + ' format unsupported.');
            }
            $rootScope.ismodalPopover = false;
        }
    }


    $rootScope.changeactiveDiv = function(div) {
        $rootScope.activediv = div;
    }

    $rootScope.removeFeature = function(key) {
        $rootScope.formData.features.splice(key, 1);
    }

    $rootScope.addFeature = function() {
        if ($rootScope.formData.featuretext.length > 0) {
            var obj = {};
            obj.feature = $rootScope.formData.featuretext;
            $rootScope.formData.features.push(obj);
            $rootScope.formData.featuretext = '';
        }
    }


    $scope.addData = function(form) {
        $rootScope.hideerrors();
        if (form.$valid) {
            $rootScope.formLoading = true;
            $rootScope.formData.thumbkey = $rootScope.formData.thumbimage;
            /*if ($rootScope.formData.type == 'Rental') {
                $rootScope.formData.startdate = $filter('date')(new Date($rootScope.formData.productstartdate), 'yyyy-MM-dd');
                $rootScope.formData.enddate = $filter('date')(new Date($rootScope.formData.productenddate), 'yyyy-MM-dd');
            }*/
            if ($rootScope.formData.type == 'Event') {
                if (!$rootScope.formData.hasstartdate) {
                    $rootScope.formData.startdate = $filter('date')(new Date($rootScope.formData.productstartdate), 'yyyy-MM-dd');
                } else {
                    $rootScope.formData.startdate = '';
                }
                if (!$rootScope.formData.hasenddate) {
                    $rootScope.formData.enddate = $filter('date')(new Date($rootScope.formData.productenddate), 'yyyy-MM-dd');
                } else {
                    $rootScope.formData.enddate = '';
                }
            }
            webServices.upload('product', $rootScope.formData).then(function(getData) {
                var oldData = angular.copy($rootScope.formData);
                $rootScope.fromfriendspage = false;
                $rootScope.formLoading = false;
                if (getData.status == 200) {
                    $rootScope.closeproductModal();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    if (oldData.id) {
                        if ($rootScope.currentdevice == 'desktop') {
                            $state.reload();
                        } else {
                            $state.go('app.viewitem', {
                                'id': oldData.id
                            });
                        }
                        $rootScope.getUserInfo();
                    } else {
                        $state.go('app.viewitem', {
                            'id': getData.data.lastid
                        });
                    }
                    $rootScope.formData = {};
                    $rootScope.viewingThumb = {};
                } else if (getData.status == 401) {
                    $rootScope.$emit("showerror", getData);
                } else {
                    $rootScope.$emit("showerror", getData);
                }
            });
        } else {
            if (!form.productfile.$valid) {
                $rootScope.imageerrormsg = "(Upload Images or add Video)";
                $rootScope.imageerror = true;
            }
            if (!form.title.$valid) {
                $rootScope.titleerror = true;
                $rootScope.noinfoerror = false;
            }
            if (!form.description.$valid) {
                $rootScope.descriptionerror = true;
                $rootScope.noinfoerror = false;
            }
            if (!form.price.$valid) {
                $rootScope.priceerror = true;
                $rootScope.noinfoerror = false;
            }
            if ($scope.formData.type == 'Service') {
                if (!form.profession.$valid) {
                    $rootScope.skillerror = true;
                    $rootScope.noinfoerror = false;
                }
            }
            if ($scope.formData.type == 'Shop') {
                if (!form.category.$valid) {
                    $rootScope.categoryerror = true;
                    $rootScope.noinfoerror = false;
                }
                /*if ($rootScope.brands.length > 0 && !form.brand.$valid) {
                    $rootScope.branderror = true;
                    $rootScope.noinfoerror = false;
                }*/
            }
            /*if ($scope.formData.type == 'Rental') {
                if (!form.startdate.$valid) {
                    $rootScope.startdateerror = true;
                    $rootScope.noinfoerror = false;
                }
                if (!form.enddate.$valid) {
                    $rootScope.enddateerror = true;
                    $rootScope.noinfoerror = false;
                }
            }*/
            if ($scope.formData.type == 'Event') {
                if (!$rootScope.formData.hasstartdate) {
                    if (!form.startdate.$valid) {
                        $rootScope.startdateerror = true;
                        $rootScope.noinfoerror = false;
                    }
                }
                if (!$rootScope.formData.hasenddate) {
                    if (!form.enddate.$valid) {
                        $rootScope.enddateerror = true;
                        $rootScope.noinfoerror = false;
                    }
                }
            }
            if ($rootScope.noinfoerror) {
                if ($scope.formData.type != 'Service') {
                    $rootScope.activediv = 'address';
                }
            } else {
                $rootScope.activediv = 'info';
            }
            if ($rootScope.formData.type != 'Service') {
                if (!form.phoneno.$valid) {
                    $rootScope.phoneerror = true;
                }
                if (!form.address.$valid) {
                    $rootScope.addresserror = true;
                }
                if ($rootScope.user.iscompany) {
                    if (!form.company_uen.$valid) {
                        $rootScope.companyuenerror = true;
                    }
                    if (!form.organisation.$valid) {
                        $rootScope.organisationerror = true;
                    }
                }
                if (!form.emailid.$valid) {
                    $rootScope.emailerror = true;
                }
                if (!form.postalcode.$valid) {
                    $rootScope.postalcodeerror = true;
                }
            }
        }
    }

    $rootScope.hideerrors = function() {
        $rootScope.imageerrormsg = "";
        $rootScope.noinfoerror = true;
        $rootScope.addresserror = true;
        $rootScope.titleerror = false;
        $rootScope.descriptionerror = false;
        $rootScope.addresserror = false;
        $rootScope.emailerror = false;
        $rootScope.postalcodeerror = false;
        $rootScope.organisationerror = false;
        $rootScope.companyuenerror = false;
        $rootScope.phoneerror = false;
        $rootScope.skillerror = false;
        $rootScope.priceerror = false;
        $rootScope.categoryerror = false;
        $rootScope.branderror = false;
        $rootScope.startdateerror = false;
        $rootScope.enddateerror = false;
        $rootScope.imageerror = false;
        $rootScope.featureerror = false;
        $rootScope.membererror = false;
    }

    $rootScope.addImages = function(files) {
        $rootScope.selectedKey = null;
        $rootScope.imageerrormsg = "";
        $rootScope.viewingThumb = {};
        $rootScope.errors = [];
        var remainingimages = 6 - $rootScope.formData.images.length;
        if (files.length <= remainingimages) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var extn = files[i].name.split(".").pop();
                    if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                        if (files[i].size <= $rootScope.maxUploadsize) {
                            var newobj = {};
                            newobj.file = files[i];
                            newobj.filename = files[i].name;
                            newobj.filetype = 1;
                            newobj.isfile = 1;
                            $rootScope.converttobase64(files[i], newobj);
                        } else {
                            $rootScope.$emit("showerrormsg", files[i].name + ' size exceeds 2MB.');
                        }
                    } else {
                        $rootScope.$emit("showerrormsg", files[i].name + ' format unsupported.');
                    }
                }
                if ($rootScope.errors.length > 0) {
                    angular.forEach($rootScope.errors, function(error, no) {
                        if (no == 0) {
                            $rootScope.imageerrormsg += error;
                        } else {
                            $rootScope.imageerrormsg += ' & ' + error;
                        }
                    });
                    $rootScope.imageerror = true;
                }
            }
        } else {
            files = null;
            $rootScope.$emit("showerrormsg", 'Now you can upload maximum of ' + remainingimages + ' images only.');
        }
    }

    $rootScope.converttobase64 = function(file, obj) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function(e) {
            obj.base64 = e.target.result;
            $timeout(function() {
                if ($rootScope.editkey != null) {
                    $rootScope.formData.images[$rootScope.editkey] = obj;
                    $rootScope.viewingThumb = obj;
                    $rootScope.formData.thumbimage = angular.copy($rootScope.editkey);
                } else {
                    $rootScope.formData.images.push(obj);
                    $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.formData.images.length - 1];
                    $rootScope.formData.thumbimage = $rootScope.formData.images.length - 1;
                }
                $rootScope.selectedKey = null;
                $rootScope.editkey = null;
            }, 500);
        };
    }

    $rootScope.getBrands = function() {
        if (!$scope.formData.category) {
            $rootScope.brands = [];
            $rootScope.formData.brand = '';
        } else {
            webServices.get('filterallbrands/' + $scope.formData.category).then(function(getData) {
                if (getData.status == 200) {
                    $rootScope.brands = getData.data;
                    $rootScope.loading = false;
                } else {
                    $rootScope.$emit("showerror", getData);
                }
            });
        }
    }

    if ($rootScope.iseditproduct) {
        webServices.get('product/' + $rootScope.editproductid).then(function(getData) {
            if (getData.status == 200) {
                if ($rootScope.categories.length == 0) {
                    $rootScope.getCategories();
                }
                $rootScope.formData = getData.data;
                if ($rootScope.formData.startdate) {
                    $rootScope.formData.productstartdate = $filter('date')(new Date($rootScope.formData.startdate), 'MM/dd/yy');
                }
                if ($rootScope.formData.enddate) {
                    $rootScope.formData.productenddate = $filter('date')(new Date($rootScope.formData.enddate), 'MM/dd/yy');
                }
                if ($rootScope.formData.type == 'Event') {
                    if ($rootScope.formData.hasstartdate) {
                        $rootScope.formData.productstartdate = '';
                    }
                    if ($rootScope.formData.hasenddate) {
                        $rootScope.formData.productenddate = '';
                    }
                }
                $rootScope.formData.price = parseFloat($rootScope.formData.price);
                $rootScope.formData.thumbimage = 0;
                $rootScope.viewingThumb = $rootScope.formData.images[0];
            } else {
                $rootScope.logout();
            }
        });
    }

}]);