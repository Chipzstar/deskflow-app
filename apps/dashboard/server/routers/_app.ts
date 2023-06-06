import { createTRPCRouter } from '../trpc';
import authRouter from './auth';
import slackRouter from './slack';
import userRouter from './user';
import zendeskRouter from './zendesk';

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	slack: slackRouter,
	zendesk: zendeskRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
