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

export interface SignupInfo {
	fullname: string | null;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	password: string;
}

export interface OnboardingBusinessInfo {
	legal_name: string;
	display_name: string;
	business_crn: string;
	business_url: string;
}

export type OnboardingAccountStep1 = (SignupInfo & Record<'business', OnboardingBusinessInfo>) | null;

export type IntegrationName =
	| 'zendesk-guide'
	| 'confluence'
	| 'sharepoint'
	| 'drive'
	| 'upload'
	| 'zendesk-support'
	| 'jira'
	| 'freshservice'
	| 'servicenow'
	| 'happyfox'
	| 'slack'
	| 'gmail'
	| 'teams'
	| 'zoom'
	| 'yammer'
	| 'rippling'
	| 'bamboohr'
	| 'zelt'
	| 'gusto'
	| 'deel';

export interface OAuthToken {
	access_token: string;
	token_type: string;
	scope: 'read' | 'write';
}
