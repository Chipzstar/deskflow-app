import React from 'react';
import Page from '../layout/Page';
import { Stack, Title, Text, Group, Image, Space } from '@mantine/core';

export function Index() {
	return (
		<Page.Container>
			<Stack spacing="xl">
				<Title weight={500} size={32}>
					Welcome Ola
				</Title>
				<Text>
					Overall, <strong>120 employees</strong> raised <strong>156 issues</strong> this past week
				</Text>
				<Group position="apart">
					<div>
						<Image src="/static/images/stat-card-1.svg" alt="stat-1" fit="contain" width={400} />
					</div>
					<div>
						<Image src="/static/images/stat-card-2.svg" alt="stat-2" fit="contain" width={400} />
					</div>
					<div>
						<Image src="/static/images/stat-card-3.svg" alt="stat-3" fit="contain" width={400} />
					</div>
				</Group>
			</Stack>
			<Space h="md" />
			<Stack mt="xl">
				<Title weight={500} size="h3">
					Employee Queries Breakdown
				</Title>
				<div className="w-full">
					<Image src="/static/images/graph.svg" alt="graph" />
				</div>
			</Stack>
		</Page.Container>
	);
}

export default Index;
