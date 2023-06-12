import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Page from '../layout/Page';

const Signup = () => {
	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<SignUp />
		</Page.Container>
	);
};

export default Signup;
