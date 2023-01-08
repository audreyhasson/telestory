import type { NextApiRequest, NextApiResponse } from 'next'
import {getWords} from "../../lib/atlas";

export default async function handler(

req: NextApiRequest,
res: NextApiResponse
) {
	const words = await getWords();
	res.status(200).json(words);
}