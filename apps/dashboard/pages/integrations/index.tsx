import React, { useCallback } from 'react';
import { SimpleGrid, Title } from '@mantine/core';
import Page from '../../layout/Page';
import IntegrationCard from '../../components/IntegrationCard';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

const Integrations = () => {
	const router = useRouter();
	const { mutate: updateState } = trpc.user.updateSlackState.useMutation();

	const integrate = useCallback(name => {
		const state = uuidv4();
		const SLACK_CLIENT_ID = String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID);
		const SLACK_SCOPES = String(process.env.NEXT_PUBLIC_SLACK_SCOPES);
		switch (name) {
			case 'slack':
				// eslint-disable-next-line no-case-declarations
				const redirect_origin = process.env.NEXT_PUBLIC_VERCEL_URL || 'd242-82-132-226-173.ngrok-free.app';
				updateState({
					state
				});
				void router.push(
					`https://slack.com/oauth/v2/authorize?scope=${SLACK_SCOPES}&client_id=${SLACK_CLIENT_ID}&redirect_uri=https://${redirect_origin}/integrations/slack&state=${state}`
				);
				break;
			default:
				return null;
		}
	}, []);

	return (
		<Page.Container extraClassNames="justify-around">
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
