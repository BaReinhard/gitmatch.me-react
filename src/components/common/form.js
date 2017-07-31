import React from 'react';
import {
	OverlayTrigger,
	Tooltip,
	FormGroup,
	InputGroup,
	FormControl,
	Button,
	ControlLabel,
	Image,
	Col,
	Grid,
} from 'react-bootstrap';

const overlay = (
	<Tooltip id="tooltip">
		<strong>Search By Your Username</strong>
	</Tooltip>
);

export default function GitMatchForm(props) {
	const formStyle = {
		color: 'black',
		backgroundImage: 'url(' + props.background + ')',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		display: 'block',
		width: '100vw',
		height: '100vh',
		margin: '0 auto',
		top: '0',
		left: 0,
		right: 0,
		textAlign: 'center',
		height: '100vh',
	};
	return (
		<Col xs={12} md={6} style={formStyle}>
			<form
				className="form-component"
				onSubmit={props.submit}
				style={{ top: '20%', position: 'absolute', width: '100%' }}
			>
				<Col xs={12} md={12}>
					<Image src={props.image} style={{ margin: '0' }} />
				</Col>
				<Col xs={12} md={12}>
					<Image src={props.subImage} />
				</Col>
				<FormGroup
					bsClass="form-group"
					style={{
						width: '75%',
						textAlign: 'center',
						margin: '0 auto',
					}}
				>
					<ControlLabel style={{ color: 'white' }}>
						{props.title + ' '}
					</ControlLabel>
					<OverlayTrigger placement="bottom" overlay={overlay}>
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
					</OverlayTrigger>
				</FormGroup>
			</form>
		</Col>
	);
}
