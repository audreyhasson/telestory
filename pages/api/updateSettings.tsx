import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";

// import type { NextApiRequest, NextApiResponse } from 'next'
// import {updateSettings} from "../../lib/atlas";

// export default async function handler(

// req: NextApiRequest,
// res: NextApiResponse
// ) {
//     const id = req.query;
// 	const updatedUser = await updateSettings(id);
// 	res.status(200).json(updatedUser);
// }
export default async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db("starterData");
        const id = req.query;
    
        const newState = await db.collection("users").update(
            {
                _id: ObjectId(id),
            },
            [
                {$set: 
                    {
                        public: { $not: "$public" }
                    }
            }]
        );
        await res.json(newState)
    } catch(e) {
        console.error(e);
        throw new Error(e).message;
    }
}