import { connectToDatabase } from '../../lib/db';
import { ObjectId } from "mongodb";


export default async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db("starterData");
        const {userId, postId, reaction} = req.query;

    
        const newState = await db.collection("posts").update(
            {
                _id: ObjectId(postId),
            },

                {$pull: 
                        {"reactions.laughs": userId,
                        "reactions.cries": userId,
                        "reactions.screams": userId,
                        "reactions.plots": userId,
                        "reactions.crafts": userId,}
                
                },
                // Nice code below not working. :'( Ugly it is.
                // { $push: {
                //     [arrayToEdit] : userId,
                // }}
        );
        if (reaction=="laughs") {
            const renewedState = await db.collection("posts").update(
                {
                    _id: ObjectId(postId),
                },
                {
                    $push: {
                        "reactions.laughs": userId,
                    }
                }
            )
            res.json(renewedState);
        } else if (reaction=="cries") {
            const renewedState = await db.collection("posts").update(
                {
                    _id: ObjectId(postId),
                },
                {
                    $push: {
                        "reactions.cries": userId,
                    }
                }
            )
            res.json(renewedState);
        } else if (reaction=="screams") {
            const renewedState = await db.collection("posts").update(
                {
                    _id: ObjectId(postId),
                },
                {
                    $push: {
                        "reactions.screams": userId,
                    }
                }
            )
            res.json(renewedState);
        } else if (reaction=="plots") {
            const renewedState = await db.collection("posts").update(
                {
                    _id: ObjectId(postId),
                },
                {
                    $push: {
                        "reactions.plots": userId,
                    }
                }
            )
            res.json(renewedState);
        } else if (reaction=="crafts") {
            const renewedState = await db.collection("posts").update(
                {
                    _id: ObjectId(postId),
                },
                {
                    $push: {
                        "reactions.crafts": userId,
                    }
                }
            )
            res.json(renewedState);
        }
        
    } catch(e) {
        console.error(e);
        throw new Error(e).message;
    }
}