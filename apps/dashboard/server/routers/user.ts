import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const userRouter = createTRPCRouter({
	getUser: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.user.findUnique({
				where: {
					clerk_id: ctx.auth.userId
				},
				include: {
					slack: true,
					zendesk: true
				}
			});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}),
	updateSlackState: protectedProcedure
		.input(
			z.object({
				state: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const user = await ctx.prisma.user.update({
					where: {
						clerk_id: ctx.auth.userId
					},
					data: {
						slack_auth_state_id: input.state
					}
				});
				console.log(user);
				return 'Success';
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err?.message ?? 'Internal Server Error'
				});
			}
		}),
	updateZendeskState: protectedProcedure
		.input(
			z.object({
				state: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const user = await ctx.prisma.user.update({
					where: {
						clerk_id: ctx.auth.userId
					},
					data: {
						zendesk_auth_state_id: input.state
					}
				});
				console.log('-----------------------------------------------');
				console.log(user);
				console.log('-----------------------------------------------');
				return 'Success';
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err?.message ?? 'Internal Server Error'
				});
			}
		})
});

export default userRouter;
