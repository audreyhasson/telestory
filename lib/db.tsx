import { MongoClient } from 'mongodb';
import mongoose from 'mongoose'

// let cached = global.mongoose;

// if (!cached) {
// cached = global.mongoose = { conn: null, promise: null }
// }


export async function connectToDatabase() {
    const uri = process.env.DB_CONNECT;
	const client = await MongoClient.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});


	return client;

/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/

		/**
		 * Global is used here to maintain a cached connection across hot reloads
		 * in development. This prevents connections growing exponentially
		 * during API Route usage.
		 */
		
	// if (cached.conn) {
	// 	return cached.conn
	// }

	// if (!cached.promise) {
	// 	const opts = {
	// 	useNewUrlParser: true,
	// 	useUnifiedTopology: true,
	// 	bufferCommands: false,
	// 	bufferMaxEntries: 0,
	// 	useFindAndModify: true,
	// 	useCreateIndex: true
	// 	}

	// 	cached.promise = mongoose.connect(uri, opts).then(mongoose => {
	// 	return mongoose
	// 	})
	// }
	// cached.conn = await cached.promise
	// return cached.conn
		
}
