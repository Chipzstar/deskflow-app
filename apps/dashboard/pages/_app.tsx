import { createEmotionCache, MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../layout/Layout';
import { AuthProvider } from '../context/AuthContext';
import { MessageProvider } from '../context/MessageContext';
import { OpenAIMessageProvider } from '../context/OpenAIContext';
import RouterTransition from '../layout/RouterTransition';
import { Notifications } from '@mantine/notifications';
import localFont from '@next/font/local';
import '../styles/globals.css';

const inter = localFont({
	src: [
		{
			path: '../public/static/fonts/Inter/Inter-Thin.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Inter/Inter-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Inter/Inter-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Inter/Inter-SemiBold.ttf',
			weight: '600',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Inter/Inter-Bold.ttf',
			weight: '700'
		},
		{
			path: '../public/static/fonts/Inter/Inter-ExtraBold.ttf',
			weight: '800'
		}
	],
	variable: '--font-inter'
});

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Deskflow</title>
			</Head>
			<AuthProvider>
				<MessageProvider>
					<OpenAIMessageProvider>
						<MantineProvider
							withGlobalStyles
							withNormalizeCSS
							emotionCache={appendCache}
							theme={{
								/** Put your mantine theme override here */
								colors: {
									brand: [
										'#D6DCFD',
										'#C3CAFC',
										'#9CA8FA',
										'#7586F9',
										'#4E64F7',
										'#2742F5',
										'#0A25DA',
										'#081CA4',
										'#05136F',
										'#030A39'
									],
									background: [
										'#FFFFFF',
										'#FFFFFF',
										'#FFFFFF',
										'#FEFEFE',
										'#EAEAEA',
										'#CECECE',
										'#B2B2B2',
										'#969696',
										'#7A7A7A',
										'#6C6C6C'
									]
								},
								primaryColor: 'brand',
								primaryShade: 5,
								colorScheme: 'light',
								fontFamily: inter.style.fontFamily,
								fontFamilyMonospace: 'Monaco, Courier, monospace',
								headings: { fontFamily: inter.style.fontFamily },
								components: {
									Input: {
										styles: theme => ({
											input: {
												borderColor: '#2742F5',
												borderWidth: '1px',
												borderStyle: 'solid'
											}
										})
									}
								}
							}}
						>
							<RouterTransition />
							<main className="app">
								<Notifications position="top-right" />
								<Layout>
									<Component {...pageProps} />
								</Layout>
							</main>
						</MantineProvider>
					</OpenAIMessageProvider>
				</MessageProvider>
			</AuthProvider>
		</>
	);
}

export default CustomApp;
