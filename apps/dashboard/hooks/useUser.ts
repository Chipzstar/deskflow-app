import { useContext } from 'react';
import { AuthContext, User } from '../context/AuthContext';
import { useLocalStorage } from '@mantine/hooks';

export const useUser = () => {
	const { user, setUser } = useContext(AuthContext);
	const [localUser, storeUser] = useLocalStorage<User | null>({ key: 'user', defaultValue: null });

	const addUser = (user: User) => {
		setUser(user);
		storeUser(user);
	};

	const removeUser = () => {
		setUser(null);
		storeUser(null);
	};

	return { addUser, removeUser };
};
