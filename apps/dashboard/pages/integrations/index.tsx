import React, { useCallback, useState } from 'react';
import { LoadingOverlay, SimpleGrid, Title } from '@mantine/core';
import Page from '../../layout/Page';
import IntegrationCard from '../../components/IntegrationCard';
import { trpc } from '../../utils/trpc';
import { useLocalStorage } from '@mantine/hooks';
import ZendeskDomainInput from '../../modals/ZendeskDomainInput';
import useIntegrate from '../../hooks/useIntegrate';

const Integrations = () => {
	const { data: org } = trpc.organisation.getOrganization.useQuery();
	const [loading, setLoading] = useState(false);
	const [opened, setOpened] = useState(false);
	const [subdomain, setSubdomain] = useLocalStorage({ key: 'zendesk-subdomain', defaultValue: '' });
	const [integrate] = useIntegrate(loading, setLoading);

	const handleIntegrate = useCallback(name => integrate(name), [subdomain]);

	return (
		<Page.Container extraClassNames="justify-around">
			<LoadingOverlay overlayBlur={2} visible={loading} />
			<ZendeskDomainInput
				opened={opened}
				onClose={() => setOpened(false)}
				integrate={() => handleIntegrate('zendesk-guide')}
			/>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					Knowledge Base
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard
						name="zendesk-guide"
						img="/static/images/zendesk-guide.svg"
						onModal={() => setOpened(true)}
						onIntegrate={handleIntegrate}
						isIntegrated={Boolean(org?.zendesk)}
					/>
					<IntegrationCard
						name="confluence"
						img="/static/images/confluence.svg"
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard
						name="sharepoint"
						img="/static/images/sharepoint.svg"
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard
						name="drive"
						img="/static/images/drive.svg"
						w={80}
						h={80}
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard name="upload" text="Upload" onIntegrate={handleIntegrate} />
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
						onIntegrate={handleIntegrate}
						isIntegrated={Boolean(org?.zendesk)}
					/>
					<IntegrationCard
						name="freshservice"
						img="/static/images/freshservice.svg"
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard
						name="servicenow"
						img="/static/images/servicenow.svg"
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard name="jira" img="/static/images/jira.svg" onIntegrate={handleIntegrate} />
					<IntegrationCard name="happyfox" img="/static/images/happyfox.svg" onIntegrate={handleIntegrate} />
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
						onIntegrate={handleIntegrate}
						isIntegrated={Boolean(org?.slack)}
					/>
					<IntegrationCard
						name="gmail"
						img="/static/images/gmail.svg"
						w={70}
						h={70}
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard
						name="teams"
						img="/static/images/teams.svg"
						w={170}
						onIntegrate={handleIntegrate}
					/>
					<IntegrationCard name="zoom" img="/static/images/zoom.svg" onIntegrate={handleIntegrate} />
					<IntegrationCard name="yammer" img="/static/images/yammer.svg" onIntegrate={handleIntegrate} />
				</SimpleGrid>
			</div>
			<div className="flex flex-col space-y-4">
				<Title weight="500" size={20}>
					HRIS
				</Title>
				<SimpleGrid cols={5}>
					<IntegrationCard name="rippling" img="/static/images/rippling.svg" onIntegrate={handleIntegrate} />
					<IntegrationCard name="bamboohr" img="/static/images/bamboohr.svg" onIntegrate={handleIntegrate} />
					<IntegrationCard name="zelt" img="/static/images/zelt.svg" onIntegrate={handleIntegrate} />
					<IntegrationCard name="gusto" img="/static/images/gusto.svg" onIntegrate={handleIntegrate} />
					<IntegrationCard name="deel" img="/static/images/deel.svg" onIntegrate={handleIntegrate} />
				</SimpleGrid>
			</div>
		</Page.Container>
	);
};

export default Integrations;
