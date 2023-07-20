import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { clerkClient } from '@clerk/nextjs/server';
import { sluggify } from '../../utils/functions';
import { clients } from '@clerk/nextjs/api';

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
			throw new TRPCError({ message: `No organization found with ID: ${ctx.auth.orgId}`, code: 'BAD_REQUEST' });
		}
	}),
	getOrganizationByUser: publicProcedure
		.input(
			z.object({
				email: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const user = await ctx.prisma.user.findUniqueOrThrow({
					where: {
						email: input.email
					}
				});
				const orgs = await clerkClient.users.getOrganizationMembershipList({
					userId: user.clerk_id
				});
				if (orgs.length === 0) return null;
				console.log(orgs[0]);
				return orgs[0];
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					message: `No organization found with ID: ${ctx.auth.orgId}`,
					code: 'BAD_REQUEST'
				});
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
		}),
	sendOrgInvitation: protectedProcedure
		.input(
			z.object({
				email: z.string().email(),
				role: z.enum(['admin', 'basic_member', 'guest_member']),
				orgId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const result = await clerkClient.organizations.createOrganizationInvitation({
					emailAddress: input.email,
					role: input.role,
					organizationId: input.orgId,
					inviterUserId: ctx.auth.userId,
					redirectUrl: `${process.env.NGROK_URL || process.env.HOST_DOMAIN}/signup?accept-org-invitation=${
						input.orgId
					}`
				});
				console.log('-----------------------------------------------');
				console.log(result);
				console.log('-----------------------------------------------');
				return result;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err?.errors[0].longMessage ?? 'Oops something went wrong. Please try again'
				});
			}
		})
});

export default organizationRouter;
