(function () {
    'use strict';

    angular.module('app.page')
        .directive('customPage', customPage);


    // add class for specific pages to achieve fullscreen, custom background etc.
    function customPage() {
        var directive = {
            restrict: 'A',
            controller: ['$scope', '$element', '$location', customPageCtrl]
        };

        return directive;

        function customPageCtrl($scope, $element, $location) {
            var addBg, path;

            path = function() {
                return $location.path();
            };

            addBg = function(path) {
                $element.removeClass('on-canvas');
                $element.removeClass('body-wide body-login body-err body-lock body-auth body-mainhome body-home agencysu');
                switch (path) {
                    case '/404':
                    case '/page/404':
                    case '/page/500':
                        return $element.addClass('body-wide body-err');
                    case '/page/signin':
                    case '/page/signup':
                    case '/page/forgot-password':
                    case '/page/agencysignup':
                        return $element.addClass('body-wide body-auth body-login agencysu');
                    case '/page/lock-screen':
                        return $element.addClass('body-wide body-lock');
                    case '/page/mainhome':
                        return $element.addClass('body-wide body-auth body-mainhome');
                    case '/page/profile':
                   
                        return $element.addClass('body-wide body-auth body-mainhome body-profile');
                    case '/page/home':
                    case '/page/tracking':
                        return $element.addClass('body-wide body-auth body-mainhome body-profile body-home');
                }
            };

            addBg($location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return addBg($location.path());
            });
        }        
    }
 
})(); 


