'use strict';
app.controller('ViewTodoCtrl', ['$scope', '$ngConfirm', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $ngConfirm, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $rootScope.formLoading = true;
    $rootScope.todoData = {};

    $scope.getTodo = function() {
        webServices.get('todo/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.todoData = getData.data;
                if($rootScope.todoData.type == 'Project'){
                    $rootScope.todoData.images = $rootScope.todoData.projectinfo.files;
                }
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

    $scope.deletetodo = function(todo) {
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
                                $state.go('app.todos');
                            }
                        });
                    }
                },
                close: function() {}
            }
        });

    }

    $scope.getTodo();


}]);