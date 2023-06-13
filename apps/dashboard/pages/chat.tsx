import { ActionIcon, Button, Group, Stack, Textarea, TextInput, useMantineTheme } from '@mantine/core';
import React, { useCallback, useContext, useState } from 'react';
import { useId, useViewportSize } from '@mantine/hooks';
import axios from 'axios';
import MessageList from '../components/MessageList';
import { nanoid } from 'nanoid';
import { MessageContext } from '../context/MessageContext';
import { IconSend } from '@tabler/icons-react';
import { OpenAIContext, OpenAIResponse } from '../context/OpenAIContext';
import { useForm } from '@mantine/form';
import Page from '../layout/Page';
import { useUser } from '@clerk/nextjs';

interface FormValues {
	query: string;
}

export function Chat() {
	const theme = useMantineTheme();
	const uuid = useId();
	const { messages, addMessage, clearChat } = useContext(MessageContext); // Retrieve messages from database
	const { history, setHistory } = useContext(OpenAIContext);
	const [loading, setLoading] = useState(false);
	const { width, height } = useViewportSize();
	const { user } = useUser();

	const form = useForm<FormValues>({
		initialValues: {
			query: ''
		}
	});

	const chat = useCallback(
		async (values: FormValues) => {
			setLoading(true);
			try {
				if (!user) throw new Error('User not logged in');
				form.setFieldValue('query', '');
				addMessage({
					id: nanoid(24),
					user_id: user.id,
					author: String(user.firstName),
					message: values.query
				});
				const response = await axios.post(
					`${
						process.env.NEXT_PUBLIC_NGROK_API_URL || process.env.NEXT_PUBLIC_API_HOST
					}/api/v1/generate-chat-response`,
					{
						query: values.query,
						name: String(user.firstName),
						email: user.emailAddresses[0].emailAddress || 'chipzstar.dev@googlemail.com',
						history: history
					}
				);
				const { reply, messages: openai_messages } = response.data as OpenAIResponse;
				addMessage({
					id: nanoid(24),
					user_id: 'alfred',
					author: 'Alfred',
					message: reply
				});
				setHistory(openai_messages);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				console.error(err);
				alert(err.message);
			}
		},
		[history, messages, user, uuid]
	);

	return (
		<Page.Container extraClassNames="justify-end items-center">
			<Stack w={width * 0.66}>
				<form onSubmit={form.onSubmit(chat)}>
					<MessageList thinking={loading} />
					<Textarea
						required
						autosize
						placeholder="Enter your message here."
						size="xl"
						minRows={1}
						onKeyDown={key => {
							if (key.key === 'Enter' && !key.shiftKey) {
								chat(form.values).then(() => form.setFieldValue('query', ''));
							}
						}}
						{...form.getInputProps('query')}
						rightSection={
							<ActionIcon
								type="submit"
								size={32}
								radius="xl"
								color="gray"
								variant="transparent"
								disabled={!form.values.query}
							>
								{theme.dir === 'ltr' ? (
									<IconSend size="1.4rem" stroke={1.5} />
								) : (
									<IconSend size="1.4rem" stroke={1.5} />
								)}
							</ActionIcon>
						}
					/>
				</form>
			</Stack>
		</Page.Container>
	);
}

export default Chat;
