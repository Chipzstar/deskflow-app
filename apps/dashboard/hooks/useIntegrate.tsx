import React, { useState } from 'react';
import querystring from 'querystring';
import { notifyError } from '../utils/functions';
import { IconX } from '@tabler/icons-react';
import { trpc } from '../utils/trpc';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { useLocalStorage } from '@mantine/hooks';
import { IntegrationName } from '../utils/types';

const useIntegrate = (loading = false, setLoading: (val: boolean) => void): [(name: IntegrationName) => void] => {
	const router = useRouter();
	const { mutateAsync: updateSlackState } = trpc.organisation.updateSlackState.useMutation();
	const { mutateAsync: updateZendeskState } = trpc.organisation.updateZendeskState.useMutation();
	const [subdomain, setSubdomain] = useLocalStorage({ key: 'zendesk-subdomain', defaultValue: '' });
	const state = uuidv4();

	function integrate(name) {
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
	}

	return [integrate];
};

export default useIntegrate;
