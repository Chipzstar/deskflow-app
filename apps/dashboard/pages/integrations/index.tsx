import React, { useCallback, useState } from 'react';
import { LoadingOverlay, SimpleGrid, Title } from '@mantine/core';
import Page from '../../layout/Page';
import IntegrationCard from '../../components/IntegrationCard';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import axios from 'axios';
import { useId } from '@mantine/hooks';
import { notifyError, notifySuccess } from '../../utils/functions';
import { IconCheck, IconX } from '@tabler/icons-react';

const Integrations = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { mutateAsync: updateState } = trpc.user.updateSlackState.useMutation();
	const state = useId();

	const integrate = useCallback(
		name => {
			const SLACK_CLIENT_ID = String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID);
			const SLACK_SCOPES = String(process.env.NEXT_PUBLIC_SLACK_SCOPES);
			switch (name) {
				case 'zendesk-guide':
					setLoading(true);
					axios
						.post(`${process.env.NEXT_PUBLIC_API_HOST}/zendesk/knowledge-base`, {})
						.then(res => {
							console.table(res.data);
							setLoading(false);
							notifySuccess(
								'zendesk-guide-successful',
								'Zendesk knowledge base integrated successfully!',
								<IconCheck size={20} />
							);
						})
						.catch(err => {
							setLoading(false);
							console.error(err);
							notifyError(
								'zendesk-guide-failed',
								`Zendesk knowledge base integration failed! ${err.message}`,
								<IconX size={20} />
							);
						});
					break;
				case 'slack':
					setLoading(true);
					// eslint-disable-next-line no-case-declarations
					const redirect_origin = process.env.NEXT_PUBLIC_NGROK_URL || process.env.NEXT_PUBLIC_HOST_DOMAIN;
					updateState({
						state
					})
						.then(res => {
							setLoading(false);
							void router.push(
								`https://slack.com/oauth/v2/authorize?scope=${SLACK_SCOPES}&client_id=${SLACK_CLIENT_ID}&redirect_uri=${redirect_origin}/integrations/slack&state=${state}`
							);
						})
						.catch(err => {
							console.error(err);
							setLoading(false);
						});
					break;
				default:
					return null;
			}
		},
		[state]
	);

	return (
		<Page.Container extraClassNames="justify-around">
			<LoadingOverlay overlayBlur={2} visible={loading} />
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Knowledge Base
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard name="zendesk-guide" img="/static/images/zendesk-guide.svg" onSelect={integrate} />
					<IntegrationCard name="confluence" img="/static/images/confluence.svg" onSelect={integrate} />
					<IntegrationCard name="sharepoint" img="/static/images/sharepoint.svg" onSelect={integrate} />
					<IntegrationCard name="drive" img="/static/images/drive.svg" w={80} h={80} onSelect={integrate} />
					<IntegrationCard name="upload" text="Upload" onSelect={integrate} />
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
						onSelect={integrate}
					/>
					<IntegrationCard name="freshservice" img="/static/images/freshservice.svg" onSelect={integrate} />
					<IntegrationCard name="servicenow" img="/static/images/servicenow.svg" onSelect={integrate} />
					<IntegrationCard name="jira" img="/static/images/jira.svg" onSelect={integrate} />
					<IntegrationCard name="happyfox" img="/static/images/happyfox.svg" onSelect={integrate} />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Chat
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard name="slack" img="/static/images/slack.svg" onSelect={integrate} />
					<IntegrationCard name="gmail" img="/static/images/gmail.svg" w={70} h={70} onSelect={integrate} />
					<IntegrationCard name="teams" img="/static/images/teams.svg" w={170} onSelect={integrate} />
					<IntegrationCard name="zoom" img="/static/images/zoom.svg" onSelect={integrate} />
					<IntegrationCard name="yammer" img="/static/images/yammer.svg" onSelect={integrate} />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					HRIS
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard name="rippling" img="/static/images/rippling.svg" onSelect={integrate} />
					<IntegrationCard name="bamboohr" img="/static/images/bamboohr.svg" onSelect={integrate} />
					<IntegrationCard name="zelt" img="/static/images/zelt.svg" onSelect={integrate} />
					<IntegrationCard name="gusto" img="/static/images/gusto.svg" onSelect={integrate} />
					<IntegrationCard name="deel" img="/static/images/deel.svg" onSelect={integrate} />
				</SimpleGrid>
			</div>
		</Page.Container>
	);
};

export default Integrations;
