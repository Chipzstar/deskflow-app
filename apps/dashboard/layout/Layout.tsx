import React, { useMemo, useState } from 'react';
import { AppShell, Burger, Group, Header, Image, Text, MediaQuery } from '@mantine/core';
import { useRouter } from 'next/router';
import { AUTH_ROUTES, DEFAULT_HEADER_HEIGHT, PATHS } from '../utils/constants';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@mantine/hooks';

const Layout = ({ children }) => {
	const router = useRouter();
	const isLoggedIn = useMemo(() => !AUTH_ROUTES.includes(router.pathname), [router.pathname]);
	const [opened, setOpened] = useState(false);
	const mobileScreen = useMediaQuery('(max-width: 48em)');

	return (
		<div className="relative flex min-h-screen font-sans">
			<AppShell
				padding={0}
				navbar={isLoggedIn ? <Sidebar opened={opened} setOpened={setOpened} /> : undefined}
				navbarOffsetBreakpoint="sm"
				header={
					<Header height={{ base: 50, sm: DEFAULT_HEADER_HEIGHT }} p="md">
						<div className="flex items-center h-full">
							<div
								className="flex space-x-2 justify-center"
								role="button"
								onClick={() => router.push(PATHS.HOME)}
							>
								<Image src="/static/images/logo.svg" width={50} height={45} alt="" />
								<Text size={28} weight="normal">
									deskflow
								</Text>
							</div>
							<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
								<Burger
									opened={opened}
									onClick={() => setOpened(o => !o)}
									size="sm"
									color="gray"
									mr="xl"
								/>
							</MediaQuery>
						</div>
					</Header>
				}
			>
				{children}
			</AppShell>
		</div>
	);
};

export default Layout;
