import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { clerkClient } from '@clerk/nextjs/server';
import { sluggify } from '../../utils/functions';

const organizationRouter = createTRPCRouter({
	createOrganization: protectedProcedure
		.input(
			z.object({
				legal_name: z.string(),
				display_name: z.string(),
				business_crn: z.string(),
				business_url: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const org = await clerkClient.organizations.createOrganization({
					createdBy: ctx.auth.userId,
					name: input.display_name,
					slug: sluggify(input.display_name),
					publicMetadata: {
						legal_name: input.legal_name,
						business_url: input.business_url
					},
					privateMetadata: {
						business_crn: input.business_crn
					}
				});
				console.log('-----------------------------------------------');
				console.log(org);
				console.log('-----------------------------------------------');
				return org;
			} catch (err) {
				console.error(err);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err?.message });
			}
		})
});

export default organizationRouter;
