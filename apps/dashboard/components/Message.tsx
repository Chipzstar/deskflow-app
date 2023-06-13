import React, { useContext } from 'react';
import { Text } from '@mantine/core';
import { AuthContext } from '../context/AuthContext';
import { useUser } from '@clerk/nextjs';

export const Message = ({ message }) => {
	const { user } = useUser(); // the currently logged in user

	function isMessageFromUser() {
		return user?.id === message.user_id;
	}

	return (
		<div className={`${isMessageFromUser() ? 'place-self-end' : 'place-self-start'}`}>
			<div className="flex-grow-1 flex flex-shrink-0 flex-col">
				<Text color="dark" weight={600} size="sm">
					{message.author}
				</Text>
				<div
					className={`rounded-2xl bg-white p-5 ${
						isMessageFromUser() ? 'rounded-tr-none' : 'rounded-tl-none'
					}`}
				>
					{message.message}
				</div>
			</div>
		</div>
	);
};

export default Message;
