import React from 'react';
import Page from '../layout/Page';
import { Button, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { PATHS } from '../utils/constants';

const InviteMembers = () => {
	const router = useRouter();
	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<Stack className="mx-auto" spacing={40}>
				<Title>Welcome to the Invite Members Page!!</Title>
				<Button onClick={() => router.push(PATHS.HOME)}>Skip and go to Dashboard</Button>
			</Stack>
		</Page.Container>
	);
};

export default InviteMembers;
