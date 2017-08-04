import React from 'react';
import GitMatchResultCard from './resultcard';
import Chart from '../common/chart';
import { Col, Grid } from 'react-bootstrap';

export default function GitMatchResults(props) {
	let results;
	if (!props.results & !props.loading) {
		results = <div />;
	} else {
		results = (
			<Grid>
				<Col md={12} style={{ color: 'black' }}>
					<Chart
						chartData={props.chartData.LocationMatchUser.data}
						chartOptions={props.chartData.LocationMatchUser.options}
					/>
					<Chart chartData={props.chartData.StarMatchUser.data} chartOptions={props.chartData.StarMatchUser.options} />
				</Col>
			</Grid>
		);
	}
	return results;
}
