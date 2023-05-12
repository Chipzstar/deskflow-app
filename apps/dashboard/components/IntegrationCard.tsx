import React from 'react';
import { Image, Text } from '@mantine/core';

const IntegrationCard = ({ img = null, text = null, w = 130, h = 100 }) => {
	return (
		<div className="bg-primary/[.1] border-primary border-2 rounded-xl relative">
			<div
				style={{
					position: 'absolute',
					right: 5,
					top: 5
				}}
			>
				<Image src="/static/images/add.svg" width={20} height={20} />
			</div>
			<div className="flex justify-center items-center h-full">
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
