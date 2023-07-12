import React, { useState } from 'react';
import { Button, Group, Modal, PinInput } from '@mantine/core';

const VerificationCode = ({ opened, onClose, onSubmit, loading }) => {
	const [code, setCode] = useState('');
	return (
		<Modal
			size="lg"
			opened={opened}
			onClose={onClose}
			centered
			title="Verification code"
			padding="lg"
			withCloseButton={false}
		>
			<Modal.Body>
				<div className="flex flex-col space-y-12">
					<Group position="center">
						<PinInput size="xl" length={6} value={code} onChange={setCode} />
					</Group>
				</div>
				<Group pt="xl" position="right">
					<Button size="md" onClick={() => onSubmit(code)} loading={loading}>
						Confirm
					</Button>
				</Group>
			</Modal.Body>
		</Modal>
	);
};

export default VerificationCode;