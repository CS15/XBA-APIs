module.exports = function() {
    var self = this;
    
    self.gameId = null;
    self.title = null;
    self.imageUrl = null;
    self.developer = null;
    self.publisher = null;
    self.genre = null;
    self.release = null;
    self.permalink = null;
    self.setGameId = function (baseUrl, link){
        if (!baseUrl || !link) return;
        
        link = link.replace(baseUrl + '/images/game/', '').replace('/cover', '');
        link = link.substr(0, link.indexOf('.'));
        self.gameId = link;
    };
};