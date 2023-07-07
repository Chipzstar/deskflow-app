import React, { useEffect } from 'react';
import { Button, Group, Image, Space, Stack, Text, Title } from '@mantine/core';
import Page from '../../layout/Page';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import axios from 'axios';
import { notifyError, notifySuccess } from '../../utils/functions';
import { IconCheck, IconExternalLink, IconX } from '@tabler/icons-react';
import { useLocalStorage } from '@mantine/hooks';
import IntegrationStatus from '../../components/IntegrationStatus';
import { useUser } from '@clerk/nextjs';

const ZendeskGuide = () => {
	const { user } = useUser();
	const util = trpc.useContext();
	const { data: zendesk } = trpc.zendesk.getZendeskInfo.useQuery();
	const { mutateAsync: zendeskExchangeToken } = trpc.zendesk.exchangeToken.useMutation({
		onSuccess: input => util.zendesk.getZendeskInfo.invalidate()
	});
	const router = useRouter();
	const [subdomain, setSubdomain] = useLocalStorage({ key: 'zendesk-subdomain', defaultValue: '' });

	useEffect(() => {
		const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
		const hasCode = searchParams.has('code');
		const hasState = searchParams.has('state');
		const hasError = searchParams.has('error_description');
		if (user && subdomain && hasCode && hasState) {
			zendeskExchangeToken({
				type: 'guide',
				subdomain,
				state: searchParams.get('state') ?? '',
				code: searchParams.get('code') ?? ''
			})
				.then(res => {
					axios
						.post(
							`${
								process.env.NEXT_PUBLIC_NGROK_API_URL || process.env.NEXT_PUBLIC_API_HOST
							}/zendesk/knowledge-base`,
							{ token: res.access_token, subdomain, email: user.emailAddresses[0].emailAddress }
						)
						.then(res => {
							console.table(res.data);
							notifySuccess(
								'zendesk-guide-successful',
								'Zendesk knowledge base integrated successfully!',
								<IconCheck size={20} />
							);
						})
						.catch(err => {
							console.error(err);
							notifyError(
								'zendesk-oauth-failed',
								`Zendesk failed to authenticate your company! ${err.message}`,
								<IconX size={20} />
							);
						});
				})
				.catch(err => {
					console.error(err);
					notifyError(
						'zendesk-guide-failed',
						`Zendesk knowledge base integration failed! ${err.message}`,
						<IconX size={20} />
					);
				});
		} else if (hasError) {
			notifyError(
				'zendesk-guide-failed',
				`Zendesk knowledge base integration failed! ${searchParams.get('error_description')}`,
				<IconX size={20} />
			);
		}
	}, [subdomain, user]);

	return (
		<Page.Container>
			<IntegrationStatus isActive={!!zendesk?.guide} />
			<Stack align="center" justify="space-around" className="h-full">
				<Title weight={500}>Zendesk Guide Integration</Title>
				<Image src="/static/images/zendesk-logo.svg" fit="contain" height={150} alt="Zendesk Logo" />
				<Space h="md" />
				<Stack align="center" spacing="xl">
					<Group w={500} grow align="center" position="apart">
						<Text weight={600} size="lg">
							Account ID:
						</Text>
						<Text weight={600} size="lg">
							{zendesk?.account_id}
						</Text>
					</Group>
					<Group w={500} grow align="center" position="apart">
						<Text weight={600} size="lg">
							Account Email:
						</Text>
						<Text weight={600} size="lg">
							{zendesk?.account_email}
						</Text>
					</Group>
					<Group w={500} grow align="center" position="apart">
						<Text weight={600} size="lg">
							Subdomain:
						</Text>
						<Text weight={600} size="lg">
							{zendesk?.subdomain}
						</Text>
					</Group>
				</Stack>
				<Button
					component="a"
					href={`https://${zendesk?.subdomain}.zendesk.com/hc/en-gb`}
					target="_blank"
					variant="outline"
					leftIcon={<IconExternalLink size="0.9rem" />}
				>
					Visit Knowledge Base
				</Button>
			</Stack>
		</Page.Container>
	);
};

export default ZendeskGuide;
