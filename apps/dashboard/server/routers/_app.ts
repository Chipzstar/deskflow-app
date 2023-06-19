import { createTRPCRouter } from '../trpc';
import authRouter from './auth';
import slackRouter from './slack';
import userRouter from './user';
import zendeskRouter from './zendesk';
import issueRouter from './issues';

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	slack: slackRouter,
	zendesk: zendeskRouter,
	issue: issueRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
