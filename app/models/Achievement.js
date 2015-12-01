module.exports = function() {
    var self = this;
    
    self.achievementId = null;
    self.title = null;
    self.gamerscore = null;
    self.description = null;
    self.imageUrl = null;
    self.permalink = null;
    self.setAchievementId = function(slug) {
        if (!slug) {
            self.achievementId = '000000';
            return;
        }
        
        self.achievementId = slug.substr(0, slug.indexOf('-'));
    };
};