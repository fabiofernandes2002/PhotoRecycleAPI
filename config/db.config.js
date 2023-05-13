const config = {
    USER: process.env.DB_USER || 'FabioFernandes',
    PASSWORD: process.env.DB_PASSWORD || 'ADElinavarela12',
    DB: process.env.DB_NAME || 'PhotoRecycle',
    SECRET : process.env.SECRET
};

config.URL = `mongodb+srv://${config.USER}:${config.PASSWORD}@cluster1.ltnlqoc.mongodb.net/${config.DB}?retryWrites=true&w=majority`;

module.exports = config;
