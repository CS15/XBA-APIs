(function () {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices', 'ParseServices',
        function ($location, $routeParams, XaServices, ParseServices) {

            if (!Parse.User.current()) $location.path('/');

            var gamePermalink = $routeParams.permalink;

            var vm = this;
            
            vm.loadData = function(){
                XaServices.getGameInfo(gamePermalink).then(function(response){
                    vm.gameInfo = response;
                    
                    ParseServices.getGameInformation(vm.gameInfo.gameId).then(function(response){
                        if (response.length > 0) {
                            vm.inParse = true;
                            vm.parseObjectId = response[0].objectId;
                        }
    
                        vm.gameInfoChecked = true;
                    });
    
                    XaServices.getGameAchievements(gamePermalink).then(function(response){
                        vm.achievements = response;
    
                        ParseServices.getGameAchievements(vm.gameInfo.gameId).then(function(response){
                            vm.parseAchievements = response;
                            
                            if (response.length > 0) {
                                angular.forEach(vm.achievements, function(value, key){
    
                                   for(var i in vm.parseAchievements) {
                                       if (value.achievementId === response[i].achievementId) {
                                           value.inParse = true;
                                       }
                                   }
                                });
                            }
    
                            vm.gameAchievementsChecked = true;
                        });
                    });
                });
            }
            
            vm.addGameInfoToParse = function(game) {
                ParseServices.addGameInfoToParse(game).then(function (response) {
                    vm.loadData();
                });
            };

            vm.uploadAllAchievements = function (){
                if (vm.achievements.length > 0) {

                    angular.forEach(vm.achievements, function(value, key){
                        value.game = vm.parseObjectId;
                        value.gameId = vm.gameInfo.gameId;
                    });

                    ParseServices.addAchievementsToParse(vm.achievements).then(function (response){
                        vm.loadData();
                    }, function(error){
                        alert('Error');
                    });
                }
            };
            
            vm.loadData();
    }]);
})();