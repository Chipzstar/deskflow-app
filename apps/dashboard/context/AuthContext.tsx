import { createContext, useState } from 'react';

export interface User {
	id: string;
	name: string;
	email: string;
	authToken?: string | null;
}

interface AuthContext {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContext>({
	user: null,
	setUser: user => null
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
