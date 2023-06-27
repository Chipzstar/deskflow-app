import React, { useMemo } from 'react';
import Page from '../layout/Page';
import { Stack, Title, Text, Group, Space } from '@mantine/core';
import { useUser } from '@clerk/nextjs';
import { trpc } from '../utils/trpc';
import Pluralize from 'react-pluralize';
import StatCard from '../components/StatCard';
import dayjs from 'dayjs';
import { IssueCategory } from '@prisma/client';
import {
	Chart as ChartJS,
	LineElement,
	LineController,
	Legend,
	LinearScale,
	Tooltip,
	CategoryScale,
	PointElement,
	Point,
	ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { sanitize_labels } from '../utils/functions';

ChartJS.register(Tooltip, Legend, LineElement, LinearScale, LineController, CategoryScale, PointElement);

export function Index() {
	const { user } = useUser();
	const { data: issues, isLoading: issuesLoading } = trpc.issue.getIssues.useQuery();
	const { data: employeeIds, isLoading: employeesLoading } = trpc.issue.getUniqueEmployees.useQuery();

	const num_issues = useMemo(() => (issues ? issues.length : 0), [issues]);
	const num_employees = useMemo(() => (employeeIds ? employeeIds.length : 0), [employeeIds]);
	const time_to_resolution = useMemo(() => {
		if (issues) {
			return issues.reduce((prev, issue) => {
				if (issue.status === 'resolved' || issue.status === 'closed') {
					return prev + dayjs(issue.resolved_at).diff(dayjs(issue.created_at), 'seconds');
				}
				return prev;
			}, 0);
		}
		return 0;
	}, [issues]);
	const num_satisfied = useMemo(() => {
		return issues ? issues.filter(i => i.is_satisfied).length : 0;
	}, [issues]);

	const data: ChartData<'line', (number | Point | null)[], unknown> = useMemo(() => {
		const labels = sanitize_labels(Object.values(IssueCategory));
		const data = issues
			? labels.map(category => issues.filter(issue => issue.category === category).length)
			: Array(labels.length).fill(0);
		console.log(labels);
		console.log(data);
		return {
			labels,
			datasets: [
				{
					label: 'Number of issues',
					backgroundColor: '#3182ce',
					borderColor: '#3182ce',
					data,
					fill: false
				}
			]
		};
	}, [issues]);

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
					&nbsp;raised&nbsp;
					<strong>
						<Pluralize singular="issue" count={num_issues} />
					</strong>
					&nbsp;this past week
				</Text>
				<Group position="apart" spacing="xs">
					<StatCard
						loading={employeesLoading}
						value={Math.ceil(num_issues / num_employees)}
						description={'Issues per employee'}
					/>
					<StatCard
						loading={issuesLoading}
						value={Math.ceil((num_satisfied / num_issues) * 100)}
						description={'Employee Satisfaction'}
						extra={'%'}
					/>
					<StatCard
						loading={issuesLoading}
						value={time_to_resolution}
						description={'Time to resolution'}
						extra={' seconds'}
					/>
				</Group>
			</Stack>
			<Space h="md" />
			<Stack mt="xl" className="h-full">
				<Title weight={500} size="h3">
					Employee Queries Breakdown
				</Title>
				<div className="flex-auto p-4">
					{/* Chart */}
					<Line
						options={{
							maintainAspectRatio: false,
							responsive: true,
							plugins: {
								legend: {
									align: 'end',
									position: 'bottom'
								},
								tooltip: {
									mode: 'index',
									intersect: false
								}
							}
						}}
						data={data}
					/>
				</div>
			</Stack>
		</Page.Container>
	);
}

export default Index;
