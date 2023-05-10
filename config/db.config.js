const config = {
    /* don't expose password or any sensitive info, done only for demo 
     */ // if environment variables are not defined, use default values 
    USER: process.env.DB_USER || 'FabioFernandes',
    PASSWORD: process.env.DB_PASSWORD || 'ADElinavarela12',
    DB: process.env.DB_NAME || 'tutorialsDB'
};
config.URL = `mongodb+srv://${config.USER}:${config.PASSWORD}@cluster1.ltnlqoc.mongodb.net/${config.DB}?retryWrites=true&w=majority`;
module.exports = {
    config,
    SECRET: process.env.SECRET
}