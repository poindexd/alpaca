angular.module('alpacaEditor')
    .controller("settingsController", ['$scope', function($scope) {
        $scope.firstName = "Haemin";
        $scope.lastName = "Park";
        $scope.email = 'haemin@wellopp.com';
        $scope.profilePic = 'http://danpoindexter.com/img/danpoindexter.png';
        $scope.orgPic = './img/logo_butterfly_only.svg';

        $scope.editorEnabled = false;

        $scope.enableEditor = function() {
            $scope.editorEnabled = true;
            $scope.editableFirstName = $scope.firstName;
            $scope.editableLastName = $scope.lastName;
            $scope.editableEmail = $scope.email;
            $scope.editableProfilePic = $scope.profilePic;
           // $scope.editableOrgPic = $scope.orgPic;
        }

        $scope.disableEditor = function() {
            $scope.editorEnabled = false;
        }

        $scope.save = function() {
            $scope.firstName = $scope.editableFirstName;
            $scope.lastName = $scope.editableLastName;
            $scope.email = $scope.editableEmail;
            $scope.profilePic = $scope.editableProfilePic;
           // $scope.orgPic = $scope.editableOrgPic;
            $scope.disableEditor();
        }


}]);  

