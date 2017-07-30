import React from 'react';
import {
	Button,
	ButtonToolbar,
	Tabs,
	Tab,
	ButtonGroup,
	Modal,
} from 'react-bootstrap';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
const styles = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	boxSizing: 'border-box',
	backgroundColor: 'rgba(0,0,0,0.8)',
	color: 'white',
	width: '100%',
	position: 'fixed',
	top: '10%',
	bottom: '10%',
	margin: '0 auto',
	zIndex: '150',
	display: 'flex',
	justifyContent: 'space-around',
};

const RepoCard = props => {
	let background = 'white';
	console.log(props.user.topLanguages);
	if (props.user.topLanguages !== undefined) {
		return (
			<Modal show={true} dialogClassName="custom-modal">
				<Tabs
					activeKey={props.index}
					onSelect={props.changeIndex}
					id={props.user.userData.login}
				>
					{props.user.topLanguages.map((repo, i) => {
						return (
							<Tab
								title={repo.language}
								key={i + repo.language + 'language'}
								eventKey={i}
								onClick={props.changeIndex}
							/>
						);
					})}
				</Tabs>

				<div
					style={{
						overflow: 'scroll',
						width: '100%',
						height: '80%',
					}}
				>
					<table className="table table-fixed">
						<tbody>
							{props.user.topLanguages[
								props.index
							].reposDetails.map((repo, i) => {
								return (
									<tr key={i}>
										<td className="col-sm-8">
											<i
												className="fa fa-github"
												aria-hidden="true"
											/>{' '}
											<a target="_blank" href={repo.html_url}>
												{repo.name}
											</a>
										</td>
										<td className="col-sm-2">
											<i
												className="fa fa-star"
												aria-hidden="true"
											/>{' '}
											{repo.stargazers_count}
										</td>
										<td className="col-sm-2">
											<i
												className="fa fa-code-fork"
												aria-hidden="true"
											/>{' '}
											{repo.forks_count}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<Modal.Footer>
					<ButtonToolbar>
						<Button bsStyle="default" onClick={props.close}>
							Close
						</Button>
					</ButtonToolbar>
				</Modal.Footer>
			</Modal>
		);
	} else if (props.user.matchingLanguages !== undefined) {
		console.log('matching', props.user.matchingLanguages);
		return (
			<Modal show={true} dialogClassName="custom-modal">
				<Tabs
					activeKey={props.index}
					onSelect={props.changeIndex}
					id={props.user.userData.login}
				>
					{props.user.matchingLanguages.map((repo, i) => {
						return (
							<Tab
								title={repo.language}
								key={i + repo.language + 'language'}
								eventKey={i}
								onClick={props.changeIndex}
							/>
						);
					})}
				</Tabs>

				<div
					style={{
						overflow: 'scroll',
						width: '100%',
						height: '80%',
					}}
				>
					<table className="table table-fixed">
						<tbody>
							{props.user.matchingLanguages[
								props.index
							].reposDetails.map((repo, i) => {
								return (
									<tr key={i}>
										<td className="col-sm-8">
											<i
												className="fa fa-github"
												aria-hidden="true"
											/>{' '}
											<a target="_blank" href={repo.html_url}>
												{' '}{repo.name}
											</a>
										</td>
										<td className="col-sm-2">
											<i
												className="fa fa-star"
												aria-hidden="true"
											/>{' '}
											{repo.stargazers_count}
										</td>
										<td className="col-sm-2">
											<i
												className="fa fa-code-fork"
												aria-hidden="true"
											/>{' '}
											{repo.forks_count}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<Modal.Footer>
					<ButtonToolbar>
						<Button bsStyle="default" onClick={props.close}>
							Close
						</Button>
					</ButtonToolbar>
				</Modal.Footer>
			</Modal>
		);
	} else {
		return <div />;
	}
};

export default RepoCard;
