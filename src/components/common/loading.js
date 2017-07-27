import React from 'react';

export default function LoadingModal(props) {
	if (props.loading) {
		return (
			<div
				style={{
					display: 'block',
					left: 0,
					right: 0,
					backgroundColor: 'rgba(255,255,255,1)',
					zIndex: '2003',
					textAlign: 'center',
					position: 'fixed',
					top: '10%',
					height: '150px',
					boxSizing: 'border-box',
				}}
			>
				<h3>
					{props.text}...
				</h3>
				<i className="fa fa-cog fa-spin fa-3x fa-fw" />
				<span className="sr-only">Loading...</span>
			</div>
		);
	} else {
		return <div />;
	}
}
