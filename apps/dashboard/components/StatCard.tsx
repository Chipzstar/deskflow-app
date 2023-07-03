import React from 'react';
import { Card, Loader, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';

interface Props {
	value: number;
	description: string;
	loading: boolean;
	type?: 'NORMAL' | 'DURATION';
	extra?: string;
}

const StatCard = ({ type = 'NORMAL', value, description, loading, extra }: Props) => {
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
						{value > 1000 ? Math.round(value / 60) : value}
						{value > 1000 ? ' minutes' : extra}
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
