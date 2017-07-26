import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default class GitMatchChart extends React.Component {
	render() {
		return (
			<Doughnut
				data={this.props.chartData}
				options={this.props.chartOptions}
				width={600}
				height={250}
			/>
		);
	}
}
