(function () {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$route', '$location', '$routeParams', 'XaServices', 'ParseServices',
        function ($route, $location, $routeParams, XaServices, ParseServices) {

            if (!Parse.User.current()) $location.path('/');

            var gamePermalink = $routeParams.permalink;

            var vm = this;

            XaServices.getGameInfo(gamePermalink).then(function(response){
                vm.gameInfo = response;

                ParseServices.getGameInfo(vm.gameInfo.gameId).then(function(response){
                    if (response.length > 0) {
                        vm.inParse = true;
                        vm.parseObjectId = response[0].objectId;
                    }
                });
            });

            XaServices.getGameAchievements(gamePermalink).then(function(response){
                vm.achievements = response;
            });

            vm.addGameInfoToParse = function(game) {
                ParseServices.updateGameInfo(game).then(function (response) {
                    $route.reload();
                });
            };

            vm.uploadAllAchievements = function (){
                if (vm.achievements.length > 0) {

                    angular.forEach(vm.achievements, function(value, key){
                        value.game = vm.parseObjectId;
                    });

                    ParseServices.uploadAchievements(vm.achievements).then(function (response){
                        alert('Achievements Uploaded');
                    }, function(error){
                        console.log(error);
                        alert('Error');
                    });
                }
            };

    }]);
})();