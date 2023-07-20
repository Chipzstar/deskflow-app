import React from 'react';
import { Text, Button, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const BackButton = () => {
	const router = useRouter();
	return (
		<Button
			variant="transparent"
			size="xl"
			className="test2"
			onClick={router.back}
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
