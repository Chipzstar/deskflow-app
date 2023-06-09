import React from 'react';
import { Badge, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

const IntegrationStatus = ({ isActive }: { isActive: boolean }) => {
	return (
		<Badge
			size="lg"
			pl={10}
			leftSection={isActive ? <IconCheck size={18} color="lightgreen" /> : <IconX size={18} color="red" />}
			variant="outline"
			color={isActive ? 'green' : 'red'}
			sx={theme => ({
				position: 'absolute',
				right: 20
			})}
		>
			<Text size="sm">{isActive ? 'Active' : 'Inactive'}</Text>
		</Badge>
	);
};

export default IntegrationStatus;
