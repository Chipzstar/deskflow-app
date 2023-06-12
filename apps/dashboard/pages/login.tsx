import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Page from '../layout/Page';

const Login = () => {
	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<SignIn />
		</Page.Container>
	);
};

export default Login;
