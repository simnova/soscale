import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb&retryWrites=false", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            },
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            poolSize: Number(process.env.COSMOSDB_POOL_SIZE)
        }).then(() => console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`));
    } catch (error) {
        console.log(`🔥 An error ocurred when trying to connect Mongoose with ${mongoose.connection.name} 🔥`)
        throw error;
    }
}

export default connect;