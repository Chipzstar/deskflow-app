import React, { useEffect } from 'react';
import axios from 'axios';
import { notifyError, notifySuccess } from '../../utils/functions';
import { IconCheck, IconExternalLink, IconX } from '@tabler/icons-react';
import Page from '../../layout/Page';
import { Button, Group, Image, Space, Stack, Text, Title } from '@mantine/core';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import { useLocalStorage } from '@mantine/hooks';
import IntegrationHeader from '../../layout/integrations/IntegrationHeader';
import { PATHS } from '../../utils/constants';

const ZendeskSupport = () => {
	const { data: zendesk } = trpc.zendesk.getZendeskInfo.useQuery();
	const { mutateAsync: zendeskExchangeToken } = trpc.zendesk.exchangeToken.useMutation();
	const router = useRouter();
	const [subdomain, setSubdomain] = useLocalStorage({ key: 'zendesk-subdomain', defaultValue: '' });

	useEffect(() => {
		const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
		const hasCode = searchParams.has('code');
		const hasState = searchParams.has('state');
		const hasError = searchParams.has('error_description');
		if (subdomain && hasCode && hasState) {
			zendeskExchangeToken({
				type: 'support',
				subdomain,
				state: searchParams.get('state') ?? '',
				code: searchParams.get('code') ?? ''
			})
				.then(res => {
					axios
						.post(
							`${
								process.env.NEXT_PUBLIC_NGROK_API_URL || process.env.NEXT_PUBLIC_API_HOST
							}/zendesk/help-desk`,
							{ token: res.access_token, subdomain }
						)
						.then(res => {
							notifySuccess(
								'zendesk-support-successful',
								'Zendesk Help desk integrated successfully!',
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
						'zendesk-support-failed',
						`Zendesk help desk integration failed! ${err.message}`,
						<IconX size={20} />
					);
				});
		} else if (hasError) {
			notifyError(
				'zendesk-support-failed',
				`Zendesk help desk integration failed! ${searchParams.get('error_description')}`,
				<IconX size={20} />
			);
		}
	}, [router.asPath, subdomain]);

	return (
		<Page.Container>
			<IntegrationHeader
				isActive={!!zendesk?.support}
				goBack={() => {
					// router.back();
					router.replace(PATHS.INTEGRATIONS);
				}}
			/>
			<Stack align="center" justify="space-around" className="h-full">
				<Title weight={500}>Zendesk Support Integration</Title>
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
					href={`https://${zendesk?.subdomain}.zendesk.com/agent/en-gb`}
					target="_blank"
					variant="outline"
					leftIcon={<IconExternalLink size="0.9rem" />}
				>
					Visit Help Desk
				</Button>
			</Stack>
		</Page.Container>
	);
};

export default ZendeskSupport;
