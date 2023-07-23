import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const issueRouter = createTRPCRouter({
	getIssues: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.issue.findMany({
				where: {
					org_id: ctx.auth.orgId
				}
			});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}),
	getUniqueEmployees: protectedProcedure.query(async ({ ctx }) => {
		try {
			const issues = await ctx.prisma.issue.findMany({
				where: {
					org_id: ctx.auth.orgId
				}
			});
			return [...new Set(issues.map(issue => issue.employee_id))];
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	})
});

export default issueRouter;
