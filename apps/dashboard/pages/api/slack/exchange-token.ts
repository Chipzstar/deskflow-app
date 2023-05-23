import { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import { WebClient } from '@slack/web-api';
import { prisma } from '../../../server/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await runMiddleware(req, res, cors);
		console.table(req.body);
		// look up the user with a matching state value
		const user = await prisma.user.findFirst({
			where: {
				slack_auth_state_id: req.body.state
			}
		});
		if (!user) {
			return res.status(404).json({
				error: 'User not found'
			});
		}
		// App credentials found in the Basic Information section of the app configuration
		const clientId = String(process.env.SLACK_CLIENT_ID);
		const clientSecret = String(process.env.SLACK_CLIENT_SECRET);
		// Create a client instance just to make this single call, and use it for the exchange
		const result = await new WebClient().oauth.v2.access({
			client_id: clientId,
			client_secret: clientSecret,
			code: req.body.code
		});
		console.table(result);
		const slack = await prisma.slack.findUnique({
			where: {
				user_id: user.clerk_id
			}
		});
		if (!slack) {
			await prisma.slack.create({
				data: {
					user_id: user.clerk_id,
					team_name: result?.team?.name ?? '',
					team_id: result?.team?.id ?? '',
					access_token: result.access_token,
					scopes: result.scope,
					bot_id: result.bot_user_id
				}
			});
		} else {
			await prisma.slack.update({
				where: {
					user_id: user.clerk_id
				},
				data: {
					team_name: result?.team?.name ?? '',
					team_id: result?.team?.id ?? '',
					access_token: result.access_token,
					scopes: result.scope,
					bot_id: result.bot_user_id
				}
			});
		}
		return res.redirect(`${process.env.ORIGIN}/integrations/slack?code=${req.body.code}&state=${result.state}`);
	} catch (err) {
		if (err?.response?.data) {
			return res.status(500).json(err?.response?.data);
		}
		return res.status(500).json(err);
	}
}
