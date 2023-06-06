import type { NextApiRequest, NextApiResponse } from 'next'
import {getIncomingInvites} from "../../lib/atlas";

export default async function handler(

req: NextApiRequest,
res: NextApiResponse
) {
    const {id} = req.query;

	const words = await getIncomingInvites(id);
	res.status(200).json(words);
}