import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";


export default async (req, res) => {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {id} = req.query;
    //const stringId = id.toString();

    const newPostState = await db.collection("posts").update(
        {
            authorID: id,
        },
        [
            {$set: 
                {
                    public: { $not: "$public" },
                }
        }]
    );

    await res.json(newPostState);

}

