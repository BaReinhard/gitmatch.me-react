import React from 'react';

export default function PseudoAfter(props) {
	return (
		<div
			style={{
				backgroundImage: `url(${props.background})`,
				content: '',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				opacity: 0.5,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				position: 'absolute',
				zIndex: -1,
			}}
		/>
	);
}
