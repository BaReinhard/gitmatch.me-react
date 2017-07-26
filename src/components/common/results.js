import React from 'react';
import GitMatchResultCard from './resultcard';

export default function GitMatchResults(props) {
	let results;
	if (!props.results & !props.loading) {
		results = <h3>Search with a UserName</h3>;
	} else {
		results = (
			<div>
				<GitMatchResultCard key={null} user={props.GitMatchUser} />
				{props.results
					? props.MatchingUsers.map((user, key) => {
							return <GitMatchResultCard key={key} user={user} />;
						})
					: <h3>
							{props.loading ? 'Loading...' : 'Search A UserName'}
						</h3>}
			</div>
		);
	}
	return results;
}
