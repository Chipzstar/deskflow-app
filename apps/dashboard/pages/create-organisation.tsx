import React from 'react';
import { CreateOrganization } from '@clerk/nextjs';
import Page from '../layout/Page';
import { PATHS } from '../utils/constants';

const CreateOrganisation = () => {
	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<CreateOrganization afterCreateOrganizationUrl={PATHS.HOME} />
		</Page.Container>
	);
};

export default CreateOrganisation;
