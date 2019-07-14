'use strict';
app.controller('TodoListCtrl', ['$scope', '$ngConfirm', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $ngConfirm, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $scope.todos = [];
    $scope.todospagedata = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 6;
    $scope.url = 'mytodos/' + $scope.totalPerPage;

    $scope.getmytodos = function() {
        webServices.get($scope.url + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.todospagedata[$scope.pageno] = getData.data;
                $scope.todos = getData.data;
                angular.forEach($scope.todos.data, function(todo, no) {
                    if(todo.type == 'Project'){
                        todo.images = todo.projectinfo.files;
                    }
                });
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    };

    $rootScope.editTodo = function(data) {
        $rootScope.isedittodo = true;
        $rootScope.edittodoid = data.id;
        $rootScope.opentodoModal();
    }

    $rootScope.filterTodo = function(filter){
        $rootScope.formLoading = true;
        if(filter){
            $scope.url = 'mytodos/' + $scope.totalPerPage + '/' +filter;
        }else{
            $scope.url = 'mytodos/' + $scope.totalPerPage;
        }
        $scope.getmytodos();
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.todospagedata[$scope.pageno]) {
            $scope.getmytodos();
        } else {
            $scope.todos = $scope.todospagedata[$scope.pageno];
        }
    };

    $scope.getmyprojects = function() {
        webServices.get('allmyprojects').then(function(getData) {
            if (getData.status == 200) {
                $rootScope.myprojects = getData.data;
                console.log($rootScope.myprojects)
                $scope.getmytodos();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.deletetodo = function(key, todo) {
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
                        webServices.delete('todo/' + todo.id).then(function(getData) {
                            if (getData.status == 200) {
                                $scope.todos.data.splice(key, 1); 
                            }
                        });
                    }
                },
                close: function() {}
            }
        });

    }

    $scope.getmyprojects();

}]);