import React from 'react';
import { OrganizationProfile } from '@clerk/nextjs';
import Page from '../layout/Page';

const OrganisationProfile = () => {
	return (
		<Page.Container extraClassNames="justify-center items-center">
			<OrganizationProfile />
		</Page.Container>
	);
};

export default OrganisationProfile;
