import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import axios from 'axios';

const zendeskRouter = createTRPCRouter({
	getZendeskInfo: publicProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.zendesk.findUnique({
					where: {
						user_id: input.id
					}
				});
			} catch (err) {
				console.error(err);
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Zendesk not found' });
			}
		}),
	exchangeToken: publicProcedure
		.input(
			z.object({
				code: z.string(),
				state: z.string(),
				subdomain: z.string(),
				type: z.union([z.literal('guide'), z.literal('support')])
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				console.table(input);
				// STATE VERIFICATION - look up the user with a matching state value
				const user = await ctx.prisma.user.findFirst({
					where: {
						zendesk_auth_state_id: input.state
					}
				});
				if (!user) throw Error('User not found');
				// App credentials found in the Basic Information section of the app configuration
				const client_id = String(process.env.NEXT_PUBLIC_ZENDESK_CLIENT_ID);
				const client_secret = String(process.env.ZENDESK_CLIENT_SECRET);
				const scope = String(process.env.NEXT_PUBLIC_ZENDESK_SCOPES);
				// Create a client instance just to make this single call, and use it for the exchange
				const { data: result } = await axios.post(`https://${input.subdomain}.zendesk.com/oauth/tokens`, {
					grant_type: 'authorization_code',
					code: input.code,
					client_id,
					client_secret,
					scope,
					redirect_uri: `${process.env.NGROK_URL || process.env.HOST_DOMAIN}/integrations/zendesk-guide`
				});
				console.log('-----------------------------------------------');
				console.log(result);
				let zendesk = await ctx.prisma.zendesk.findUnique({
					where: {
						user_id: user.clerk_id
					}
				});
				if (!zendesk) {
					zendesk = await ctx.prisma.zendesk.create({
						data: {
							user_id: user.clerk_id,
							access_token: result.access_token,
							subdomain: input.subdomain,
							[input.type]: true
						}
					});
				} else {
					zendesk = await ctx.prisma.zendesk.update({
						where: {
							user_id: user.clerk_id
						},
						data: {
							access_token: result.access_token,
							subdomain: input.subdomain,
							[input.type]: true
						}
					});
				}
				console.log('-----------------------------------------------');
				console.log(zendesk);
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

export default zendeskRouter;
