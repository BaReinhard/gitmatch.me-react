import React from 'react';
import http from 'axios';
import GitMatchForm from '../common/form';
import { GEOCODING, ACCESS_TOKEN } from '../../.constants';

const headers = {
	Authorization: `token ${ACCESS_TOKEN}`,
};
export class MatchPageComponent extends React.Component {
	constructor(state, context) {
		super(state, context);
		this.state = {
			results: false,
			username: '',
			loading: false,
			GitMatchUser: {
				userData: {},
				repos: [],
				topLanguages: [],
				uniqueLang: {},
			},
			MatchingUsers: [
				{
					userData: {},
					repos: [],
					matchingLanguages: {},
					score: 0,
				},
			],
		};
	}
	// Submit Handler
	GitMatch = async event => {
		this.setState({ loading: true });
		// Prevent Redirection
		event.preventDefault();

		// Get the users userData and repos
		let userResponse = await this.getUserRepoData(
			this.state.username,
		);
		// Set GitMatchUsers (user that is searching) data to state
		this.setState({
			GitMatchUser: {
				userData: userResponse.userData,
				repos: userResponse.repos,
			},
		});
		// Use Google API to get location
		let locationResponse = await this.getLocation(
			this.state.GitMatchUser.userData.location,
		);
		// Get Languages to search on
		let languageResponse = await this.getGitMatchUserLanguages(
			this.state.GitMatchUser.repos,
		);

		// Set GitMatchUser State
		this.setState({
			GitMatchUser: {
				userData: this.state.GitMatchUser.userData,
				repos: this.state.GitMatchUser.repos,
				topLanguages: languageResponse.topLanguages,
				uniqueLang: languageResponse.uniqueLang,
			},
		});

		// Get Matched  Users and Rank them
		let matchUsersResponse = await this.getMatchedUsers(
			locationResponse,
			this.createLanguageToken(this.state.GitMatchUser.topLanguages),
		);
		this.setState({
			MatchingUsers: matchUsersResponse,
		});
		this.setState({
			results: true,
			loading: false,
		});
	};
	getMatchedUsers = async (location, languageToken) => {
		let promises = [];
		let usersData = [];
		let usersResponse = await http.get(
			`https://api.github.com/search/users?q=location:${this.encode(
				location,
			)}${languageToken}`,
			{ headers: headers },
		);
		console.log('user response', usersResponse);
		usersResponse.data.items.forEach(user => {
			promises.push(
				this.getUserRepoData(user.login).then(newResponse => {
					usersData.push(newResponse);
				}),
			);
		});
		await Promise.all(promises);
		usersData.forEach(data => {
			let repoScore = 0;
			data.matchingLanguages = {};
			data.repos.forEach(repo => {
				if (
					this.state.GitMatchUser.uniqueLang[repo.language] !==
					undefined
				) {
					// console.log(data.matchingLanguages);
					if (data.matchingLanguages[repo.language] === undefined) {
						repoScore =
							repoScore +
							this.state.GitMatchUser.uniqueLang[repo.language] * 100;
						data.matchingLanguages[repo.language] = 1;
					} else {
						repoScore =
							repoScore +
							1 * this.state.GitMatchUser.uniqueLang[repo.language];
						data.matchingLanguages[repo.language] =
							data.matchingLanguages[repo.language] + 1;
					}
				}
			});
			data.score = Math.floor(Math.log(repoScore) * 10.1231234113);
			let matchingLanguagesHolder = [];
			for (var key in data.matchingLanguages) {
				// skip loop if the property is from prototype
				if (!data.matchingLanguages.hasOwnProperty(key)) continue;
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
		return usersData;
	};

	createLanguageToken = languages => {
		let languageToken = '';
		languages.forEach(language => {
			languageToken += `+language:${this.encode(language.language)}`;
		});
		return languageToken;
	};
	getGitMatchUserLanguages = async repos => {
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
				topLanguages,
				uniqueLang,
			});
		});
	};
	getUserRepoData = async username => {
		// Return a promise, and implement dependency injection to reuse for matched users

		let userResponse = await http.get(
			`https://api.github.com/users/${username}`,
			{
				headers: headers,
			},
		);
		if (userResponse.status === 200) {
			let reposResponse = await http.get(
				`https://api.github.com/users/${username}/repos?page=1&per_page=100`,
				{ headers: headers },
			);
			return {
				userData: userResponse.data,
				repos: reposResponse.data,
			};
		} else {
			this.errorHandler('Could not get username');
		}

		// Check Response Data for whether response index is a repo list or userData
	};
	// Encode function to encode str to URI component
	encode = str => {
		return encodeURIComponent(str);
	};
	// Use google API to get correct
	getLocation = async location => {
		location = this.encode(location.toLowerCase());

		let response = await http.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODING}`,
		);
		return response.data.results[0].address_components[0].short_name.toLowerCase();
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
				<GitMatchForm
					GitMatch={this.GitMatch}
					select={this.select}
					input={this.input}
					username={this.state.username}
				/>
				{this.state.results
					? this.state.MatchingUsers.map((user, key) => {
							return (
								<div key={key}>
									<h3>Top Match</h3>
									<h4>
										{user.userData.login}
									</h4>
									<h3>Score</h3>
									<p>
										{user.score}
									</p>
									<hr />
								</div>
							);
						})
					: <h3>
							{this.state.loading
								? 'Loading...'
								: 'Search A UserName'}
						</h3>}
			</div>
		);
	}
}
