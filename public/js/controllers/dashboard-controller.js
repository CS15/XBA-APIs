(function () {
    'use strict';

    angular.module('controllers').controller('DashboardController', ['$location', 'XaServices', function ($location, XaServices) {

        var vm = this;

        if (!Parse.User.current()) $location.path('/');
        
        // var roleACL = new Parse.ACL();
        // roleACL.setPublicReadAccess(true);
        
        // var role = new Parse.Role("Admin", roleACL);
        // role.getUsers().add(Parse.User.current());
        // role.save();
        
        // var query = (new Parse.Query(Parse.Role));
        // query.equalTo("name", "Admin");
        // query.equalTo("users", Parse.User.current());
        // query.first().then(function(adminRole) {
        //     if (adminRole) {
        //         console.log("user is an admin");
        //     } else {
        //         console.log("user is not an admin");
        //     }
        // });
        


        XaServices.getLatestAchievements().then(function(response){
            vm.latestAchievements = response;
        });
    }]);
})();