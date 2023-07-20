import React from 'react';
import { Box, Button, Modal, rem, Stack, TextInput, Text } from '@mantine/core';
import { getHotkeyHandler, useLocalStorage } from '@mantine/hooks';

const ZendeskDomainInput = ({ opened, onClose, integrate }) => {
	const [subdomain, setSubdomain] = useLocalStorage({ key: 'zendesk-subdomain', defaultValue: '' });
	return (
		<Modal opened={opened} onClose={onClose} centered p="sm" size="sm" title="Enter your Zendesk subdomain">
			<Stack spacing="xl">
				<TextInput
					withAsterisk
					value={subdomain}
					placeholder="example"
					size="md"
					onChange={e => setSubdomain(e.currentTarget.value)}
					onKeyDown={getHotkeyHandler([['Enter', integrate]])}
					rightSection={
						<Box
							sx={theme => ({
								height: '100%',
								width: rem(125),
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderStyle: 'solid',
								borderWidth: 1,
								borderColor: theme.colors.brand[5],
								borderRadius: rem(2),
								fontWeight: 500,
								borderBottomLeftRadius: 0,
								borderTopLeftRadius: 0,
								backgroundColor: theme.colors.brand[1]
							})}
						>
							<Text>.zendesk.com</Text>
						</Box>
					}
					rightSectionWidth={125}
				/>
				<Button
					disabled={!subdomain}
					onClick={() => {
						integrate('zendesk-guide');
					}}
				>
					Submit
				</Button>
			</Stack>
		</Modal>
	);
};

export default ZendeskDomainInput;
