import React from 'react';
import { Image, Text } from '@mantine/core';

interface Props {
	name: string;
	img?: string | null;
	text?: string | null;
	w?: number;
	h?: number;
	onSelect: (name: string) => void;
}

const IntegrationCard = ({ name, img = null, text = null, w = 130, h = 100, onSelect }: Props) => {
	return (
		<div
			className="bg-primary/[.1] border-primary relative cursor-pointer rounded-xl border-2 transition duration-300 ease-out hover:ease-in"
			onClick={() => onSelect(name)}
		>
			<div
				role="button"
				style={{
					position: 'absolute',
					right: 5,
					top: 5
				}}
			>
				<Image src="/static/images/add.svg" width={20} height={20} />
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
