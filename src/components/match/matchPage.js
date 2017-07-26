import React from 'react';
import http from 'axios';
import GitMatchForm from '../common/form';
import GitMatchResults from '../common/results';
import { GEOCODING, ACCESS_TOKEN, COLORS } from '../../.constants';

const headers = {
	Authorization: `token ${ACCESS_TOKEN}`,
};
export class MatchPageComponent extends React.Component {
	constructor(state, context) {
		super(state, context);
		this.state = {
			chartData: {
				GitMatchUser: {},
				MatchedUser: {},
			},
			results: false, // Used to Display Results Div on completion
			loadingText: '', // Text to display what the algorihtm is doing throughout the loading process
			username: '', // Input data, used to search for user
			loading: false, // Used to Display Loading Icons/Dialog/etc
			GitMatchUser: {
				userData: {}, // Object Returned from api.github.com/users/username
				repos: [], // Array Returned from api.github.com/users/username/repos?page=1&page_size=100
				topLanguages: [], // Array of objects in the form of {language:"JavaScript",count:2}, based on how many repos with a spec lang
				uniqueLang: {}, // An Object used to create the topLanguages array in the form of {JavaScript: 3, Shell:4, C#:2};
			},
			MatchingUsers: [
				{
					userData: {}, // Object Returned from api.github.com/users/username
					repos: [],
					matchingLanguages: {},
					score: 0,
				},
			],
		};
	}
	// Submit Handler, main function that goes through the logic of finding user and matches
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
				loadingText:
					'Insert Update about What the algorithm is doing, to display to user on loading screen',
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
		this.genChart(
			this.state.GitMatchUser.topLanguages,
			this.state.MatchingUsers[0].matchingLanguages,
		);
		// Update State and Display New Matches
		this.setState({
			results: true,
			loading: false,
		});

		console.log(this.state.GitMatchUser, this.state.MatchingUsers[0]);
		console.log(this.state.chartData);
	};
	genChart = (gituserdata, gitmatchdata) => {
		let gituserdatas = [],
			gitusercolors = [];
		let gitmatchdatas = [],
			gitmatchcolors = [];
		let gitmatchlabels = [];
		let gituserlabels = [];
		// Gen GitUser Chart
		gituserdata.forEach(d => {
			gituserdatas.push(d.count);
			gitusercolors.push(COLORS[d.language].color);
			gituserlabels.push(d.language);
		});

		// Gen GitMatch Chart
		gitmatchdata.forEach(d => {
			gitmatchdatas.push(d.count);
			gitmatchcolors.push(COLORS[d.language].color);
			gitmatchlabels.push(d.language);
		});

		this.setState({
			chartData: {
				GitMatchUser: {
					data: {
						labels: gituserlabels,
						datasets: [
							{
								label: 'My First dataset',
								data: gituserdatas,
								backgroundColor: gitusercolors,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
					},
				},
				MatchedUser: {
					data: {
						labels: gitmatchlabels,
						datasets: [
							{
								label: 'My First dataset',
								data: gitmatchdatas,
								backgroundColor: gitmatchcolors,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
					},
				},
			},
		});
	};
	// Async Function that searchs github for users based on location and specific languages
	getMatchedUsers = async (location, languageToken) => {
		let promises = [];
		let usersData = [];
		let usersResponse = await http.get(
			`https://api.github.com/search/users?q=location:${this.encode(
				location,
			)}${languageToken}`,
			{ headers: headers },
		);
		// Create usersData array of user objects form of {userData:{},repos:{}}
		usersResponse.data.items.forEach(user => {
			promises.push(
				this.getUserRepoData(user.login).then(newResponse => {
					usersData.push(newResponse);
				}),
			);
		});
		// Wait for All HTTP requests to finish before parsing the usersData array to create matching Languages and scores for each User
		await Promise.all(promises);
		// Parse array to create a Score for each user
		usersData.forEach(data => {
			let repoScore = 0;
			data.matchingLanguages = {};
			data.repos.forEach(repo => {
				if (
					this.state.GitMatchUser.uniqueLang[repo.language] !==
					undefined
				) {
					// Check to see if this language has been used to calc repo score
					// This algorihthm takes into account Unique Languages and matching top languages
					if (data.matchingLanguages[repo.language] === undefined) {
						// if it hasn't give a weighted score for a newly matched language (weighted heavier than each additional repo lang)
						repoScore =
							repoScore +
							this.state.GitMatchUser.uniqueLang[repo.language] * 100;
						data.matchingLanguages[repo.language] = 1;
						// if it has, give a slightly less weighted score
					} else {
						repoScore =
							repoScore +
							1 * this.state.GitMatchUser.uniqueLang[repo.language];
						data.matchingLanguages[repo.language] =
							data.matchingLanguages[repo.language] + 1;
					}
				}
			});
			// Level the score with a natural log and multiply by the gitmatch factor and floor it to a nice integer
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
			// Create a matchingLanguages property on matchedUsers object and give the value of the array of matchingLanguages
			data.matchingLanguages = matchingLanguagesHolder;
			// Sort the matching Languages array in descending order
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
		// Finally sort the array of matchedUser objects in descending order by score
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

	// Function to create a language token for use with the github api search for top users
	createLanguageToken = languages => {
		// create an empty token
		let languageToken = '';
		// then append each unique language to the token, encoding the language, so that
		// languages such as 'C#' or 'C++' dont get viewed as if it were 'C',
		// additionally this encoding prevents the need to parse multi word languages with a dash
		languages.forEach(language => {
			languageToken += `+language:${this.encode(language.language)}`;
		});
		return languageToken;
	};
	// Find unique languages for the GitMatchUser, (person searching)
	getGitMatchUserLanguages = async repos => {
		// Wrap in promise to allow for await keyword to work in main function call
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
	// Async function that gets userdata and repo data for each username
	getUserRepoData = async username => {
		// Get UserData, and wait for it to return before getting repos
		let userResponse = await http.get(
			`https://api.github.com/users/${username}`,
			{
				headers: headers,
			},
		);
		// Check to see that the response is valid, if it is then get repos
		if (userResponse.status === 200) {
			// await promise to resolve
			let reposResponse = await http.get(
				`https://api.github.com/users/${username}/repos?page=1&per_page=100`,
				{ headers: headers },
			);
			// then return an object literal with the properties userData and repos
			return {
				userData: userResponse.data,
				repos: reposResponse.data,
			};
		} else {
			console.log(userResponse.status);
			// if status isn't 200, handle custom error message
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
		// Encode location to lowercase, no longer need to parse location if multiword location
		location = this.encode(location.toLowerCase());

		// await reponse, then return decided value
		let response = await http.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODING}`,
		);
		return response.data.results[0].address_components[0].short_name.toLowerCase();
	};
	// Handles each input on the form and sets it to state
	input = event => {
		this.setState({
			username: event.target.value,
		});
	};
	// Allows for full text highlighting on a single click
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
				<GitMatchResults
					GitMatchUser={this.state.GitMatchUser}
					results={this.state.results}
					loading={this.state.loading}
					MatchingUsers={this.state.MatchingUsers}
					chartData={this.state.chartData}
				/>
			</div>
		);
	}
}
