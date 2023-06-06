import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";

async function handler(req, res) {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {userId, userToAddId} = req.query;

    const result = await db.collection('users').update({
        _id: ObjectId(userId),
    },
        {$push: {
            family: userToAddId,
        }});

    res.status(201).json(result);
    client.close();
}

export default handler;