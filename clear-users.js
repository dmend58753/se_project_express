const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to MongoDB');
    return mongoose.connection.db.collection('users').deleteMany({});
  })
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} users`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });