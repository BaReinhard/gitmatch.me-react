import React from 'react';
import GitMatchResultCard from './resultcard';
import { Col, Grid } from 'react-bootstrap';

export default function GitMatchResults(props) {
	let results;
	if (!props.results & !props.loading) {
		results = <div />;
	} else {
		results = (
			<Grid>
				<Col md={12} style={{ color: 'black' }}>
					<GitMatchResultCard
						key={null}
						user={props.GitMatchUser}
						chartData={props.chartData.GitMatchUser}
						results={props.results}
						chartClick={props.chartClick}
						setClass={props.setClass}
						unsetClass={props.unsetClass}
					/>

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
			</Grid>
		);
	}
	return results;
}
