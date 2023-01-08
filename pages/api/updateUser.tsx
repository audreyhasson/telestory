import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";


export default async (req, res) => {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {id, postId} = req.query;

    const newState = await db.collection("users").update(
        {
            _id: ObjectId(id),
        },
            {$set: 
                {
                    currPost: postId,
                }},
            {$push: {
                postIds: postId,
            }}
    );
    res.json(newState);
}