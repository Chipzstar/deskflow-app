import React, { useContext } from 'react';
import Message from './Message';
import { MessageContext } from '../context/MessageContext';
import { ScrollArea, Text } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

const MessageList = ({ thinking }) => {
	const { messages, addMessage } = useContext(MessageContext); // Retrieve messages from database
	const { height } = useViewportSize();
	return (
		<ScrollArea.Autosize mah={height - 220}>
			<ul className="space-y-12 grid grid-cols-1">
				{messages && messages.map((message, index) => <Message key={index} message={message} />)}
				{thinking && <Text fs="italic">Thinking...</Text>}
			</ul>
		</ScrollArea.Autosize>
	);
};

export default MessageList;
