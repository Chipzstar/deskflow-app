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

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	LineController,
	CategoryScale,
	ChartDataLabels,
	PointElement
);

export function Index() {
	const { user } = useUser();
	const { data: issues, isLoading: issuesLoading } = trpc.issue.getIssues.useQuery();
	const { data: employeeIds, isLoading: employeesLoading } = trpc.issue.getUniqueEmployees.useQuery();

	const num_issues = useMemo(() => (issues ? issues.length : 0), [issues]);
	const num_employees = useMemo(() => (employeeIds ? employeeIds.length : 0), [employeeIds]);

	const issues_per_employee = useMemo(() => {
		if (employeeIds && issues) {
			return !employeeIds.length ? 0 : Math.ceil(issues.length / employeeIds.length);
		}
		return 0;
	}, [issues, employeeIds]);

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
	const satisfaction_rate = useMemo(() => {
		if (issues) {
			const num_satisfied = issues.filter(i => i.is_satisfied).length;
			return !issues.length ? 0 : Math.ceil((num_satisfied / issues.length) * 100);
		}
		return 0;
	}, [issues]);

	const data: ChartData<'line', (number | Point | null)[], unknown> = useMemo(() => {
		const categories = Object.values(IssueCategory);
		const data = issues
			? categories.map(category => {
					const num_issues = issues.filter(issue => issue.category === category).length;
					return Math.ceil((num_issues / issues.length) * 100);
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  })
			: Array(categories.length).fill(0);
		return {
			labels: sanitize_labels(categories),
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
				<Group grow position="apart" spacing="xl" noWrap={false}>
					<StatCard
						loading={employeesLoading}
						value={issues_per_employee}
						description={'Issues per employee'}
					/>
					<StatCard
						loading={issuesLoading}
						value={satisfaction_rate}
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
								datalabels: {
									formatter: (value, context) => `${value}%`,
									anchor: 'end',
									align: 'top',
									clamp: true
								},
								legend: {
									align: 'end',
									position: 'bottom'
								},
								tooltip: {
									mode: 'index',
									intersect: false
								}
							},
							scales: {
								x: {
									grid: {
										display: true
									},
									title: {
										display: true,
										font: {
											weight: '600',
											size: 17
										},
										text: 'Category'
									},
									ticks: {
										color: '#AEAEAE',
										font: {
											size: 14,
											weight: '600'
										}
									}
								},
								y: {
									grid: {
										display: false
									},
									title: {
										display: true,
										text: 'Percentage',
										font: {
											weight: '600',
											size: 17
										}
									},
									ticks: {
										color: '#AEAEAE',
										font: {
											size: 14,
											weight: '600'
										},
										callback: function (value, index, ticks) {
											return `${value}%`;
										}
									}
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
