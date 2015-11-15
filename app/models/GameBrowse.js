module.exports = function() {
    var self = this;
    
    self.gameId = null;
    self.title = null;
    self.imageUrl = null;
    self.icoUrl = null;
    self.numberOfAchievements = null;
    self.gamerScore = null;
    self.permalink = null;
    self.setGameId = function (baseUrl, link){
        if (!baseUrl || !link) return;
        
        link = link.replace(baseUrl + '/images/achievements/', '').replace('/cover', '');
        link = link.substr(0, link.indexOf('.'));
        self.gameId = link;
    };
    self.toJSON = function() {
        return {
            gameId: self.gameId,
            title: self.title,
            imageUrl: self.imageUrl,
            icoUrl: self.icoUrl,
            numberOfAchievements: self.numberOfAchievements,
            gamerScore: self.gamerScore,
            permalink: self.permalink
        }
    }
};