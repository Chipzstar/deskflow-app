import React from 'react';
import { trpc } from '../utils/trpc';
interface Props {
	state: string;
}

const AddToSlack = ({ state }: Props) => {
	const { mutate: updateState } = trpc.user.updateSlackState.useMutation();
	return (
		<a
			href={`https://slack.com/oauth/v2/authorize?scope=app_mentions%3Aread%2Cchannels%3Ahistory%2Cchannels%3Aread%2Cchat%3Awrite%2Ccommands%2Cgroups%3Ahistory%2Cim%3Ahistory%2Cim%3Aread%2Cim%3Awrite%2Cmpim%3Ahistory%2Cusers%3Aread%2Cusers%3Aread.email%2Cusers.profile%3Aread&user_scope=&redirect_uri=https%3A%2F%2Fdeskflow-app-git-dev-deskflow.vercel.app%2Fintegrations%2Fslack&client_id=5172579464435.5245428704615&state=${state}`}
			onClick={() => updateState({ state })}
			style={{
				alignItems: 'center',
				color: '#fff',
				backgroundColor: '#4A154B',
				border: 0,
				borderRadius: 4,
				display: 'inline-flex',
				fontFamily: 'Lato, sans-serif',
				fontSize: 18,
				fontWeight: 600,
				height: 56,
				justifyContent: 'center',
				textDecoration: 'none',
				width: 276
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				style={{ height: 24, width: 24, marginRight: 12 }}
				viewBox="0 0 122.8 122.8"
			>
				<path
					d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
					fill="#e01e5a"
				/>
				<path
					d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
					fill="#36c5f0"
				/>
				<path
					d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
					fill="#2eb67d"
				/>
				<path
					d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
					fill="#ecb22e"
				/>
			</svg>
			Add to Slack
		</a>
	);
};

export default AddToSlack;
