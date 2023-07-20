import React from 'react';
import { Image, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconCircleCheck, IconCirclePlus } from '@tabler/icons-react';
import { IntegrationName } from '../utils/types';

interface Props {
	name: IntegrationName;
	img?: string | null;
	text?: string | null;
	w?: number;
	h?: number;
	onModal?: () => void;
	onIntegrate: (name: string) => void;
	isIntegrated?: boolean;
	children?: JSX.Element | JSX.Element[] | null;
}

const IntegrationCard = ({
	name,
	img = null,
	text = null,
	w = 130,
	h = 100,
	onModal,
	onIntegrate,
	isIntegrated = false
}: Props) => {
	const router = useRouter();
	return (
		<div
			className="bg-primary/[.1] border-primary relative cursor-pointer rounded-xl border-2 transition duration-300 ease-out hover:ease-in"
			onClick={() => {
				isIntegrated ? router.push(`/integrations/${name}`) : onModal ? onModal() : onIntegrate(name);
			}}
		>
			<div
				role="button"
				style={{
					position: 'absolute',
					right: 5,
					top: 5
				}}
			>
				{isIntegrated ? (
					<IconCircleCheck color="#18C31A" size={25} stroke={1.5} />
				) : (
					<IconCirclePlus color="#2742F5" size={25} stroke={1.5} />
				)}
			</div>
			<div className="flex h-full items-center justify-center">
				{img ? (
					<Image src={img} fit="contain" width={w} height={h} />
				) : (
					<Text align="center" color="brand" transform="uppercase" size="xl" weight={600}>
						{text}
					</Text>
				)}
			</div>
		</div>
	);
};

export default IntegrationCard;
