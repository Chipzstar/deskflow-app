import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
	projectId: 'ktrbg5',
	e2e: {
		...nxE2EPreset(__dirname),
		projectId: 'oqhbgf'
	}
});
