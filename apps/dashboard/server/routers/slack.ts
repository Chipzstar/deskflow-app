import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { WebClient } from '@slack/web-api';

const slackRouter = createTRPCRouter({
	getSlackInfo: protectedProcedure.query(async ({ ctx }) => {
		try {
			const slack = await ctx.prisma.slack.findUnique({
				where: {
					user_id: ctx.auth.userId
				}
			});
			if (!slack) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'No Slack configuration found' });
			}
			return slack;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}),
	exchangeToken: publicProcedure
		.input(
			z.object({
				code: z.string(),
				state: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				console.table(input);
				// look up the user with a matching state value
				const user = await ctx.prisma.user.findFirst({
					where: {
						slack_auth_state_id: input.state
					}
				});
				if (!user) {
					throw Error('User not found');
				}
				// App credentials found in the Basic Information section of the app configuration
				const clientId = String(process.env.SLACK_CLIENT_ID);
				const clientSecret = String(process.env.SLACK_CLIENT_SECRET);
				// Create a client instance just to make this single call, and use it for the exchange
				const result = await new WebClient().oauth.v2.access({
					client_id: clientId,
					client_secret: clientSecret,
					code: input.code,
					redirect_uri: `${process.env.HOST_DOMAIN}/integrations/slack`
				});
				console.table(result);
				const slack = await ctx.prisma.slack.findUnique({
					where: {
						user_id: user.clerk_id
					}
				});
				if (!slack) {
					await ctx.prisma.slack.create({
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
					await ctx.prisma.slack.update({
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
				return result;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err?.message ?? 'Internal server error'
				});
			}
		})
});

export default slackRouter;
