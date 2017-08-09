import React from 'react';
import GitMatchResultCard from './resultcard';
import Chart from '../common/chart';
import PseudoAfter from '../common/pseudoAfter';
import { Col, Grid } from 'react-bootstrap';

export default function GitMatchResults(props) {
	let results;

	if (!props.results & !props.loading) {
		results = <div />;
	} else {
		results = (
			<div id="results-location">
				<GitMatchResultCard
					id="results-location-card"
					user={props.LocationMatchUser}
					bindRef={props.bindRef}
					chartData={props.chartData.LocationMatchUser}
					results={props.results}
					refName={'Location'}
					index={props.locationIndex}
					maxIndex={props.maxLocationIndex}
				/>
				<GitMatchResultCard
					id="results-location-card"
					user={props.StarMatchUser}
					bindRef={props.bindRef}
					chartData={props.chartData.StarMatchUser}
					results={props.results}
					refName={'Star'}
					index={props.starIndex}
					maxIndex={props.maxStarIndex}
				/>
				<PseudoAfter background={props.background} />
			</div>
		);
	}
	return results;
}
