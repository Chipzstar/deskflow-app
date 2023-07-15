import React, { useCallback, useEffect, useState } from 'react';
import { LoadingOverlay, Modal, SimpleGrid, TextInput, Title, Text, rem, Box, Button, Stack } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import Page from '../../layout/Page';
import IntegrationCard from '../../components/IntegrationCard';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import * as querystring from 'querystring';
import { IconX } from '@tabler/icons-react';
import { notifyError } from '../../utils/functions';
import { getHotkeyHandler, useLocalStorage } from '@mantine/hooks';

const Integrations = () => {
	const router = useRouter();
	const { data: org } = trpc.organisation.getOrganization.useQuery();
	const [loading, setLoading] = useState(false);
	const { mutateAsync: updateSlackState } = trpc.organisation.updateSlackState.useMutation();
	const { mutateAsync: updateZendeskState } = trpc.organisation.updateZendeskState.useMutation();
	const [opened, setOpened] = useState(false);
	const [subdomain, setSubdomain] = useLocalStorage({ key: 'zendesk-subdomain', defaultValue: '' });
	const state = uuidv4();

	const integrate = useCallback(
		name => {
			const redirect_origin = process.env.NEXT_PUBLIC_NGROK_URL || process.env.NEXT_PUBLIC_HOST_DOMAIN;
			const SLACK_CLIENT_ID = String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID);
			const SLACK_SCOPES = String(process.env.NEXT_PUBLIC_SLACK_SCOPES);
			const ZENDESK_CLIENT_ID = String(process.env.NEXT_PUBLIC_ZENDESK_CLIENT_ID);
			const ZENDESK_SCOPES = String(process.env.NEXT_PUBLIC_ZENDESK_SCOPES);
			switch (name) {
				case 'zendesk-guide':
					setLoading(true);
					updateZendeskState({
						state
					})
						.then(() => {
							void router.push(
								`https://${subdomain}.zendesk.com/oauth/authorizations/new?${querystring.stringify({
									response_type: 'code',
									redirect_uri: `${redirect_origin}/integrations/zendesk-guide`,
									client_id: ZENDESK_CLIENT_ID,
									scope: ZENDESK_SCOPES,
									state
								})}`
							);
						})
						.catch(err => {
							console.error(err);
							setLoading(false);
							notifyError('zendesk-authorization-failed', err.message, <IconX size={20} />);
						});
					break;
				case 'slack':
					setLoading(true);
					updateSlackState({
						state
					})
						.then(res => {
							setLoading(false);
							void router.push(
								`https://slack.com/oauth/v2/authorize?${querystring.stringify({
									scope: SLACK_SCOPES,
									client_id: SLACK_CLIENT_ID,
									redirect_uri: `${redirect_origin}/integrations/slack`,
									state: state
								})}`
							);
						})
						.catch(err => {
							console.error(err);
							setLoading(false);
						});
					break;
				case 'zendesk-support':
					setLoading(true);
					updateZendeskState({
						state
					})
						.then(() => {
							void router.push(
								`https://${subdomain}.zendesk.com/oauth/authorizations/new?${querystring.stringify({
									response_type: 'code',
									redirect_uri: `${redirect_origin}/integrations/zendesk-support`,
									client_id: ZENDESK_CLIENT_ID,
									scope: ZENDESK_SCOPES,
									state
								})}`
							);
						})
						.catch(err => {
							console.error(err);
							setLoading(false);
							notifyError('zendesk-authorization-failed', err.message, <IconX size={20} />);
						});
					break;
				default:
					return null;
			}
		},
		[state, subdomain]
	);

	return (
		<Page.Container extraClassNames="justify-around">
			<LoadingOverlay overlayBlur={2} visible={loading} />
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				centered
				p="sm"
				size="sm"
				title="Enter your Zendesk subdomain"
			>
				<Stack spacing="xl">
					<TextInput
						withAsterisk
						value={subdomain}
						placeholder="example"
						size="md"
						onChange={e => setSubdomain(e.currentTarget.value)}
						onKeyDown={getHotkeyHandler([['Enter', () => integrate('zendesk-guide')]])}
						rightSection={
							<Box
								sx={theme => ({
									height: '100%',
									width: rem(125),
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									borderStyle: 'solid',
									borderWidth: 1,
									borderColor: theme.colors.brand[5],
									borderRadius: rem(2),
									fontWeight: 500,
									borderBottomLeftRadius: 0,
									borderTopLeftRadius: 0,
									backgroundColor: theme.colors.brand[1]
								})}
							>
								<Text>.zendesk.com</Text>
							</Box>
						}
						rightSectionWidth={125}
					/>
					<Button
						disabled={!subdomain}
						onClick={() => {
							integrate('zendesk-guide');
						}}
					>
						Submit
					</Button>
				</Stack>
			</Modal>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Knowledge Base
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard
						name="zendesk-guide"
						img="/static/images/zendesk-guide.svg"
						onModal={() => setOpened(true)}
						onIntegrate={integrate}
						isIntegrated={Boolean(org?.zendesk)}
					/>
					<IntegrationCard name="confluence" img="/static/images/confluence.svg" onIntegrate={integrate} />
					<IntegrationCard name="sharepoint" img="/static/images/sharepoint.svg" onIntegrate={integrate} />
					<IntegrationCard
						name="drive"
						img="/static/images/drive.svg"
						w={80}
						h={80}
						onIntegrate={integrate}
					/>
					<IntegrationCard name="upload" text="Upload" onIntegrate={integrate} />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Help Desk
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard
						name="zendesk-support"
						img="/static/images/zendesk-support.svg"
						w={150}
						onModal={() => setOpened(true)}
						onIntegrate={integrate}
						isIntegrated={Boolean(org?.zendesk)}
					/>
					<IntegrationCard
						name="freshservice"
						img="/static/images/freshservice.svg"
						onIntegrate={integrate}
					/>
					<IntegrationCard name="servicenow" img="/static/images/servicenow.svg" onIntegrate={integrate} />
					<IntegrationCard name="jira" img="/static/images/jira.svg" onIntegrate={integrate} />
					<IntegrationCard name="happyfox" img="/static/images/happyfox.svg" onIntegrate={integrate} />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Chat
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard
						name="slack"
						img="/static/images/slack.svg"
						onIntegrate={integrate}
						isIntegrated={Boolean(org?.slack)}
					/>
					<IntegrationCard
						name="gmail"
						img="/static/images/gmail.svg"
						w={70}
						h={70}
						onIntegrate={integrate}
					/>
					<IntegrationCard name="teams" img="/static/images/teams.svg" w={170} onIntegrate={integrate} />
					<IntegrationCard name="zoom" img="/static/images/zoom.svg" onIntegrate={integrate} />
					<IntegrationCard name="yammer" img="/static/images/yammer.svg" onIntegrate={integrate} />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					HRIS
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard name="rippling" img="/static/images/rippling.svg" onIntegrate={integrate} />
					<IntegrationCard name="bamboohr" img="/static/images/bamboohr.svg" onIntegrate={integrate} />
					<IntegrationCard name="zelt" img="/static/images/zelt.svg" onIntegrate={integrate} />
					<IntegrationCard name="gusto" img="/static/images/gusto.svg" onIntegrate={integrate} />
					<IntegrationCard name="deel" img="/static/images/deel.svg" onIntegrate={integrate} />
				</SimpleGrid>
			</div>
		</Page.Container>
	);
};

export default Integrations;
