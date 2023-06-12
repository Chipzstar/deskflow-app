import { NextApiRequest, NextApiResponse } from 'next';
import { runMiddleware, cors } from './cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	await runMiddleware(req, res, cors);
	res.status(200).json({
		message: 'Hello from the serverless function!'
	});
}
