import React from 'react';
import GitMatchResultCard from './resultcard';
import { Col, Grid } from 'react-bootstrap';
import PseudoAfter from '../common/pseudoAfter';

export default function GitMatchResults(props) {
	let results;
	if (!props.results & !props.loading) {
		results = <div />;
	} else {
		results = (
			<div id="results-match">
				<GitMatchResultCard
					key={null}
					user={props.GitMatchUser}
					chartData={props.chartData.GitMatchUser}
					getMyStars={props.getMyStars}
					results={props.results}
					bindRef={props.bindRef}
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
					bindRef={props.bindRef}
				/>
				<PseudoAfter background={props.background} />
			</div>
		);
	}
	return results;
}
