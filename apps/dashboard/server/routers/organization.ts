import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { clerkClient } from '@clerk/nextjs/server';
import { sluggify } from '../../utils/functions';

const organizationRouter = createTRPCRouter({
	getOrganization: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.organization.findUnique({
				where: {
					clerk_id: ctx.auth.orgId
				},
				include: {
					slack: true,
					zendesk: true
				}

			});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code "INTERNAL_SERVER_ERROR", message: `No organization found with ID: ${ctx.auth.orgId}` });
		}
	}),
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
		}),
	updateSlackState: protectedProcedure
		.input(
			z.object({
				state: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const org = await ctx.prisma.organization.update({
					where: {
						clerk_id: ctx.auth.orgId
					},
					data: {
						slack_auth_state_id: input.state
					}
				});
				console.log(org);
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
				const org = await ctx.prisma.organization.update({
					where: {
						clerk_id: ctx.auth.orgId
					},
					data: {
						zendesk_auth_state_id: input.state
					}
				});
				console.log('-----------------------------------------------');
				console.log(org);
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

export default organizationRouter;
