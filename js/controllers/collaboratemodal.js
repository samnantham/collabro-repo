app.controller('CollaborateModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
    $rootScope.activediv = 'info';
    $rootScope.formData.type = '';
    var friends =  angular.copy($rootScope.user.myfriends);

    $rootScope.resetProductItems = function() {
        $rootScope.loading = false;
        $rootScope.formData.isaccept = false;
        $rootScope.viewingThumb = {};
        $rootScope.formData.title = "";
        $rootScope.formData.memberlength = '';
        $rootScope.formData.productfile = '';
        $rootScope.activediv = 'info';
        $rootScope.formData.embedvideo = '';
        $rootScope.formData.images = [];
        $rootScope.formData.thumbimage = 0;
        $rootScope.formData.location = $scope.locations[0];
        
        if (!$rootScope.fromfriendspage) {
            $rootScope.formData.projectmembers = [];
        }else{
            if($rootScope.formData.projectmembers.length > 0){
                angular.forEach(friends, function(friend,no) {
                    if (friend.username == $rootScope.formData.projectmembers[0].username) {
                        friends.splice(no, 1);
                    }
                });
            }
        }
        $rootScope.hideerrors();
    }

    $rootScope.complete = function(string) {
        $rootScope.friends = [];
        if (string.length > 1) {
            angular.forEach(friends, function(friend) {
                if (friend.username.toLowerCase().includes(string.toLowerCase())) {
                    $rootScope.friends.push(friend);
                }
            });
        } else {
            $rootScope.friends = friends;
        }
    }

    $rootScope.addprojectfriend = function(key, friend) {
        if($rootScope.formData.projectmembers.length < 8){
            var status = false;
            angular.forEach($rootScope.formData.projectmembers, function(userfriend) {
                if (userfriend.username == friend.username) {
                    status = true;
                }
            });
            if(!status){
                $rootScope.formData.friend = '';
                $rootScope.formData.projectmembers.push(friend);
                friends.splice(key, 1);
            }else{
                $rootScope.$emit("showerrormsg", 'Member Already Added');
            }
            
        }else{
            $rootScope.$emit("showerrormsg", 'Maximum 8 members only');
        }
        
    }

    $rootScope.removeprojectfriend = function(key, friend) {
        $rootScope.formData.projectmembers.splice(key, 1);
        friends.push(friend);
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

    $rootScope.changeVideo = function(key) {
        $rootScope.editkey = key;
        $rootScope.formData.embedvideo = $rootScope.formData.images[$rootScope.selectedKey].file;
        $rootScope.ismodalPopover = false;
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

    $scope.createProject = function(form) {
        $rootScope.hideerrors();
        if (form.$valid) {
            $rootScope.formLoading = true;
            $rootScope.formData.thumbkey = $rootScope.formData.thumbimage;
            $rootScope.formData.deadline = $filter('date')(new Date($rootScope.formData.projectdeadline), 'yyyy-MM-dd');

            webServices.upload('project', $rootScope.formData).then(function(getData) {
                $rootScope.fromfriendspage = false;
                $rootScope.formLoading = false;
                if (getData.status == 200) {
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $rootScope.formData = {};
                    $rootScope.viewingThumb = {};
                    $rootScope.closecollaboratemodal();
                    $state.go('app.projectlist');
                    $rootScope.getUserInfo();
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    $scope.showerrors();
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
            if (!form.deadline.$valid) {
                $rootScope.deadlineerror = true;
                $rootScope.noinfoerror = false;
            }

            if (!form.members.$valid) {
                $rootScope.membererror = true;
                if ($rootScope.noinfoerror) {
                    $rootScope.activediv = 'members';
                }
            }

            if (!$rootScope.noinfoerror) {
                $rootScope.activediv = 'info';
            }

        }
    }

    $rootScope.hideerrors = function() {
        $rootScope.imageerrormsg = "";
        $rootScope.noinfoerror = true;
        $rootScope.nomemberserror = true;
        $rootScope.titleerror = false;
        $rootScope.descriptionerror = false;
        $rootScope.imageerror = false;
        $rootScope.deadlineerror = false;
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

}]);