import React from 'react';

export default function GitMatchResultCard(props) {
	if (props.user.score === undefined && props.user.topLanguages) {
		console.log(props.user);
		return (
			<div>
				<h3>Match</h3>
				<h4>
					{props.user.userData.login}
				</h4>
				{props.user.topLanguages.map(lang => lang.language)}
				<hr />
			</div>
		);
	} else if (props.key !== null) {
		return (
			<div key={props.key}>
				<h3>Top Match</h3>
				<h4>
					{props.user.userData.login}
				</h4>

				<h3>Score</h3>
				<p>
					{props.user.score}
				</p>
				<hr />
			</div>
		);
	} else {
		return <div />;
	}
}
