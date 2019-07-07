'use strict';
app.controller('OTPModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
     $scope.verifyotp = function(form) {
        if (form.$valid) {
            $rootScope.otpLoading = true;
            webServices.put('verifyotp', $scope.otpData).then(function(getData) {
                $rootScope.otpLoading = false;
                if (getData.status == 200) {
                    $rootScope.closepopoverItem();
                    $rootScope.getUserInfo();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $scope.profileedit = false;
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    $rootScope.$emit("showerrors", $scope.errors);
                }

            });
        } else {
            if (!form.otp.$valid) {
                $scope.errors.push('Please enter received otp');
            }
            $rootScope.$emit("showerrors", $scope.errors);
        }
    }


}]);