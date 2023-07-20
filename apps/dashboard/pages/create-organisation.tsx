import React, { useCallback, useEffect, useState } from 'react';
import Page from '../layout/Page';
import { PATHS, STORAGE_KEYS } from '../utils/constants';
import { useForm } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { notifyError } from '../utils/functions';
import { useRouter } from 'next/router';
import { OnboardingAccountStep1, OnboardingBusinessInfo } from '../utils/types';
import { trpc } from '../utils/trpc';
import { useAuth, useOrganizationList } from '@clerk/nextjs';

const CreateOrganisation = () => {
	const router = useRouter();
	const { mutateAsync: createOrganisation } = trpc.organisation.createOrganization.useMutation();
	const { isLoaded: orgListLoaded, setActive } = useOrganizationList();
	const { orgId } = useAuth();
	const [loading, setLoading] = useState(false);
	const [account, setAccount] = useLocalStorage<Partial<OnboardingAccountStep1>>({
		key: STORAGE_KEYS.ACCOUNT,
		defaultValue: null
	});
	const [companyForm, setCompanyForm] = useLocalStorage<OnboardingBusinessInfo>({
		key: STORAGE_KEYS.COMPANY_FORM,
		defaultValue: {
			legal_name: '',
			display_name: '',
			business_crn: '',
			business_url: ''
		}
	});
	const form = useForm<OnboardingBusinessInfo>({
		initialValues: {
			...companyForm
		},
		validate: {
			business_crn: val =>
				val.length > 8 || val.length < 7 ? 'Company registration number must be 7-8 digits' : null
		}
	});

	useEffect(() => {
		console.log(orgId);
	}, [orgId]);

	const handleSubmit = useCallback(
		async (values: OnboardingBusinessInfo) => {
			setLoading(true);
			if (!orgListLoaded) {
				return;
			}
			try {
				/*const { is_valid, reason } = await validateCompanyInfo(values.business_crn, values.legal_name);
				if (!is_valid) throw new Error(reason);*/
				/*if (!file) throw new Error("Please upload a picture of your driver's license before submitting");
				await uploadFile(file, values.business_crn, 'DRIVING_LICENCE');
				const result = (
					await apiClient.post('/server/auth/onboarding', values, {
						params: {
							email: account?.email,
							step: 2
						}
					})
				).data;
				console.log('-----------------------------------------------');
				console.log(result);
				console.log('-----------------------------------------------');*/
				const org = await createOrganisation(values);
				await setActive({ organization: org.id });
				setAccount({ ...account, business: values });
				setLoading(false);
				await router.push(PATHS.INVITE_MEMBERS);
			} catch (err) {
				setLoading(false);
				console.error(err);
				notifyError('onboarding-step1-failure', err?.error?.message ?? err.message, <IconX size={20} />);
			}
		},
		[orgListLoaded, account, setAccount]
	);

	useEffect(() => {
		const storedValue = window.localStorage.getItem(STORAGE_KEYS.COMPANY_FORM);
		if (storedValue) {
			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				form.setValues(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.COMPANY_FORM)));
			} catch (e) {
				console.log('Failed to parse stored value');
				console.error(e);
			}
		}
	}, []);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEYS.COMPANY_FORM, JSON.stringify(form.values));
	}, [form.values]);

	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				className="flex h-full w-full flex-col items-center justify-center"
				data-cy="onboarding-company-form"
			>
				<h1 className="mb-4 text-2xl font-medium">Your company</h1>
				<Stack>
					<TextInput
						required
						label="Company legal name"
						{...form.getInputProps('legal_name')}
						data-cy="onboarding-legal-name"
					/>
					<TextInput
						required
						label="Doing business as"
						{...form.getInputProps('display_name')}
						data-cy="onboarding-display-name"
					/>
					<Group grow>
						<TextInput
							type="number"
							minLength={7}
							maxLength={8}
							required
							label="Company Reg No."
							{...form.getInputProps('business_crn')}
							data-cy="onboarding-business-crn"
						/>
					</Group>
					<TextInput
						required
						type="text"
						label="Business URL"
						description="If you do not have a website, please enter a short description of your business"
						{...form.getInputProps('business_url')}
						data-cy="onboarding-business-url"
					/>
					<Group position="right" mt="lg">
						<Button
							type="submit"
							variant="filled"
							size="md"
							style={{
								width: 200
							}}
							loading={loading}
						>
							Continue
						</Button>
					</Group>
				</Stack>
			</form>
		</Page.Container>
	);
};

export default CreateOrganisation;
