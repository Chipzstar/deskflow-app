import React, { createContext, useState } from 'react';
import { useListState } from '@mantine/hooks';
import { OpenAIMessage } from '../utils/types';

export type OpenAIResponse = {
	messages: OpenAIMessage[];
	reply: string;
};

interface MessageContext {
	history: OpenAIMessage[];
	setHistory: (messages: OpenAIMessage[]) => void;
}

export const OpenAIContext = createContext<MessageContext>({
	history: [],
	setHistory: () => null
});

export const OpenAIMessageProvider = ({ children }) => {
	const [openaiChatMessages, handlers] = useListState<OpenAIMessage>([]);

	function setHistory(messages: OpenAIMessage[]) {
		handlers.setState(messages);
	}

	return (
		<OpenAIContext.Provider value={{ history: openaiChatMessages, setHistory }}>{children}</OpenAIContext.Provider>
	);
};
