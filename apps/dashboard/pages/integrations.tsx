import React from 'react';
import { Group, SimpleGrid, Title } from '@mantine/core';
import Page from '../layout/Page';
import IntegrationCard from '../components/IntegrationCard';

const Integrations = () => {
	return (
		<Page.Container extraClassNames="justify-around">
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Knowledge Base
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard img="/static/images/zendesk-guide.svg" />
					<IntegrationCard img="/static/images/confluence.svg" />
					<IntegrationCard img="/static/images/sharepoint.svg" />
					<IntegrationCard img="/static/images/drive.svg" w={80} h={80} />
					<IntegrationCard img={null} text="Upload" />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Help Desk
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard img="/static/images/zendesk-support.svg" w={150} />
					<IntegrationCard img="/static/images/freshservice.svg" />
					<IntegrationCard img="/static/images/servicenow.svg" />
					<IntegrationCard img="/static/images/jira.svg" />
					<IntegrationCard img="/static/images/happyfox.svg" />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Chat
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard img="/static/images/slack.svg" />
					<IntegrationCard img="/static/images/gmail.svg" w={70} h={70} />
					<IntegrationCard img="/static/images/teams.svg" w={170} />
					<IntegrationCard img="/static/images/zoom.svg" />
					<IntegrationCard img="/static/images/yammer.svg" />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					HRIS
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard img="/static/images/rippling.svg" />
					<IntegrationCard img="/static/images/bamboohr.svg" />
					<IntegrationCard img="/static/images/zelt.svg" />
					<IntegrationCard img="/static/images/gusto.svg" />
					<IntegrationCard img="/static/images/deel.svg" />
				</SimpleGrid>
			</div>
		</Page.Container>
	);
};

export default Integrations;
