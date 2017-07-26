import React from 'react';
import GitMatchChart from './chart';

export default function GitMatchResultCard(props) {
	console.log('PROPS');
	console.log(props);
	if (props.results) {
		console.log(props);
		return (
			<div>
				<h3>Match</h3>
				<h4>
					{props.user.userData.login}
				</h4>
				<GitMatchChart
					chartData={props.chartData.data}
					chartOptions={props.chartData.options}
				/>
				<hr />
			</div>
		);
	} else if (props.key !== null && props.results) {
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
				<GitMatchChart
					chartData={props.chartData.data}
					chartOptions={props.chartData.options}
				/>

				<hr />
			</div>
		);
	} else {
		return <div />;
	}
}
