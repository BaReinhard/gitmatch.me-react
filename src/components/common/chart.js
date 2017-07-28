import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default class GitMatchChart extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.props.chartClick(this.refs['me']);
	}
	render() {
		return (
			<Doughnut
				data={this.props.chartData}
				options={this.props.chartOptions}
				ref={'me'}
				width={600}
				height={250}
			/>
		);
	}
}
