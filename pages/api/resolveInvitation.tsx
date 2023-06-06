import { connectToDatabase } from '../../lib/db';

async function handler(req, res) {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {inviterId, inviteeId} = req.query;

    const result = await db.collection('invites').remove(
        {
            to: inviteeId,
            from: inviterId,
        }
    );

    res.status(201).json(result);
    client.close();
}

export default handler;

//benny 63bc97978d09fa9104d5e392
// me 63bc85027790ed6a464a86e1