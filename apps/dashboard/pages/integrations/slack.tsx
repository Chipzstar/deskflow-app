import React, { useEffect } from 'react';
import Page from '../../layout/Page';
import { Button, Chip, Group, Image, Space, Stack, Text, Title } from '@mantine/core';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import axios from 'axios';
import { notifyError } from '../../utils/functions';
import AddToSlack from '../../components/AddToSlack';
import IntegrationStatus from '../../components/IntegrationStatus';
import { v4 as uuidv4 } from 'uuid';

const Slack = () => {
	const { data: slack } = trpc.slack.getSlackInfo.useQuery();
	const router = useRouter();
	const state = uuidv4();

	useEffect(() => {
		const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
		const hasCode = searchParams.has('code');
		const hasState = searchParams.has('state');
		if (hasCode && hasState) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_NGROK_API_URL || process.env.NEXT_PUBLIC_API_HOST}/slack/oauth/callback`,
					{
						code: searchParams.get('code'),
						state: searchParams.get('state')
					}
				)
				.then(r => console.log(r))
				.catch(e => {
					console.log(e);
					notifyError('failed-slack-token-exchange', e.message, <IconX size={20} />);
				});
		}
	}, [router.asPath]);

	return (
		<Page.Container>
			<IntegrationStatus isActive={!!slack} />
			<Stack align="center" justify="space-around" className="h-full">
				<Title weight={500}>Slack Integration</Title>
				<Space h="md" />
				<Stack align="center" spacing="xl">
					<Group w={500} grow align="center" position="apart">
						<Text weight={600} size="lg">
							Workspace Name:
						</Text>
						<Text weight={600} size="lg">
							{slack?.team_name}
						</Text>
					</Group>
					<Group w={500} grow align="center" position="apart">
						<Text weight={600} size="lg">
							Slack Bot ID:
						</Text>
						<Text weight={600} size="lg">
							{slack?.bot_id}
						</Text>
					</Group>
					<Group w={500} grow align="center" position="apart">
						<Text weight={600} size="lg">
							Team ID:
						</Text>
						<Text weight={600} size="lg">
							{slack?.team_id}
						</Text>
					</Group>
				</Stack>
				<Stack align="center">
					<Image src="/static/images/alfred.svg" height={100} width={100} alt="Alfred logo" />
					{slack ? (
						<Button
							component="a"
							href={`https://${slack.team_name.toLowerCase()}.slack.com`}
							target="_blank"
							variant="outline"
							size="lg"
							leftIcon={<IconExternalLink size="1rem" />}
						>
							Open Slack App
						</Button>
					) : (
						<AddToSlack state={state} />
					)}
				</Stack>
			</Stack>
		</Page.Container>
	);
};

export default Slack;
