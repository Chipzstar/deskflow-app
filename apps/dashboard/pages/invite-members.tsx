import React, { useCallback, useEffect } from 'react';
import Page from '../layout/Page';
import { Button, Divider, Group, List, Select, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useRouter } from 'next/router';
import { PATHS } from '../utils/constants';
import { isEmail, useForm } from '@mantine/form';
import { notifyError, notifySuccess } from '../utils/functions';
import { IconCheck, IconChevronDown, IconCircleCheck, IconSend, IconUsersPlus, IconX } from '@tabler/icons-react';
import { OrganizationMembershipRole } from '@clerk/backend/dist/types/api/resources/Enums';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { useDisclosure } from '@mantine/hooks';
import { trpc } from '../utils/trpc';

interface FormValues {
	email: string;
	role: OrganizationMembershipRole | 'manager';
	invited_members: string[];
}

const InviteMembers = () => {
	const router = useRouter();
	const { invitationList } = useOrganization({ invitationList: {} });
	const [loading, onLoad] = useDisclosure(false);
	const { mutateAsync: sendOrgInvitation } = trpc.organisation.sendOrgInvitation.useMutation();
	const { orgId, userId } = useAuth();

	const form = useForm<FormValues>({
		initialValues: {
			email: '',
			role: 'admin',
			invited_members: []
		},
		validate: {
			email: isEmail('Please enter a valid email')
		}
	});

	const handleSubmit = useCallback(
		async (values: FormValues) => {
			console.log(JSON.stringify(values, null, 2));
			try {
				onLoad.open();
				if (userId && orgId) {
					// send invitation email to the email address
					const role: OrganizationMembershipRole = values.role === 'manager' ? 'basic_member' : values.role;
					const result = await sendOrgInvitation({
						orgId,
						email: values.email,
						role
					});
					console.log(result);
					onLoad.close();
					form.insertListItem('invited_members', values.email);
					notifySuccess('org-invitation-success', 'Invitation sent successfully', <IconCheck size={20} />);
				}
			} catch (err) {
				onLoad.close();
				console.error(err);
				notifyError('org-invitation-failed', err.message, <IconX size={20} />);
			}
		},
		[userId, orgId]
	);

	useEffect(() => {
		console.log(invitationList);
	}, [invitationList]);

	return (
		<Page.Container extraClassNames="flex flex-col justify-center items-center">
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				className="flex h-full w-2/5 flex-col justify-center"
				data-cy="onboarding-company-form"
			>
				<h1 className="mb-4 text-2xl font-medium">Invite Members</h1>
				<Text color="dimmed" size="sm">
					View and manage organization members
				</Text>
				<Stack my="xl">
					<TextInput
						label="Email addresses"
						description="Enter or paste one or more email addresses, separated by spaces or commas"
						{...form.getInputProps('email')}
						mb="lg"
						styles={{
							icon: {
								color: '#2742F5'
							}
						}}
						icon={<IconSend size="0.9rem" />}
						size="md"
						data-cy="onboarding-company-member-email"
					/>
					<Select
						w={200}
						mb="lg"
						size="md"
						label="Role"
						data={[
							{ value: 'admin', label: 'Admin' },
							{ value: 'manager', label: 'Manager' },
							{ value: 'basic_member', label: 'Member' }
						]}
						rightSection={<IconChevronDown size="1rem" />}
						rightSectionWidth={30}
						styles={{ rightSection: { pointerEvents: 'none' } }}
					/>

					<div className="flex justify-end">
						<Button
							loading={loading}
							disabled={!form.values.email}
							size="md"
							type="submit"
							color="green.6"
							variant="outline"
							leftIcon={<IconUsersPlus size={18} />}
						>
							Invite
						</Button>
					</div>
					<Text size="lg" weight="500">
						Invited
					</Text>
					<Divider />
					<List
						spacing="md"
						size="sm"
						center
						icon={
							<ThemeIcon color="teal" size={24} radius="xl">
								<IconCircleCheck size="1rem" />
							</ThemeIcon>
						}
					>
						{form.values.invited_members.map((member, index) => {
							return (
								<List.Item key={index} className="grow">
									<Text size="sm">{member}</Text>
								</List.Item>
							);
						})}
					</List>
					<Group grow position="right" mt="xl">
						<Button type="button" size="lg" onClick={() => router.push(PATHS.HOME)}>
							<Text>{form.values.invited_members.length ? 'Finished' : 'Skip'}</Text>
						</Button>
					</Group>
				</Stack>
			</form>
		</Page.Container>
	);
};

export default InviteMembers;
