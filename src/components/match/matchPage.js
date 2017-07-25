import React from 'react';
import http from 'axios';
import { GEOCODING, ACCESS_TOKEN } from '../../.constants';

const headers = {
	Authorization: `token ${ACCESS_TOKEN}`,
};
export class MatchPageComponent extends React.Component {
	constructor(state, context) {
		super(state, context);
		this.state = {
			username: '',
			GitMatchUser: {
				userData: {},
				repos: [],
				topLanguages: [],
				uniqueLang: {},
			},
			MatchingUsers: [
				{
					userData: {},
					reponse: [],
					uniqueLang: {},
					score: 0,
				},
			],
		};
	}
	// Submit Handler
	GitMatch = event => {
		// Prevent Redirection
		event.preventDefault();

		// Get the users userData and repos
		this.getUserRepoData(this.state.username).then(userResponse => {
			// Set GitMatchUsers (user that is searching) data to state
			this.setState({
				GitMatchUser: {
					userData: userResponse.userData,
					repos: userResponse.repos,
				},
			});
			// Use Google API to get location
			this.getLocation(
				this.state.GitMatchUser.userData.location,
			).then(locationResponse => {
				this.getGitMatchUserLanguages(
					this.state.GitMatchUser.repos,
				).then(languageResponse => {
					this.setState({
						GitMatchUser: {
							userData: this.state.GitMatchUser.userData,
							repos: this.state.GitMatchUser.repos,
							topLanguages: languageResponse.topLanguages,
							uniqueLang: languageResponse.uniqueLang,
						},
					});
					this.getMatchedUsers(
						locationResponse,
						this.createLanguageToken(
							this.state.GitMatchUser.topLanguages,
						),
					).then(responses => {
						this.setState({
							MatchingUsers: responses,
						});
						console.log(this.state.MatchingUsers);
					});
				});
			});
		});
	};
	getMatchedUsers = (location, languageToken) => {
		return new Promise((resolve, reject) => {
			let promises = [];
			let usersData = [];
			promises.push(
				http
					.get(
						`https://api.github.com/search/users?q=location:${this.encode(
							location,
						)}${languageToken}`,
						{ headers: headers },
					)
					.then(usersResponse => {
						usersResponse.data.items.forEach(user => {
							promises.push(
								this.getUserRepoData(user.login).then(newResponse => {
									usersData.push(newResponse);
								}),
							);
						});
						Promise.all(promises).then(responses => {
							usersData.forEach(data => {
								let repoScore = 0;
								data.matchingLanguages = {};
								data.repos.forEach(repo => {
									if (
										this.state.GitMatchUser.uniqueLang[
											repo.language
										] !== undefined
									) {
										// console.log(data.matchingLanguages);
										if (
											data.matchingLanguages[repo.language] ===
											undefined
										) {
											repoScore =
												repoScore +
												this.state.GitMatchUser.uniqueLang[
													repo.language
												] *
													100;
											data.matchingLanguages[repo.language] = 1;
										} else {
											repoScore =
												repoScore +
												1 *
													this.state.GitMatchUser.uniqueLang[
														repo.language
													];
											data.matchingLanguages[repo.language] =
												data.matchingLanguages[repo.language] + 1;
										}
									}
								});
								data.score = Math.floor(
									Math.log(repoScore) * 10.1231234113,
								);
								let matchingLanguagesHolder = [];
								for (var key in data.matchingLanguages) {
									// skip loop if the property is from prototype
									if (!data.matchingLanguages.hasOwnProperty(key))
										continue;
									matchingLanguagesHolder.push({
										language: key,
										count: data.matchingLanguages[key],
									});
								}
								data.matchingLanguages = matchingLanguagesHolder;
								data.matchingLanguages.sort((a, b) => {
									if (a.count < b.count) {
										return 1;
									} else if (a.count > b.count) {
										return -1;
									} else {
										return 0;
									}
								});
							});
							usersData.sort((a, b) => {
								if (a.score < b.score) {
									return 1;
								} else if (a.score > b.score) {
									return -1;
								} else {
									return 0;
								}
							});
							resolve(usersData);
						});
					}),
			);
		});
	};
	createLanguageToken = languages => {
		let languageToken = '';
		languages.forEach(language => {
			languageToken += `+language:${this.encode(language.language)}`;
		});
		return languageToken;
	};
	getGitMatchUserLanguages = repos => {
		return new Promise((resolve, reject) => {
			let topLanguages = [];
			let uniqueLang = {};
			// Loop through repos to create a uniqelanguage object to parse into an array
			repos.forEach(repo => {
				if (
					uniqueLang[repo.language] === undefined &&
					repo.language !== null
				) {
					uniqueLang[repo.language] = 1;
				} else if (repo.language !== null) {
					uniqueLang[repo.language]++;
				}
			});
			// Loop through Object to create Top Language Array
			for (var key in uniqueLang) {
				// skip loop if the property is from prototype
				if (!uniqueLang.hasOwnProperty(key)) continue;
				topLanguages.push({
					language: key,
					count: uniqueLang[key],
				});
			}
			//Sort Langauges array descending from most to least
			topLanguages.sort((a, b) => {
				if (a.count < b.count) {
					return 1;
				} else if (a.count > b.count) {
					return -1;
				} else {
					return 0;
				}
			});
			// Return Top Languages and uniqueLanges
			resolve({
				topLanguages: topLanguages,
				uniqueLang: uniqueLang,
			});
		});
	};
	getUserRepoData = username => {
		// Return a promise, and implement dependency injection to reuse for matched users
		return new Promise((resolve, reject) => {
			let promises = [];
			promises.push(
				http.get(`https://api.github.com/users/${username}`, {
					headers: headers,
				}),
			);
			promises.push(
				http.get(
					`https://api.github.com/users/${username}/repos?page=1&per_page=100`,
					{ headers: headers },
				),
			);
			// Check Response Data for whether response index is a repo list or userData
			Promise.all(promises).then(response => {
				if (Array.isArray(response[0].data)) {
					// Resolve the Object aka Return as response to promise
					resolve({
						userData: response[1].data,
						repos: response[0].data,
					});
				} else {
					// Resolve the Object aka Return as response to promise
					resolve({
						userData: response[0].data,
						repos: response[1].data,
					});
				}
			});
		});
	};
	// Encode function to encode str to URI component
	encode = str => {
		return encodeURIComponent(str);
	};
	// Use google API to get correct
	getLocation = location => {
		location = this.encode(location.toLowerCase());
		console.log(location);
		return http
			.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODING}`,
			)
			.then(response => {
				return response.data.results[0].address_components[0].short_name.toLowerCase();
			});
	};
	input = event => {
		this.setState({
			username: event.target.value,
		});
	};
	select = event => {
		event.target.select();
	};

	render() {
		return (
			<div>
				<form className="" onSubmit={this.GitMatch}>
					<label htmlFor="username">
						Get matched with nearby developers instantly!
					</label>
					<input
						name="username"
						type="text"
						value={this.state.username}
						className="form-control"
						onChange={this.input}
						onClick={this.select}
					/>

					<button type="submit" className="btn btn-primary">
						<span className="glyphicon glyphicon-plus" />Match Me
					</button>
				</form>
			</div>
		);
	}
}
