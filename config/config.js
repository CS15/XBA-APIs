// config database
module.exports = {
	server: {
    	db: '',
    	port: process.env.PORT || 3000,
    	secret: 'XBA1AMR3L0S',
    	apiKey: ['1234567890']
	},
	checkApiKey: function (key){
		return (key && key === this.server.apiKey[0]);
	}
};