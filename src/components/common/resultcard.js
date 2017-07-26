import React from 'react';

export default function GitMatchResultCard(props) {
	if (props.user.score === undefined) {
		return (
			<div>
				<h3>Match</h3>
				<h4>
					{props.user.userData.login}
				</h4>

				<hr />
			</div>
		);
	} else {
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
	}
}
