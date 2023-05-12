import { ActionIcon, Button, Container, Group, Stack, Textarea, TextInput, useMantineTheme } from '@mantine/core';
import React, { useCallback, useContext, useState } from 'react';
import { useId, useViewportSize } from '@mantine/hooks';
import axios from 'axios';
import MessageList from '../components/MessageList';
import { AuthContext } from '../context/AuthContext';
import { nanoid } from 'nanoid';
import { MessageContext } from '../context/MessageContext';
import { IconSend } from '@tabler/icons-react';
import { OpenAIContext, OpenAIResponse } from '../context/OpenAIContext';
import { useForm } from '@mantine/form';

interface FormValues {
	name: string;
	query: string;
}

export function Index() {
	const theme = useMantineTheme();
	const uuid = useId();
	const { user, setUser } = useContext(AuthContext);
	const { messages, addMessage, clearChat } = useContext(MessageContext); // Retrieve messages from database
	const { history, setHistory } = useContext(OpenAIContext);
	const [loading, setLoading] = useState(false);
	const { width, height } = useViewportSize();
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */

	const form = useForm<FormValues>({
		initialValues: {
			name: '',
			query: ''
		}
	});

	const chat = useCallback(
		async (values: FormValues) => {
			setLoading(true);
			try {
				if (!user?.id) {
					setUser({
						id: uuid,
						name: values.name,
						authToken: uuid
					});
				}
				form.setFieldValue('query', '');
				addMessage({
					id: nanoid(24),
					user_id: uuid,
					author: values.name,
					message: values.query
				});
				const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/generate-chat-response`, {
					query: values.query,
					history: history
				});
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
		<Container fluid w={width} mih={height} className="flex justify-center items-end" p="lg">
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
					<Group align="end" position="apart">
						<TextInput
							w={300}
							label="Name"
							placeholder="Enter your name"
							{...form.getInputProps('name')}
							required
						/>
						<Button
							color="red"
							w={300}
							onClick={() => {
								setHistory([]);
								clearChat();
							}}
						>
							Restart Chat
						</Button>
					</Group>
				</form>
			</Stack>
		</Container>
	);
}

export default Index;
