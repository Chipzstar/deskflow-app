import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { PATHS } from './utils/constants';

export default authMiddleware({
	debug: process.env.NODE_ENV === 'development',
	afterAuth(auth, req, evt) {
		// handle users who aren't authenticated
		console.log('Is Public Route:', auth.isPublicRoute);
		if (!auth.userId && !auth.isPublicRoute) {
			const signInUrl = new URL(PATHS.LOGIN, req.url);
			console.log('Redirecting to LOGIN PAGE');
			return NextResponse.redirect(signInUrl);
		}
	},
	publicRoutes: ['/api/:clerk*', '/api/hello', '/login', '/signup', '/create-organisation']
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
