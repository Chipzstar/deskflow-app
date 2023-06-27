import { showNotification } from '@mantine/notifications';

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
