import React from 'react';
import BackButton from '../../components/BackButton';
import IntegrationStatus from '../../components/IntegrationStatus';

const IntegrationHeader = ({ isActive }: { isActive: boolean }) => {
	return (
		<div className="flex items-center justify-between">
			<BackButton />
			<IntegrationStatus isActive={isActive} />
		</div>
	);
};

export default IntegrationHeader;
