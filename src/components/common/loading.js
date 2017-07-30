import React from 'react';
import { Modal } from 'react-bootstrap';

export default function LoadingModal(props) {
	return (
		<Modal show={props.loading} bsSize="large">
			<div style={{ textAlign: 'center', margin: '10px 0' }}>
				<h3>
					{props.text}...
				</h3>
				<i className="fa fa-cog fa-spin fa-3x fa-fw" />
				<span className="sr-only">Loading...</span>
			</div>
		</Modal>
	);
}
