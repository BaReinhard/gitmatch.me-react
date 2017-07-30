import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col } from 'react-bootstrap';
export default class GitMatchChart extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.props.chartClick(this.refs['me']);
	}
	render() {
		return (
			<Col md={12} xs={12}>
				<Doughnut
					data={this.props.chartData}
					options={this.props.chartOptions}
					ref={'me'}
					width={500}
					height={500}
				/>
			</Col>
		);
	}
}
