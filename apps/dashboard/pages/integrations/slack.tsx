import React, { useCallback, useEffect } from 'react';
import Page from '../../layout/Page';
import { Button, Group, Image, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconDownload, IconExternalLink, IconX } from '@tabler/icons-react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import axios from 'axios';
import { notifyError, notifySuccess } from '../../utils/functions';
import AddToSlack from '../../components/AddToSlack';
import { v4 as uuidv4 } from 'uuid';
import querystring from 'querystring';
import IntegrationHeader from '../../layout/integrations/IntegrationHeader';
import { PATHS } from '../../utils/constants';

const Slack = () => {
	const { data: slack } = trpc.slack.getSlackInfo.useQuery();
	const { mutate: updateState } = trpc.organisation.updateSlackState.useMutation();
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
				.then(r => {
					console.log(r.data);
					notifySuccess(
						'slack-token-exchange-successful',
						'Slack Assistant Bot integrated successfully!',
						<IconCheck size={20} />
					);
				})
				.catch(e => {
					console.log(e);
					notifyError('failed-slack-token-exchange', e.message, <IconX size={20} />);
				});
		}
	}, [router.asPath]);

	const reinstallSlack = useCallback(() => {
		updateState({ state });
		void router.push(
			`https://slack.com/oauth/v2/authorize?${querystring.stringify({
				scope: String(process.env.NEXT_PUBLIC_SLACK_SCOPES),
				client_id: String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID),
				redirect_uri: `${
					process.env.NEXT_PUBLIC_NGROK_URL || process.env.NEXT_PUBLIC_HOST_DOMAIN
				}/integrations/slack`,
				state: state
			})}`
		);
	}, [state]);

	return (
		<Page.Container px={25} py="sm">
			<IntegrationHeader
				isActive={!!slack}
				goBack={() => {
					router.back();
					router.replace(PATHS.INTEGRATIONS);
				}}
			/>
			<Stack align="center" justify="space-around" className="h-full">
				<Title weight={500}>Slack Integration</Title>
				<Image src="/static/images/alfred.svg" height={100} width={100} alt="Alfred logo" />
				<Stack>
					{slack ? (
						<Group spacing="xl">
							<Button
								w={250}
								component="a"
								href={`https://${slack.team_name.toLowerCase()}.slack.com`}
								target="_blank"
								variant="outline"
								size="lg"
								leftIcon={<IconExternalLink size="1rem" />}
							>
								Open Slack App
							</Button>
							<Button
								w={250}
								onClick={() => reinstallSlack()}
								variant="outline"
								size="lg"
								color="orange"
								leftIcon={<IconDownload size="1.2rem" />}
							>
								Reinstall
							</Button>
						</Group>
					) : (
						<AddToSlack state={state} />
					)}
				</Stack>
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
			</Stack>
		</Page.Container>
	);
};

export default Slack;
