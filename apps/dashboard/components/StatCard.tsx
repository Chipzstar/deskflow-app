import React from 'react';
import { Card, Loader, Stack, Text } from '@mantine/core';

interface Props {
	value: number;
	description: string;
	loading: boolean;
	extra?: string;
}

const StatCard = ({ value, description, loading, extra }: Props) => {
	return (
		<Card
			h={150}
			radius="md"
			padding="lg"
			className="border-primary border"
			sx={theme => ({
				backgroundColor: '#E9ECFE'
			})}
		>
			<Stack align="center" justify="center" spacing={0} className="h-full">
				{loading ? (
					<Loader />
				) : (
					<Text size={38} color="brand" weight={600}>
						{value}
						{extra}
					</Text>
				)}
				<Text size={20} className="font-semibold">
					{description}
				</Text>
			</Stack>
		</Card>
	);
};

export default StatCard;
