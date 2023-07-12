import React, { useMemo, useState } from 'react';
import { AppShell, Burger, Header, Image, MediaQuery, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { AUTH_ROUTES, DEFAULT_HEADER_HEIGHT, PATHS } from '../utils/constants';
import Sidebar from './Sidebar';
import { useClerk, UserButton } from '@clerk/nextjs';

const Layout = ({ children }) => {
	const router = useRouter();
	const isLoggedIn = useMemo(() => !AUTH_ROUTES.includes(router.pathname), [router.pathname]);
	const [opened, setOpened] = useState(false);

	return (
		<div className="relative flex min-h-screen font-sans">
			<AppShell
				padding={0}
				navbar={isLoggedIn ? <Sidebar opened={opened} setOpened={setOpened} /> : undefined}
				navbarOffsetBreakpoint="sm"
				header={
					isLoggedIn ? (
						<Header height={{ base: 50, sm: DEFAULT_HEADER_HEIGHT }} p="md">
							<div className="flex h-full items-center justify-between">
								<div
									className="flex grow space-x-2"
									role="button"
									onClick={() => router.push(PATHS.HOME)}
								>
									<Image src="/static/images/logo.svg" width={50} height={45} alt="" />
									<Text size={28} weight="normal">
										deskflow
									</Text>
								</div>
								<div className="flex justify-center space-x-2" role="button">
									<UserButton
										showName={true}
										appearance={{
											userProfile: {
												elements: {
													breadcrumbs: 'bg-slate-500'
												}
											}
										}}
									/>
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
					) : undefined
				}
			>
				{children}
			</AppShell>
		</div>
	);
};

export default Layout;
