import React, { useEffect } from 'react';
import Page from '../../layout/Page';
import { Button, Chip, Stack, Title, Image, Space, Group, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';

const Slack = () => {
	const { data: slack } = trpc.slack.getSlackInfo.useQuery();
	const { mutate: exchange } = trpc.slack.exchangeToken.useMutation();
	const router = useRouter();

	useEffect(() => {
		const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
		const hasCode = searchParams.has('code');
		const hasState = searchParams.has('state');

		if (hasCode && hasState) {
			exchange({
				code: String(searchParams.get('code')),
				state: String(searchParams.get('state'))
			});
		}
	}, [router.asPath]);

	return (
		<Page.Container>
			<Chip
				w={100}
				size="md"
				defaultChecked
				color="green"
				sx={theme => ({
					position: 'absolute',
					right: 20
				})}
			>
				Active
			</Chip>
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
					<Image src="/static/images/alfred.svg" height={100} width={100} />
					<Button component="a" href="" variant="outline" leftIcon={<IconExternalLink size="0.9rem" />}>
						Open in Slack App
					</Button>
				</Stack>
			</Stack>
		</Page.Container>
	);
};

export default Slack;
