import React from 'react';
import GitMatchChart from './chart';
import { Grid, Row, Col, Thumbnail } from 'react-bootstrap';

export default function GitMatchResultCard(props) {
	// Returns for User Searching for a match
	if (props.results && !props.nextMatch) {
		console.log(props);
		return (
			<div>
				<Grid>
					<Row>
						<Col xs={4} md={4}>
							<Thumbnail
								target="_blank"
								href={props.user.userData.html_url}
								src={props.user.userData.avatar_url}
								responsive
							/>
						</Col>
					</Row>
				</Grid>
				<h3>Match</h3>
				<h4>
					{props.user.userData.login}
				</h4>
				<h3>Stars</h3>
				<p>
					{props.user.stars}
				</p>
				<GitMatchChart
					chartData={props.chartData.data}
					chartOptions={props.chartData.options}
					chartClick={props.chartClick}
				/>
				<hr />
			</div>
		);
		// Returns for Matched Users
	} else if (props.nextMatch && props.results) {
		return (
			<div key={props.key}>
				<div className="row container">
					{props.index > 0
						? <button
								className="btn btndefault"
								onClick={props.previousMatch}
							>
								Previous
							</button>
						: <div />}
					{props.index < props.maxIndex
						? <button
								style={{ float: 'right' }}
								className="btn btndefault"
								onClick={props.nextMatch}
							>
								Next
							</button>
						: <div />}
				</div>
				<Grid>
					<Row>
						<Col xs={4} md={4}>
							<Thumbnail
								target="_blank"
								href={props.user.userData.html_url}
								src={props.user.userData.avatar_url}
								responsive
							/>
						</Col>
					</Row>
				</Grid>
				<h3>Top Match</h3>
				<h4>
					{props.user.userData.login}
				</h4>
				<h3>Stars</h3>
				<p>
					{props.user.stars === false
						? <button
								className="btn btn-info"
								onClick={props.getMyStars}
							>
								Update My Stars
							</button>
						: props.user.stars === 'error'
							? <span>
									{' '}<button
										className="btn btn-info"
										onClick={props.getMyStars}
									>
										Update My Stars
									</button>
									<span>
										There was an error retrieving{' '}
										{props.user.userData.login}'s stars,
										Unfortunately,{' '}
										<a
											href={`http://git-awards.com/users/search?login=${props
												.user.userData.login}`}
										>
											Git-Awards
										</a>{' '}
										doesn't have their data on file
									</span>
								</span>
							: props.user.stars}
				</p>
				<h3>Score</h3>
				<p>
					{props.user.score}
				</p>
				<GitMatchChart
					getRefs={props.getRefs}
					chartData={props.chartData.data}
					chartOptions={props.chartData.options}
					chartClick={props.chartClick}
				/>

				<hr />
			</div>
		);
	} else {
		return <div />;
	}
}
