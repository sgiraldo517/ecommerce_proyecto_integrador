import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://sofia:PapasFritas2024@cluster0.s2hghwf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
