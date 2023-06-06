import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";
import moment from 'moment';

async function handler(req, res) {
    const start = new Date();
    start.setHours(0,0,0,0);
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {familyIds} = req.body;

    const result = await db.collection('posts').find({
        authorID: {$in: familyIds},
        date: {
            $gte: start,
        },
        postSucess: true,
    }).toArray();

    res.status(201).json(result);
    client.close();
}

export default handler;