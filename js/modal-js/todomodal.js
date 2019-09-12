app.controller('TodoModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
	$rootScope.todoData = {};
    $rootScope.todoData.images = [];
    $rootScope.imageerrormsg = "Please Upload todo images";

	$rootScope.resetTodoItems = function() {
        $rootScope.todoData.title = "";
        $rootScope.todoData.deadline = "";
        $rootScope.todoData.description = "";
        $rootScope.todoData.images = [];
        $rootScope.todoData.thumbimage = 0;
        $rootScope.todoData.selectedproject = {};
        $rootScope.todoData.project = '';
    }

    $rootScope.hidetodoerrors = function() {
        $rootScope.todotitleerror = false;
        $rootScope.tododescriptionerror = false;
        $rootScope.tododeadlineerror = false;
        $rootScope.projecterror = false;
    }

    $rootScope.applyproject = function(project){
        $rootScope.todoData.selectedproject = project;
        $rootScope.todoData.project = project.id;
        $rootScope.hidetodoerrors();
    }

    $rootScope.uploadvideo = function() {
        if (($rootScope.validURL($rootScope.todoData.embedvideo))&&($rootScope.validvideo($rootScope.todoData.embedvideo))) {
            $rootScope.viewingThumb = {};
            $rootScope.videoerror = false;
            var newobj = {};
            newobj.filetype = 2;
            newobj.file = $rootScope.todoData.embedvideo;
            var thumbnail = $rootScope.todoData.embedvideo;
            if ($rootScope.todoData.embedvideo.includes('youtu')) {
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
            } else if ($rootScope.todoData.embedvideo.includes('vimeo')) {
                newobj.thumbnail = 'img/vimeo.png';
            } else if ($rootScope.todoData.embedvideo.includes('soundcloud')) {
                newobj.thumbnail = 'img/soundcloud.png';
            }
            if ($rootScope.editkey) {
                $rootScope.todoData.images[$rootScope.editkey] = newobj;
                $rootScope.viewingThumb = newobj;
                $rootScope.todoData.thumbimage = $rootScope.selectedKey;
                $rootScope.selectedKey = null;
                $rootScope.editkey = null;
            } else {
                if ($rootScope.todoData.images.length < 6) {
                    $rootScope.todoData.images.push(newobj);
                    $rootScope.viewingThumb = $rootScope.todoData.images[$rootScope.todoData.images.length - 1];
                    $rootScope.todoData.thumbimage = $rootScope.todoData.images.length - 1;
                    $rootScope.selectedKey = null;
                    $rootScope.editkey = null;
                } else if ($rootScope.todoData.images.length >= 6) {
                    $rootScope.$emit("showerrormsg", 'Already 6 items uploaded.');
                }
            }
            $rootScope.todoData.embedvideo = '';
        }
        else{
            $rootScope.$emit("showerrormsg", 'Please upload valid video url.');
            $rootScope.formData.embedvideo = '';
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
        $rootScope.todoData.embedvideo = $rootScope.todoData.images[$rootScope.selectedKey].file;
        $rootScope.ismodalPopover = false;
    }


    $rootScope.chooseItem = function(key) {
        $rootScope.ismodalPopover = true;
        $rootScope.selectedKey = key;
        $rootScope.todoData.thumbimage = $rootScope.selectedKey;
        if ($rootScope.todoData.images[$rootScope.selectedKey].filetype == 1) {
            $rootScope.todoData.embedvideo = "";
        }
        $rootScope.viewingThumb = $rootScope.todoData.images[$rootScope.selectedKey];
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
            $rootScope.viewingThumb = {};
            $rootScope.editkey = null;
        }
    }

    $rootScope.removefileItem = function() {
        $rootScope.todoData.images.splice($rootScope.selectedKey, 1);
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


     $rootScope.addImages = function(files) {
        $rootScope.selectedKey = null;
        $rootScope.imageerrormsg = "";
        $rootScope.viewingThumb = {};
        $rootScope.errors = [];
        var remainingimages = 6 - $rootScope.todoData.images.length;
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
                    $rootScope.todoData.images[$rootScope.editkey] = obj;
                    $rootScope.viewingThumb = obj;
                    $rootScope.todoData.thumbimage = angular.copy($rootScope.editkey);
                } else {
                    $rootScope.todoData.images.push(obj);
                    $rootScope.viewingThumb = $rootScope.todoData.images[$rootScope.todoData.images.length - 1];
                    $rootScope.todoData.thumbimage = $rootScope.todoData.images.length - 1;
                }
                $rootScope.selectedKey = null;
                $rootScope.editkey = null;
            }, 500);
        };
    }

	$scope.addtodo = function(form) {
        $rootScope.hidetodoerrors();
        if (form.$valid) {
            $rootScope.formLoading = true;
            $rootScope.todoData.deadline = $filter('date')(new Date($rootScope.todoData.tododeadline), 'yyyy-MM-dd');
            webServices.upload('todo', $rootScope.todoData).then(function(getData) {
                $rootScope.formLoading = false;
                console.log(getData)
                if (getData.status == 200) {
                    $rootScope.closetodoModal();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $rootScope.todoData = {};
                    $rootScope.viewingThumb = {};
                    if($rootScope.isedittodo){
                        $state.go('app.viewtodo',{'id':$rootScope.edittodoid});
                    }else{
                        $state.reload();
                    }
                    // if($rootScope.currentdevice == 'mobile'){
                    //     $state.go('app.todos');
                    // }
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    $rootScope.$emit("showerrors", $scope.errors);
                } else {
                    $rootScope.$emit("showerror", getData);
                }
            });
        } else {
            if (!form.title.$valid) {
                $rootScope.todotitleerror = true;
            }
            if (!form.description.$valid) {
                $rootScope.tododescriptionerror = true;
            }
            if (!form.deadline.$valid) {
                $rootScope.tododeadlineerror = true;
            }
            if($rootScope.todoData.type == 'Personal')
            {
                if (!form.todofiles.$valid) {
                    $rootScope.imageerror = true;
                }
            }
            if($rootScope.todoData.type == 'Project')
            {
                if (!form.project.$valid) {
                    $rootScope.projecterror = true;
                }
            }
            
        }
    }

    if ($rootScope.isedittodo) {
        webServices.get('todo/' + $rootScope.edittodoid).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.todoData = getData.data;
                $rootScope.todoData.tododeadline = $filter('date')(new Date($rootScope.todoData.deadline), 'MM/dd/yyyy');
                
                if($rootScope.todoData.type == 'Personal'){
                    $rootScope.todoData.thumbimage = 0;
                    $rootScope.viewingThumb = $rootScope.todoData.images[0];
                }else{
                    $rootScope.applyproject($rootScope.todoData.projectinfo);
                }
                console.log($rootScope.todoData)
            } else {
                $rootScope.logout();
            }
        });
    }
}]);