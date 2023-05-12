import React from 'react';
import { DEFAULT_HEADER_HEIGHT } from '../utils/constants';
import { Container as MantineContainer } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

interface PageContainerProps {
	children: JSX.Element | JSX.Element[];
	header?: JSX.Element;
	classNames?: string;
	extraClassNames?: string;
	data_cy?: string;
}

const Page = ({ children }) => {
	return { children };
};

const Container = ({
	children,
	header = undefined,
	classNames = 'h-full sm:h-screen flex flex-col bg-body',
	extraClassNames = '',
	data_cy = undefined
}: PageContainerProps) => {
	const { height } = useViewportSize();
	return (
		<MantineContainer
			p="xl"
			pl={50}
			fluid
			mih={height - DEFAULT_HEADER_HEIGHT}
			className={`${classNames} ${extraClassNames}`}
			data-cy={data_cy}
		>
			{header}
			{children}
		</MantineContainer>
	);
};

Page.Container = Container;

const Header = ({
	children,
	classNames = 'bg-white mb-4 flex items-center px-6',
	extraClassNames = '',
	height = DEFAULT_HEADER_HEIGHT
}) => {
	return (
		<div
			className={`${classNames} ${extraClassNames}`}
			style={{
				height,
				minHeight: height
			}}
		>
			{children}
		</div>
	);
};

Page.Header = Header;

const Body = ({ children, classNames = 'px-6 flex flex-col grow', extraClassNames = '' }) => {
	return <div className={`${classNames} ${extraClassNames}`}>{children}</div>;
};

Page.Body = Body;

const Footer = ({ children, classNames = 'flex px-6', extraClassNames = '', height = DEFAULT_HEADER_HEIGHT }) => {
	return (
		<div
			className={`${classNames} ${extraClassNames}`}
			style={{
				height,
				minHeight: height
			}}
		>
			{children}
		</div>
	);
};

Page.Footer = Footer;

export default Page;
