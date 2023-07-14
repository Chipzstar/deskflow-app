import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { PATHS } from '../utils/constants';
import { Anchor, Stack, Stepper, ScrollArea, Text } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import Page from '../layout/Page';

const Onboarding = () => {
	const router = useRouter();
	const { height } = useViewportSize();

	const active = useMemo(() => {
		return isNaN(Number(router.query?.page)) ? 0 : Number(router.query?.page) - 1;
	}, [router.query]);

	const nextStep = useCallback(() => {
		router.replace({
			pathname: PATHS.ONBOARDING,
			query: {
				page: active + 2
			}
		});
	}, [active, router]);

	const prevStep = useCallback(() => {
		router.replace({
			pathname: PATHS.ONBOARDING,
			query: {
				page: active
			}
		});
	}, [active, router]);

	const customerSupportNumber = (
		<Stack align="center" spacing={0}>
			<Text size="sm">If you have any questions, please call</Text>
			<Anchor size="sm" href="tel:0333 050 9591">
				0333 050 9591
			</Anchor>
		</Stack>
	);

	return (
		<ScrollArea.Autosize mah={height} mx="auto">
			<Page.Container extraClassNames="flex justify-center items-center">
				<Text mb="md" size="lg" className="text-center">
					Step {active + 1} of 4
				</Text>
				<Stepper
					iconSize={25}
					completedIcon={<div className="bg-white" />}
					active={active}
					size="xs"
					styles={{
						stepBody: {
							display: 'none'
						},
						step: {
							padding: 0
						},
						stepIcon: {
							borderWidth: 2
						},
						separator: {
							marginLeft: -2,
							marginRight: -2
						}
					}}
					classNames={{
						root: 'flex flex-col items-center',
						steps: 'w-1/3 px-20',
						content: 'w-1/3 h-full'
					}}
				>
					<Stepper.Step icon={<div />} label="First step" description="Company" allowStepSelect={active > 0}>
						{customerSupportNumber}
						{/*<Step1 nextStep={nextStep} />*/}
					</Stepper.Step>
					<Stepper.Step
						icon={<div />}
						label="Second step"
						description="Director"
						allowStepSelect={active > 1}
					>
						{customerSupportNumber}
						{/*<Step2 prevStep={prevStep} nextStep={nextStep} />*/}
					</Stepper.Step>
					<Stepper.Step
						icon={<div />}
						label="Second step"
						description="Financial"
						allowStepSelect={active > 2}
					>
						{customerSupportNumber}
						{/*<Step3 prevStep={prevStep} nextStep={nextStep} />*/}
					</Stepper.Step>
					<Stepper.Step icon={<div />} label="Final step" description="Location" allowStepSelect={active > 3}>
						{customerSupportNumber}
						{/*<Step4 prevStep={prevStep} />*/}
					</Stepper.Step>
				</Stepper>
			</Page.Container>
		</ScrollArea.Autosize>
	);
};

export default Onboarding;
