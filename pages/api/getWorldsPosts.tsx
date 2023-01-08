import type { NextApiRequest, NextApiResponse } from 'next'
import {getWorldsPosts} from "../../lib/atlas";

export default async function handler(

req: NextApiRequest,
res: NextApiResponse
) {
	const posts = await getWorldsPosts();
	res.status(200).json(posts);
}