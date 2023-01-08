import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";

//Dangerous code below impacts ALL posts!
export default async (req, res) => {
    
    try {
        const client = await connectToDatabase();
        const db = client.db("starterData");
        //const {id, postId} = req.query;
    
        const newState = await db.collection("posts").update(
            {},
            { $set: {reactions: {
                laughs: [],
                cries: [],
                screams: [],
                plots: [],
                crafts: []
            }}}
        );
        res.json(newState);
    } catch(e) {
        console.error(e);
        throw new Error(e).message;
    }
}