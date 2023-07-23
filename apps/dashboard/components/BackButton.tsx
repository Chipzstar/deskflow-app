import React from 'react';
import { Button, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

const BackButton = ({ goBack }) => {
	return (
		<Button
			variant="transparent"
			size="xl"
			className="test2"
			onClick={goBack}
			sx={theme => ({
				position: 'relative'
			})}
			leftIcon={<IconArrowLeft color="gray" size={30} />}
		>
			<Text color="dimmed" size="lg">
				Go Back
			</Text>
		</Button>
	);
};

export default BackButton;
