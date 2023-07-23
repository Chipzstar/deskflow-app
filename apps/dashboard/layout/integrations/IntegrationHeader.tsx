import React from 'react';
import BackButton from '../../components/BackButton';
import IntegrationStatus from '../../components/IntegrationStatus';

const IntegrationHeader = ({ isActive, goBack }: { isActive: boolean; goBack: () => void }) => {
	return (
		<div className="flex items-center justify-between">
			<BackButton goBack={goBack} />
			<IntegrationStatus isActive={isActive} />
		</div>
	);
};

export default IntegrationHeader;
