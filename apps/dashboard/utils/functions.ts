import { showNotification } from '@mantine/notifications';
import { requirements } from './constants';
import parsePhoneNumber from 'libphonenumber-js';

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalize_all(str: string): string {
	return str
		.split(' ')
		.map(word => capitalize(word))
		.join(' ');
}

export function sanitize_labels(labels: string[]): string[] {
	return labels.map(label => capitalize_all(label.trim().replace(/[-_]/g, ' ')));
}

export function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach(requirement => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export function getE164Number(phoneNumber: string) {
	const phone = parsePhoneNumber(phoneNumber, 'GB');
	if (phone && phone.getPossibleCountries().includes('GB')) {
		const E164Number = phone.format('E.164');
		console.log('E164Number:', E164Number);
		return E164Number;
	}
	return phoneNumber;
}

export function notifySuccess(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		autoClose: 3000,
		title: 'Success',
		message,
		color: 'green',
		icon,
		loading: false
	});
}

export function notifyError(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		autoClose: 5000,
		title: 'Error',
		message,
		color: 'red',
		icon,
		loading: false
	});
}
