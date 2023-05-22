import React, { createContext } from 'react';
import { useListState } from '@mantine/hooks';
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';

interface Message {
	id: string;
	user_id: string;
	author: string;
	message: string;
}

interface MessageContext {
	messages: Message[];
	addMessage: (message: Message) => void;
	clearChat: () => void;
}

const SAMPLE_MESSAGES: Message[] = [
	{
		id: nanoid(20),
		user_id: nanoid(20),
		author: faker.name.firstName(),
		message: faker.lorem.paragraph(3)
	},
	{
		id: nanoid(20),
		user_id: nanoid(20),
		author: faker.name.firstName(),
		message: faker.lorem.paragraph(3)
	},
	{
		id: nanoid(20),
		user_id: nanoid(20),
		author: faker.name.firstName(),
		message: faker.lorem.paragraph(3)
	},
	{
		id: nanoid(20),
		user_id: nanoid(20),
		author: faker.name.firstName(),
		message: faker.lorem.paragraph(3)
	},
	{
		id: nanoid(20),
		user_id: nanoid(20),
		author: faker.name.firstName(),
		message: faker.lorem.paragraph(3)
	}
];

export const MessageContext = createContext<MessageContext>({
	messages: [],
	addMessage: () => null,
	clearChat: () => null
});

export const MessageProvider = ({ children }) => {
	const [chatHistory, handlers] = useListState<Message>([]);

	function addMessage(message: Message) {
		handlers.append(message);
	}

	function removeMessage(message_id: string) {
		handlers.filter(message => message.id !== message_id);
	}

	function clearChat() {
		handlers.setState([]);
	}

	return (
		<MessageContext.Provider value={{ messages: chatHistory, addMessage, clearChat }}>
			{children}
		</MessageContext.Provider>
	);
};
