import React from 'react';
import {
	OverlayTrigger,
	Tooltip,
	FormGroup,
	InputGroup,
	FormControl,
	Button,
	ControlLabel,
} from 'react-bootstrap';
const overlay = (
	<Tooltip id="tooltip">
		<strong>Search By Your Username</strong>
	</Tooltip>
);
export default function GitMatchForm(props) {
	return (
		<OverlayTrigger placement="bottom" overlay={overlay}>
			<form
				className=""
				onSubmit={props.submit}
				style={{
					width: '75%',
					margin: '0 auto',
					textAlign: 'center',
				}}
			>
				<FormGroup>
					<ControlLabel>
						{props.title + ' '}
					</ControlLabel>
					<InputGroup>
						<FormControl
							type="text"
							name="username"
							type="text"
							value={props.input}
							className="form-control"
							onChange={props.onInput}
							onClick={props.select}
							placeholder="username"
						/>
						<InputGroup.Button>
							<Button type="submit">
								<span className="fa fa-user-circle" /> MatchMe
							</Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>
			</form>
		</OverlayTrigger>
	);
}
