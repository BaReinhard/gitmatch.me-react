import React from 'react';

const styles = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	boxSizing: 'border-box',
	backgroundColor: 'rgba(0,0,0,0.8)',
	color: 'white',
	width: '100%',
	position: 'fixed',
	top: '10%',
	bottom: '10%',
	margin: '0 auto',
	zIndex: '150',
};
const RepoCard = props => {
	let background = 'white';
	if (props.user.topLanguages !== undefined) {
		return (
			<div style={styles}>
				<div
					style={{
						width: '100%',
						display: 'flex',
						top: '0',
						height: '10%',
					}}
				>
					{props.user.topLanguages.map((repo, i) => {
						if (i === props.index) {
							background = 'gray';
						} else {
							background = 'white';
						}
						return (
							<button
								className="btn btn-default"
								style={{
									flex: 1,
									justifyContent: 'center',
									alignSelf: 'center',
									textAlign: 'center',
									color: 'black',
									backgroundColor: background,
									border: '2px black solid',
									flexDirection: 'row',
									flexStretch: '1',
								}}
								key={i}
								onClick={props.changeIndex}
							>
								{repo.language}
							</button>
						);
					})}
				</div>
				<div
					style={{
						overflow: 'scroll',
						width: '100%',
						height: '80%',
					}}
				>
					<table className="table table-fixed">
						<tbody>
							{props.user.topLanguages[
								props.index
							].reposDetails.map((repo, i) => {
								return (
									<tr key={i}>
										<td className="col-sm-8">
											{repo.name}
										</td>
										<td className="col-sm-2">
											<i
												className="fa fa-star"
												aria-hidden="true"
											/>{' '}
											{repo.stargazers_count}
										</td>
										<td className="col-sm-2">
											<i
												className="fa fa-code-fork"
												aria-hidden="true"
											/>{' '}
											{repo.forks_count}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<button className="btn btn-default" onClick={props.close}>
					Close
				</button>
			</div>
		);
	} else if (props.user.matchingLanguages !== undefined) {
		return (
			<div style={styles}>
				{props.user.matchingLanguages[
					props.index
				].reposDetails.map(repo => {
					return <div>repo.name</div>;
				})}
				<button className="btn btn-default" onClick={props.close}>
					Close
				</button>
			</div>
		);
	} else {
		return <div />;
	}
};

export default RepoCard;
