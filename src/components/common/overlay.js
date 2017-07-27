import React from 'react';

export default function OverlayModal(props) {
	if (props.loading) {
		return (
			<div
				style={{
					backgroundColor: 'rgba(0,0,0,.7)',
					zIndex: '100',
					textAlign: 'center',
					position: 'fixed',
					top: '0',
					height: '100vh',
					width: '100vw',
					boxSizing: 'border-box',
				}}
			/>
		);
	} else {
		return <div />;
	}
}
