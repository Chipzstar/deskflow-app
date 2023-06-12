export interface OpenAIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

type ClerkEventType = 'user.created' | 'user.updated' | 'email.created' | 'user.deleted';

export type ClerkEvent = {
	data: UserData;
	object: 'event';
	type: ClerkEventType;
};

export interface UserData {
	backup_code_enabled: boolean;
	banned: boolean;
	birthday: string;
	created_at: number;
	email_addresses: EmailAddress[];
	external_accounts: any[];
	external_id: any;
	first_name: string;
	gender: string;
	id: string;
	image_url: string;
	last_name: string;
	last_sign_in_at: any;
	object: string;
	password_enabled: boolean;
	phone_numbers: any[];
	primary_email_address_id: string;
	primary_phone_number_id: any;
	primary_web3_wallet_id: any;
	private_metadata: unknown;
	profile_image_url: string;
	public_metadata: unknown;
	totp_enabled: boolean;
	two_factor_enabled: boolean;
	unsafe_metadata: unknown;
	updated_at: number;
	username: any;
	web3_wallets: any[];
}

export interface EmailAddress {
	email_address: string;
	id: string;
	linked_to: any[];
	object: string;
	reserved: boolean;
	verification: Verification;
}

export interface Verification {
	attempts: number;
	expire_at: number;
	status: string;
	strategy: string;
}
