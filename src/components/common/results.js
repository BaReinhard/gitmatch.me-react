import React from 'react';
import GitMatchResultCard from './resultcard';
import { Col } from 'react-bootstrap';

export default function GitMatchResults(props) {
	let results;
	console.log(props);
	if (!props.results & !props.loading) {
		results = <div />;
	} else {
		results = (
			<div className="container" style={{ color: 'black' }}>
				<Col md={6} xs={12}>
					<GitMatchResultCard
						key={null}
						user={props.GitMatchUser}
						chartData={props.chartData.GitMatchUser}
						results={props.results}
						chartClick={props.chartClick}
					/>
				</Col>
				<Col md={6} xs={12}>
					<GitMatchResultCard
						index={props.index}
						getMyStars={props.getMyStars}
						maxIndex={props.maxIndex}
						nextMatch={props.nextMatch}
						previousMatch={props.previousMatch}
						user={props.MatchingUsers[props.index]}
						chartData={props.chartData.MatchedUser}
						results={props.results}
						chartClick={props.chartClick}
					/>
				</Col>
			</div>
		);
	}
	return results;
}
