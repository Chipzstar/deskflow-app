import { showNotification } from '@mantine/notifications';

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
