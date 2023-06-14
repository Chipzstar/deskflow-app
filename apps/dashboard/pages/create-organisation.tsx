import React from 'react';
import { CreateOrganization } from '@clerk/nextjs';
import Page from '../layout/Page';

const CreateOrganisation = () => {
	return (
		<Page.Container extraClassNames="flex justify-center items-center">
			<CreateOrganization />
		</Page.Container>
	);
};

export default CreateOrganisation;
