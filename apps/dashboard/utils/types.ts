export interface OpenAIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

type ClerkEventType =
	| 'user.created'
	| 'user.updated'
	| 'email.created'
	| 'user.deleted'
	| 'organizationMembership.updated'
	| 'organizationMembership.created'
	| 'organizationMembership.deleted'
	| 'organization.created'
	| 'organization.updated'
	| 'organization.deleted';
