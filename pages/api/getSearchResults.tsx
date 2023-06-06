import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";

async function handler(req, res) {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {query} = req.query;
    //const thisQuery = "banana" //query.toString()

    const result = await db.collection('users').find({
        username: {$regex: query},
    }).toArray();

    res.status(201).json(result);
    client.close();
}

export default handler;