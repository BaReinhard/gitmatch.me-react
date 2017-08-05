import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col } from 'react-bootstrap';
export default class GitMatchChart extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		if (this.props.bindRef !== undefined) {
			this.props.bindRef(this.refs[this.props.refName], this.props.refName);
		}
	}

	render() {
		return this.props.chartData !== undefined
			? <Col md={12} xs={12}>
					<Doughnut
						data={this.props.chartData}
						options={this.props.chartOptions}
						ref={this.props.refName}
						width={500}
						height={500}
					/>
				</Col>
			: <div />;
	}
}
