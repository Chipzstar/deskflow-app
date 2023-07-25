// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OnboardingBusinessInfo, SignupInfo } from '../../../dashboard/utils/types';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface Chainable<Subject> {
			login(email: string, password: string): void;

			logout(): void;

			signin(): void;

			signout(): void;

			signup(values: SignupInfo): void;

			onboardingStep1(values: OnboardingBusinessInfo): void;
		}
	}
}
//
// -- This is a parent command --
Cypress.Commands.addAll({
	login(email, password) {
		cy.log('Logging in...');
		cy.get('[data-cy="login-form"]').within(function () {
			cy.get('input[data-cy="login-email"]').type(email);
			cy.get('.mantine-PasswordInput-visibilityToggle').then($btn => cy.wrap($btn));
			cy.get('input[data-cy="login-password"]').type(password);
			cy.root().submit();
		});
	},
	logout() {
		cy.log('Logging out...');
		cy.get('[data-cy="logout-button"]').click();
	}
});

Cypress.Commands.add(`signin`, () => {
	cy.log(`Signing in.`);
	cy.visit(`/`);

	cy.window()
		.should(window => {
			expect(window).to.not.have.property(`Clerk`, undefined);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect(window.Clerk.isReady()).to.eq(true);
		})
		.then(async window => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			await cy.clearCookies({ domain: window.location.origin });
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const res = await window.Clerk.client.signIn.create({
				identifier: Cypress.env(`test_email`),
				password: Cypress.env(`test_password`)
			});
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			await window.Clerk.setActive({
				session: res.createdSessionId
			});

			cy.log(`Finished Signing in.`);
		});
});

Cypress.Commands.add(`signout`, () => {
	cy.log(`sign out by clearing all cookies.`);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	cy.clearCookies({ domain: null });
});

Cypress.Commands.add('signup', values => {
	cy.log('Signing up...');
	cy.get('[data-cy="signup-form"]').within(function () {
		cy.get('input[data-cy="signup-firstname"]').type(values.firstname);
		cy.get('input[data-cy="signup-lastname"]').type(values.lastname);
		cy.get('input[data-cy="signup-email"]').type(values.email);
		cy.get('input[data-cy="signup-phone"]').type(values.phone);
		cy.get('input[data-cy="signup-password"]').type(values.password);
		cy.get('input[data-cy="signup-terms"]').check();
		cy.root().submit();
	});
});

Cypress.Commands.add('onboardingStep1', (values, has_file = false) => {
	cy.log('Completing Onboarding step 1...');
	cy.get('[data-cy="onboarding-company-form"]').within(function () {
		cy.get('input[data-cy="onboarding-legal-name"]').type(values.legal_name);
		cy.get('input[data-cy="onboarding-business-crn"]').type(values.business_crn);
		cy.get('input[data-cy="onboarding-business-url"]').type(String(values.business_url));
		if (has_file) {
			cy.fixture('test-file.jpg').as('myFixture');
			cy.get('input[type=file]')
				.invoke('attr', 'style', 'display: block')
				.should('have.attr', 'style', 'display: block')
				.selectFile('@myFixture');
		}
		cy.root().submit();
	});
});
