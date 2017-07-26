import React from 'react';
import GitMatchResultCard from './resultcard';

export default function GitMatchResults(props) {
	let results;
	if (!props.results & !props.loading) {
		results = <h3>Search with a UserName</h3>;
	} else {
		results = (
			<div>
				<GitMatchResultCard
					key={null}
					user={props.GitMatchUser}
					chartData={props.chartData.GitMatchUser}
					results={props.results}
				/>

				<GitMatchResultCard
					user={props.MatchingUsers[0]}
					chartData={props.chartData.MatchedUser}
					results={props.results}
				/>
			</div>
		);
	}
	return results;
}
