import React, { useCallback, useEffect, useState } from 'react';
import { useAuth, useClerk, useOrganizationList, useSignIn } from '@clerk/nextjs';
import Page from '../layout/Page';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { prisma } from '../server/prisma';
import { notifyError } from '../utils/functions';
import { PATHS } from '../utils/constants';
import { GetServerSideProps } from 'next';
import { IconX } from '@tabler/icons-react';
import { Button, Group, Image, PasswordInput, Stack, TextInput, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { getAuth, clerkClient, buildClerkProps } from '@clerk/nextjs/server';
import { trpc } from '../utils/trpc';

const Login = ({ users }) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { isLoaded: signInLoaded, signIn } = useSignIn();
	const { client, setActive } = useClerk();
	const { mutateAsync: fetchOrganization } = trpc.organisation.getOrganizationByUser.useMutation();
	const { isLoaded: orgListLoaded, organizationList } = useOrganizationList();

	useEffect(() => {
		console.log(client?.sessions);
	}, [client]);

	const form = useForm({
		initialValues: {
			email: undefined,
			password: undefined
		},
		validate: values => ({
			email: !values.email
				? 'Required'
				: !users.find(item => item.email === values.email)
				? 'No user found with that email address'
				: null,
			password: !values.password ? 'Required' : null
		})
	});

	const handleSignIn = useCallback(
		async values => {
			if (!signInLoaded || !signIn) {
				return;
			}
			try {
				setLoading(true);
				const result = await signIn.create({
					identifier: values.email,
					password: values.password
				});
				console.log('-----------------------------------------------');
				console.log(result);
				if (result.id && result.status === 'complete') {
					console.log('Login Success');
					const organization = await fetchOrganization({ email: values.email });
					if (organization) {
						await setActive({
							session: result.createdSessionId,
							organization: organization.organization.id
						});
						await router.push(PATHS.HOME);
					} else {
						await router.push({
							pathname: PATHS.CREATE_ORGANISATION,
							query: { session_id: result.createdSessionId }
						});
					}
				}
				// Something went wrong
				if (result.status === 'needs_identifier') {
					form.setFieldError('email', 'Email is incorrect');
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error('error', error.errors[0].longMessage);
				notifyError('login-failure', error.error?.message ?? error.message, <IconX size={20} />);
				console.log(error);
			}
		},
		[signInLoaded, router, signIn]
	);

	useEffect(() => {
		if (router.query?.error) {
			const message = String(router.query.error);
			notifyError('login-failed', message, <IconX size={20} />);
		}
	}, [router.query]);

	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<form
				data-cy="login-form"
				onSubmit={form.onSubmit(handleSignIn)}
				className="flex h-full w-full flex-col"
				onError={() => console.log(form.errors)}
			>
				<Group position="apart" px="xl">
					<header className="flex flex-row items-center space-x-2">
						<Image src="/static/images/logo.svg" width={40} height={40} />
						<span className="text-2xl font-medium">Deskflow</span>
					</header>
					<Group spacing="xl">
						<Text>{"Don't have an account?"}</Text>
						<Link href={PATHS.SIGNUP}>
							<span role="button" className="text-primary">
								Sign up
							</span>
						</Link>
					</Group>
				</Group>
				<Stack className="mx-auto my-auto w-1/3" spacing="lg">
					<header className="flex flex-col space-y-1">
						<Title order={2}>Welcome back</Title>
						<span>Sign in to your Deskflow account.</span>
					</header>
					<TextInput
						label="Email"
						{...form.getInputProps('email', { withError: true })}
						data-cy={'login-email'}
					/>
					<PasswordInput
						label="Password"
						{...form.getInputProps('password', { withError: true })}
						data-cy={'login-password'}
					/>
					<Link href={PATHS.FORGOT_PASSWORD}>
						<span className="text-primary text-sm">Forgot password?</span>
					</Link>
					<Group py="md">
						<Button type="submit" size="md" loading={loading} fullWidth>
							<Text weight="normal">Sign in</Text>
						</Button>
					</Group>
				</Stack>
			</form>
		</Page.Container>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { userId, session } = getAuth(ctx.req);
	const users = await prisma.user.findMany({
		select: {
			email: true
		}
	});
	const user = userId ? await clerkClient.users.getUser(userId) : undefined;
	if (user) {
		return {
			redirect: {
				destination: PATHS.HOME,
				permanent: false
			}
		};
	}
	return {
		props: {
			users,
			...buildClerkProps(ctx.req, { user })
		}
	};
};

export default Login;
