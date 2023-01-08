import type { NextApiRequest, NextApiResponse } from 'next'
import {getPost} from "../../lib/atlas";

export default async function handler(

req: NextApiRequest,
res: NextApiResponse
) {
    
	// Get the query string parameter url.
	const {id} = req.query;

    const idToSend = id.toString();
  
	const post = await getPost(idToSend);
	res.status(200).json(post);
}