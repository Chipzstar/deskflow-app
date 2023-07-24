import type { PrismaClient } from '@prisma/client';
import { log } from 'next-axiom';
import {
	UserWebhookEvent,
	UserJSON,
	DeletedObjectJSON,
	OrganizationWebhookEvent,
	OrganizationMembershipWebhookEvent,
	OrganizationJSON,
	OrganizationMembershipJSON,
	OrganizationInvitationWebhookEvent,
	OrganizationInvitationJSON
} from '@clerk/clerk-sdk-node';

export const createNewUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data as UserJSON;
		console.log(payload);
		// check if the user has already been created
		const existingUser = await prisma.user.findUnique({
			where: { email: payload.email_addresses[0].email_address }
		});
		if (existingUser) {
			console.log('user already exists');
			log.info('--------------------------------');
			log.debug('User already exists', existingUser);
			log.info('--------------------------------');
			return existingUser;
		}
		// create the user
		const user = await prisma.user.create({
			data: {
				clerk_id: payload.id,
				email: payload.email_addresses[0].email_address,
				fullname: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		log.info('-----------------------------------------------');
		log.debug('New user!!', user);
		log.info('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const updateUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data as UserJSON;
		// create the user
		const user = await prisma.user.update({
			where: {
				clerk_id: payload.id
			},
			data: {
				email: payload.email_addresses[0].email_address,
				fullname: `${payload.first_name} ${payload.last_name}`,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Updated user!!', user);
		log.info('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const deleteUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data as DeletedObjectJSON;
		// check that the user with clerk_id exists already
		const existingUser = await prisma.user.findUnique({
			where: { clerk_id: payload.id }
		});
		if (!existingUser) {
			console.log('user does not exist');
			return null;
		}
		const user = await prisma.user.delete({
			where: {
				clerk_id: payload.id
			}
		});
		if (user) {
			log.info('-----------------------------------------------');
			log.debug('User deleted!!', user);
			log.info('-----------------------------------------------');
		}
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const createOrganisation = async ({
	event,
	prisma
}: {
	event: OrganizationWebhookEvent;
	prisma: PrismaClient;
}) => {
	try {
		const payload = event.data as OrganizationJSON;
		// check if the organization has already been created
		const existingOrg = await prisma.organization.findUnique({
			where: {
				clerk_id: payload.id
			}
		});
		if (existingOrg) {
			console.log('organisation already exists');
			log.info('--------------------------------');
			log.debug('Organization already exists', existingOrg);
			log.info('--------------------------------');
			return existingOrg;
		}
		// create the organization
		const organization = await prisma.organization.create({
			data: {
				clerk_id: payload.id,
				name: payload.name,
				slug: payload.slug ?? payload.name.toLowerCase()
			}
		});
		log.info('-----------------------------------------------');
		log.debug('New organization!!', organization);
		log.info('-----------------------------------------------');
		// update the user
		const user = await prisma.user.update({
			where: {
				clerk_id: payload.created_by
			},
			data: {
				organization_id: payload.id
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Updated user!!', user);
		log.info('-----------------------------------------------');
		return organization;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const deleteOrganisation = async ({
	event,
	prisma
}: {
	event: OrganizationWebhookEvent;
	prisma: PrismaClient;
}) => {
	try {
		const payload = event.data as OrganizationJSON;
		// delete all users under that organisation
		const users = await prisma.user.deleteMany({
			where: {
				organization_id: payload.id
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Deleted Users!!', users);
		log.info('-----------------------------------------------');
		// delete the organization
		const organization = await prisma.organization.delete({
			where: {
				clerk_id: payload.id
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Organisation deleted!!', organization);
		log.info('-----------------------------------------------');
		return organization;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const invitationAccepted = async ({
	event,
	prisma
}: {
	event: OrganizationInvitationWebhookEvent;
	prisma: PrismaClient;
}) => {
	try {
		const payload = event.data as OrganizationInvitationJSON;
		// create the user + link to the organization
		const user = await prisma.user.create({
			data: {
				clerk_id: payload.organization_id,
				email: payload.email_address,
				organization_id: payload.organization_id,
				fullname: '',
				firstname: '',
				lastname: '',
				role: 'member'
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Invitation accepted!!', user);
		log.info('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const createOrganisationMembership = async ({
	event,
	prisma
}: {
	event: OrganizationMembershipWebhookEvent;
	prisma: PrismaClient;
}) => {
	try {
		const payload = event.data as OrganizationMembershipJSON;
		// find the user with a temp clerk_id equal to the organization_id and add missing information
		const user = await prisma.user.update({
			where: {
				clerk_id: payload.organization.id
			},
			data: {
				clerk_id: payload.public_user_data.user_id,
				fullname: `${payload.public_user_data.first_name} ${payload.public_user_data.last_name}`,
				firstname: String(payload.public_user_data.first_name),
				lastname: String(payload.public_user_data.last_name)
			}
		});
		log.info('-----------------------------------------------');
		log.debug('Organisation Membership created!!', user);
		log.info('-----------------------------------------------');
		return user;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
