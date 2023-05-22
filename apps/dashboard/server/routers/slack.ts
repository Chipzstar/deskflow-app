import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import axios from 'axios';

const slackRouter = createTRPCRouter({
	exchangeToken: publicProcedure.query(async ({ ctx }) => {
		try {
			return '';
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
		}
	})
});
