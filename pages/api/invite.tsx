import { connectToDatabase } from '../../lib/db';

async function handler(req, res) {
    const client = await connectToDatabase();
    const db = client.db("starterData");
    const {inviterId, inviterUsn, inviteeId, inviteeUsn} = req.query;

    const result = await db.collection('invites').insertOne({
        to: inviteeId,
        toUser: inviteeUsn,
        from: inviterId,
        fromUser: inviterUsn,
      });

    res.status(201).json(result);
    client.close();
}

export default handler;