import type { NextApiRequest, NextApiResponse } from 'next'
import {getOutgoingInvites} from "../../lib/atlas";

export default async function handler(

req: NextApiRequest,
res: NextApiResponse
) {
    const {id} = req.query;

	const words = await getOutgoingInvites(id);
	res.status(200).json(words);
}