(function () {
    'use strict';

    angular.module('controllers').controller('BrowseController', ['$location', 'XaServices', function ($location, XaServices) {

        var vm = this;

        if (!Parse.User.current()) $location.path('/');

        vm.getGames = function (letter) {
            XaServices.getGames(letter).then(function(response){
                vm.games = response.data;
            });
        };

        vm.getGames('0-9');
    }]);
})();