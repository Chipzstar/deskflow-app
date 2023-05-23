import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const userRouter = createTRPCRouter({
	getUser: publicProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.user.findUnique({
				where: {
					id: 0
				}
			});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}),
	updateSlackState: publicProcedure
		.input(
			z.object({
				state: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const user = await ctx.prisma.user.update({
					where: {
						clerk_id: 'user_2QC5J2hrNzky9c8PHta8z57No3o'
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
		})
});

export default userRouter;
