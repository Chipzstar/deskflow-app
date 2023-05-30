import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { redis } from './redis';
import { stripe } from './stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/backend';

interface AuthContext {
	auth: SignedInAuthObject | SignedOutAuthObject;
	req: NextApiRequest;
	res: NextApiResponse;
}

export const createContextInner = async ({ auth, res, req }: AuthContext) => {
	return {
		auth,
		prisma,
		redis,
		stripe,
		req,
		res
	};
};

export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
	const { req, res } = opts;
	return await createContextInner({
		auth: getAuth(opts.req),
		req,
		res
	});
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
