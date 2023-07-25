import { faker } from '@faker-js/faker';

const firstname = faker.name.firstName();
const lastname = faker.name.lastName();
const email = faker.internet.email(firstname, lastname);
describe('Auth - Signup', () => {
	beforeEach(() => cy.visit('/signup', { failOnStatusCode: false }).url().should('contain', '/signup'));

	it('duplicate email', () => {
		cy.signup({
			firstname,
			lastname,
			fullname: `${firstname} ${lastname}`,
			email: 'chisom@trok.co',
			phone: faker.phone.number('+44 75# ### ####'),
			password: faker.internet.password(25, false, /[A-Za-z0-9#@_=/><)("*!?.,]/)
		});
		cy.location('pathname').should('contain', '/signup');
	});

	it('insecure password', () => {
		cy.signup({
			firstname,
			lastname,
			email,
			phone: faker.phone.number('+44 75# ### ####'),
			password: faker.internet.password(20, false, /[A-Za-z#@_=/><)("*!?.,]/),
			fullname: `${firstname} ${lastname}`
		});
		cy.location('pathname').should('contain', '/signup');
	});

	it('successful signup', () => {
		cy.signup({
			firstname,
			lastname,
			email,
			phone: faker.phone.number('+44 75# ### ####'),
			password: faker.internet.password(25, false, /[A-Za-z0-9#@_=/><)("*!?.,]/),
			fullname: `${firstname} ${lastname}`
		});
		cy.location('pathname').should('contain', '/onboarding');
	});

	after(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		cy.log(window.Clerk);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// fetch the user id from the cookie
		const session = window.Clerk.session;
		cy.log(session);
		cy.request({
			url: `https://api.clerk.com/v1/users/${session.user}`,
			method: 'POST',
			headers: {
				Authorization: `Bearer 6351316e230c0984c3d06ed0`
			}
		}).then(r => console.log(r));
	});
});
