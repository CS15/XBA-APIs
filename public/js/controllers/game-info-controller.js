(function () {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices', 'ParseServices',
        function ($location, $routeParams, XaServices, ParseServices) {

            if (!Parse.User.current()) $location.path('/');

            var gamePermalink = $routeParams.permalink;

            var vm = this;

            XaServices.getGameInfo(gamePermalink).then(function(response){
                vm.gameInfo = response.data;

                ParseServices.getGameInfo(vm.gameInfo.gameId).then(function(response){
                    vm.inParse = response.data.length > 0;
                    console.log(response);
                });

                XaServices.getGameAchievements(gamePermalink).then(function(response){
                    vm.achievements = response.data;
                });
            });

            vm.updateGameInfo = function(game) {
                ParseServices.updateGameInfo(game).then(function (response) {
                    console.log(response);
                });
            };
    }]);
})();