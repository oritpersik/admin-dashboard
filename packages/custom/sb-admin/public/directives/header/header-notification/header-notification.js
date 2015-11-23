'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('headerNotification', ['MeanUser', '$state', function(MeanUser, $state) {
        return {
            templateUrl: 'sb-admin/directives/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            link: function(scope, elem, attrs) {
                scope.logout = function() {
                    MeanUser.logout();
                    $state.go('login');
                };
            }
        }
    }]);
