import React from 'react';

const styles = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
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
};
const RepoCard = props => {
	if (props.user.topLanguages !== undefined) {
		return (
			<div style={styles}>
				{props.user.topLanguages[
					props.index
				].reposDetails.map((repo, i) => {
					return (
						<div key={i}>
							{repo.name}
						</div>
					);
				})}
				<button className="btn btn-default" onClick={props.close}>
					Close
				</button>
			</div>
		);
	} else if (props.user.matchingLanguages !== undefined) {
		return (
			<div style={styles}>
				{props.user.matchingLanguages[
					props.index
				].reposDetails.map(repo => {
					return <div>repo.name</div>;
				})}
				<button className="btn btn-default" onClick={props.close}>
					Close
				</button>
			</div>
		);
	} else {
		return <div />;
	}
};

export default RepoCard;
