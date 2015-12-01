module.exports = function() {
    var self = this;
    
    self.gameId = null;
    self.title = null;
    self.artworkUrl = null;
    self.developer = null;
    self.publisher = null;
    self.genre = null;
    self.releases = null;
    self.permalink = null;
    self.setGameId = function (baseUrl, link){
        if (!baseUrl || !link) return;
        
        link = link.replace(baseUrl + '/images/game/', '').replace('/cover', '');
        link = link.substr(0, link.indexOf('.'));
        self.gameId = link;
    };
    self.toJSON = function() {
        return {
            gameId: self.gameId,
            title: self.title,
            artworkUrl: self.artworkUrl,
            developer: self.developer,
            publisher: self.publisher,
            genre: self.genre,
            releases: self.releases,
            permalink: self.permalink
        }
    }
};