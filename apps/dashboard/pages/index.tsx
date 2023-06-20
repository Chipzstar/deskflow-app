import React, { useMemo } from 'react';
import Page from '../layout/Page';
import { Stack, Title, Text, Group, Image, Space } from '@mantine/core';
import { useUser } from '@clerk/nextjs';
import { trpc } from '../utils/trpc';
import Pluralize from 'react-pluralize';

export function Index() {
	const { user } = useUser();
	const { data: issues } = trpc.issue.getIssues.useQuery();
	const { data: employeeIds } = trpc.issue.getUniqueEmployees.useQuery();

	const num_issues = useMemo(() => (issues ? issues.length : 0), [issues]);
	const num_employees = useMemo(() => (employeeIds ? employeeIds.length : 0), [employeeIds]);

	return (
		<Page.Container>
			<Stack spacing="xl">
				<Title weight={500} size={32}>
					Welcome {user?.firstName}
				</Title>
				<Text>
					Overall,&nbsp;
					<strong>
						<Pluralize singular="employee" count={num_employees} />
					</strong>
					&nbsp; raised&nbsp;
					<strong>
						<Pluralize singular="issue" count={num_issues} />
					</strong>
					&nbsp; this past week
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
