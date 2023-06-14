const config = {
  /* don't expose password or any sensitive info, done only for demo */
  // if environment variables are not defined, use default values
  USER: process.env.DB_USER || 'PhotoRecycle',
  PASSWORD: process.env.DB_PASSWORD || 'Lucas.123',
  DB: process.env.DB_NAME || 'PhotoRecycleDB',
  SECRET: process.env.SECRET,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
config.URL = `mongodb+srv://${config.USER}:${config.PASSWORD}@cluster0.jow2ps4.mongodb.net/${config.DB}?retryWrites=true&w=majority
`;
module.exports = config;

// mongodb+srv://${config.USER}:${config.PASSWORD}@cluster0.nrqcqnv.mongodb.net/${config.DB}?retryWrites=true&w=majority
