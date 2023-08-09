console.log('======================= add user =======================');

db = db.getSiblingDB(process.env.MONGO_DB_NAME);

db.createUser({
  pwd: process.env.MONGO_PWD,
  user: process.env.MONGO_USER,
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_DB_NAME,
    },
  ],
});

console.log('======================= end add user =======================');
