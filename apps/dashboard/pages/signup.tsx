import React, { useCallback, useEffect, useState } from 'react';
import Page from '../layout/Page';
import { GetServerSideProps } from 'next';
import { buildClerkProps, clerkClient, getAuth } from '@clerk/nextjs/server';
import { PATHS, requirements, STORAGE_KEYS } from '../utils/constants';
import { z } from 'zod';
import { prisma } from '../server/prisma';
import {
	Box,
	Button,
	Image,
	Group,
	PasswordInput,
	Popover,
	Progress,
	Stack,
	Text,
	TextInput,
	Title
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { getE164Number, getStrength, notifyError, notifySuccess } from '../utils/functions';
import { useRouter } from 'next/router';
import { useForm, zodResolver } from '@mantine/form';
import { useSignUp, useClerk } from '@clerk/nextjs';
import VerificationCode from '../components/VerificationCode';

interface SignupInfo {
	fullname: string | null;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	password: string;
}

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
	return (
		<Text color={meets ? 'teal' : 'red'} sx={{ display: 'flex', alignItems: 'center' }} mt={7} size="sm">
			{meets ? <IconCheck size={14} /> : <IconX size={14} />} <Box ml={10}>{label}</Box>
		</Text>
	);
}

const Signup = ({ emails }) => {
	const SignupSchema = z.object({
		email: z
			.string()
			.email({ message: 'Invalid email' })
			.max(50)
			.refine((value: string) => !emails.includes(value), 'Account with this email already exists'),
		password: z
			.string({ required_error: 'Required' })
			.min(6, 'Password must be at least 6 characters')
			.max(50, 'Password must have at most 50 characters')
			.refine(
				(val: string) => getStrength(val) >= 100,
				'Your password is too weak, use the suggestions increase password strength'
			),
		fullname: z.string().nullable(),
		firstname: z.string({ required_error: 'Required' }).max(25),
		lastname: z.string({ required_error: 'Required' }).max(25),
		phone: z.string({ required_error: 'Required' }).max(25)
	});
	const { isLoaded, signUp } = useSignUp();
	const { setActive } = useClerk();
	const [loading, setLoading] = useState(false);
	const [code_form, handlers] = useDisclosure(false);
	const [newAccount, setNewAccount] = useLocalStorage({ key: STORAGE_KEYS.ACCOUNT, defaultValue: null });
	const [popoverOpened, setPopoverOpened] = useState(false);

	const [userForm, setUserForm] = useLocalStorage<Partial<SignupInfo>>({
		key: STORAGE_KEYS.SIGNUP_FORM,
		defaultValue: {
			fullname: null,
			password: ''
		}
	});
	const router = useRouter();
	const form = useForm({
		initialValues: {
			...userForm
		},
		validate: zodResolver(SignupSchema)
	});
	const strength = getStrength(form.values.password ?? '');
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement
			key={index}
			label={requirement.label}
			meets={requirement.re.test(form.values?.password ?? '')}
		/>
	));

	const handleSubmit = useCallback(
		async values => {
			setLoading(true);
			values.fullname = values.firstname + ' ' + values.lastname;
			values.phone = getE164Number(values.phone);
			if (!isLoaded) {
				return;
			}
			try {
				if (signUp) {
					const result = await signUp.create({
						password: values.password,
						emailAddress: values.email,
						firstName: values.firstname,
						lastName: values.lastname
					});
					console.log(result);
					// send the email.
					await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
					// Open the verification code dialog.
					handlers.toggle();
					setLoading(false);
				}
			} catch (err) {
				setLoading(false);
				notifyError('signup-failure', err?.error?.message ?? err.message, <IconX size={20} />);
			}
		},
		[router, setNewAccount, signUp]
	);

	const confirmSignUp = useCallback(
		async (code: string) => {
			setLoading(true);
			try {
				if (signUp) {
					const result = await signUp.attemptEmailAddressVerification({
						code
					});
					await setActive({ session: result.createdSessionId });
					// const user = await register.mutateAsync(values);
					handlers.close();
					setLoading(false);
					notifySuccess('verification-success', 'Verification successful!', <IconCheck size={20} />);
					router.push(PATHS.CREATE_ORGANISATION);
				}
			} catch (error) {
				setLoading(false);
				console.log('Signup Failed');
				notifyError('signup-failure', 'Signup failed. Please try again', <IconX size={20} />);
			}
		},
		[router, signUp]
	);

	useEffect(() => {
		const storedValue = window.localStorage.getItem(STORAGE_KEYS.SIGNUP_FORM);
		if (storedValue) {
			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const parsedData = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.SIGNUP_FORM));
				form.setValues(parsedData);
			} catch (e) {
				console.log('Failed to parse stored value');
				console.error(e);
			}
		}
	}, []);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEYS.SIGNUP_FORM, JSON.stringify({ ...form.values, password: '' }));
	}, [form.values]);

	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<VerificationCode opened={code_form} onClose={handlers.close} onSubmit={confirmSignUp} loading={loading} />
			<form
				data-cy="signup-form"
				onSubmit={form.onSubmit(handleSubmit)}
				className="flex h-full w-full flex-col"
				onError={() => console.log(form.errors)}
			>
				<Group position="apart" px="xl">
					<header className="flex flex-row items-center space-x-2">
						<Image src="/static/images/logo.svg" width={40} height={40} />
						<span className="text-2xl font-medium">Deskflow</span>
					</header>
					<Group spacing="xl">
						<Text>Have an account?</Text>
						<Button px="xl" variant="outline" color="dark" onClick={() => router.push(PATHS.LOGIN)}>
							Sign in
						</Button>
					</Group>
				</Group>
				<Stack className="mx-auto my-auto w-1/3">
					<header className="flex flex-col space-y-1">
						<Title order={2}>Get started</Title>
						<Text size="sm" w={400}>
							Welcome to Deskflow — start giving your employees the best experience.
						</Text>
					</header>
					<Group grow spacing={40}>
						<TextInput
							data-cy={'signup-firstname'}
							withAsterisk
							label="Legal first name"
							{...form.getInputProps('firstname', { withError: true })}
						/>
						<TextInput
							data-cy={'signup-lastname'}
							withAsterisk
							label="Legal last name"
							{...form.getInputProps('lastname', { withError: true })}
						/>
					</Group>
					<TextInput
						data-cy={'signup-email'}
						withAsterisk
						label="Business email"
						{...form.getInputProps('email', { withError: true })}
					/>
					<TextInput
						data-cy={'signup-phone'}
						withAsterisk
						label="Business phone number"
						{...form.getInputProps('phone', { withError: true })}
					/>
					<Popover opened={popoverOpened} position="bottom" width="target">
						<Popover.Target>
							<div
								onFocusCapture={() => setPopoverOpened(true)}
								onBlurCapture={() => setPopoverOpened(false)}
							>
								<PasswordInput
									data-cy={'signup-password'}
									withAsterisk
									label="Password"
									description="Strong passwords should include letters in lower and uppercase, at least 1 number, and at least 1 special symbol"
									{...form.getInputProps('password', { withError: true })}
								/>
							</div>
						</Popover.Target>
						<Popover.Dropdown>
							<Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
							<PasswordRequirement
								label="Includes at least 6 characters"
								meets={form.values?.password?.length > 5}
							/>
							{checks}
						</Popover.Dropdown>
					</Popover>
					<Group mt="md" position="right">
						<Button
							type="submit"
							variant="filled"
							size="md"
							style={{
								width: 200
							}}
							loading={loading}
						>
							<Text weight={500}>Sign up</Text>
						</Button>
					</Group>
				</Stack>
			</form>
		</Page.Container>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { userId } = getAuth(ctx.req);
	const user = userId ? await clerkClient.users.getUser(userId) : undefined;
	console.table({ userId, user: !!user });
	if (user) {
		const organization_list = userId
			? await clerkClient.users.getOrganizationMembershipList({ userId })
			: undefined;
		if (organization_list?.length) {
			return {
				redirect: {
					destination: `${PATHS.HOME}?redirect_url= ${ctx.resolvedUrl}`,
					permanent: false
				}
			};
		} else {
			return {
				redirect: {
					destination: `${PATHS.CREATE_ORGANISATION}?redirect_url= ${ctx.resolvedUrl}`,
					permanent: false
				}
			};
		}
	}
	const emails = await prisma.user.findMany({
		select: {
			email: true
		}
	});
	return {
		props: {
			emails: emails.map(({ email }) => email),
			...buildClerkProps(ctx.req, { user })
		}
	};
};

export default Signup;
