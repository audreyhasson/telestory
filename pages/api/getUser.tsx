import type { NextApiRequest, NextApiResponse } from 'next'
import {getUser} from "../../lib/atlas";

export default async function handler(

req: NextApiRequest,
res: NextApiResponse
) {
    
	// Get the query string parameter url.
	const {id} = req.query;

	const idToSend = id?.toString();
  
	const user = await getUser(id);
	res.status(200).json(user);
}