import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const userRouter = createTRPCRouter({
	getUser: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.user.findUnique({
				where: {
					clerk_id: ctx.auth.userId
				}
			});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	})
});

export default userRouter;
