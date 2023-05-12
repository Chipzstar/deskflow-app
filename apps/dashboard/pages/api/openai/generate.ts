import { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import axios from 'axios';
import { OpenAIMessage } from '../../../utils/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await runMiddleware(req, res, cors);
		const { query, name, history } = req.body as { query: string; name: string; history: OpenAIMessage[] };
		console.log(query, history);
		const response = await axios.post(`${process.env.API_HOST}/api/v1/generate-chat-response`, {
			query: query,
			name: name,
			history: history
		});
		console.log(response.data);
		return res.status(200).json(response.data);
	} catch (err) {
		if (err?.response?.data) {
			return res.status(500).json(err?.response?.data);
		}
		return res.status(500).json(err);
	}
}
