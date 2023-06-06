import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";

async function handler(req, res) {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {userId, userToRemoveId} = req.query;

    const result = await db.collection('users').update({
        _id: ObjectId(userId),
    },
        {$pull: {
            family: userToRemoveId,
        }}
    );

    res.status(201).json(result);
    client.close();
}

export default handler;