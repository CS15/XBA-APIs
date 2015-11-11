(function(){
    'use strict';
    
    angular.module('controllers').controller('HomeController', ['UserServices', function(UserServices){
        
        var vm = this;
        
        vm.submit = function(user){
            UserServices.login(user)
            .then(function(response){
                console.log(response);
            }, function(err){
                console.log(err);
            });
        };
    }]);
})();