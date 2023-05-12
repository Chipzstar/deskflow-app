import React, { useContext } from 'react';
import { Text } from '@mantine/core';
import { AuthContext } from '../context/AuthContext';

export const Message = ({ message }) => {
	const { user } = useContext(AuthContext); // the currently logged in user

	function isMessageFromUser() {
		return user?.id === message.user_id;
	}

	return (
		<div className={`${isMessageFromUser() ? 'place-self-end' : 'place-self-start'}`}>
			<div className="flex flex-col flex-grow-1 flex-shrink-0">
				<Text color="dark" weight={600} size="sm">
					{message.author}
				</Text>
				<div
					className={`bg-white p-5 rounded-2xl ${
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
