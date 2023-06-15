import type { PrismaClient } from '@prisma/client';
import { log } from 'next-axiom';
import {
	UserWebhookEvent,
	UserJSON,
	DeletedObjectJSON,
	OrganizationWebhookEvent,
	OrganizationJSON
} from '@clerk/clerk-sdk-node';

export const createNewUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
	try {
		const payload = event.data as UserJSON;
		console.log(payload);
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
