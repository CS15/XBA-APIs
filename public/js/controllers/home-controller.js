(function() {
    'use strict';

    angular.module('controllers').controller('HomeController', ['$location', function($location) {

        var vm = this;

        if (Parse.User.current()) $location.path('/dashboard');

        vm.submit = function(user) {

            Parse.User.logIn(user.email, user.password)
                .then(function() {
                        window.location = "/dashboard";
                    },
                    function(user, error) {
                        console.log(error);
                    });
        };
    }]);
})();