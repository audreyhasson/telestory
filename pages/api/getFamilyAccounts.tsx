import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";

function getOIDs(ids) { 
    let oids = [];
    for (let i=0; i<ids.length;i++) {
        oids.push(new ObjectId(ids[i]));
    }
    return oids;
}

async function handler(req, res) {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {familyIds} = req.body;
    const familyOIDS = getOIDs(familyIds)

    const result = await db.collection('users').find({
        _id: {$in: familyOIDS},
    }).toArray();

    res.status(201).json(result);
    client.close();
}

export default handler;