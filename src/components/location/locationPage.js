import React from 'react';
import http from 'axios';
import GitLocation from './form';
import GitLocationResults from './results';
import { Modal, Grid } from 'react-bootstrap';
import { GEOCODING, ACCESS_TOKEN, COLORS } from '../../.constants';
import LoadingModal from '../common/loading';
import OverlayModal from '../common/overlay';
import RepoCard from '../common/repocard';
import Logo from '../../img/gitmatch-logo.png';
import subLogo from '../../img/gitmatchlogo.png';
import background from '../../img/background.jpg';
import Scroll from 'react-scroll';
// Create Default headers
const headers = {
	Authorization: `token ${ACCESS_TOKEN}`,
};
// Create default state to use in constructor and clearState()
const defaultState = {
	defaultShownLanguages: ['JavaScript', 'Python', 'C'],
	location: '',
	selectedLanguages: [],
	topLocationUsers: [],
	topMatchUsers: [],
	chartData: {},
	chartRefs: [],
};
export class LocationPageComponent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = { defaultState };
	}
	encode = str => {
		return encodeURIComponent(str);
	};
	// Clear/update Current State, when called without props use defaultState
	updateState = (state = defaultState) => {
		this.setState({ state });
	};
	// Use google API to get correct
	getLocation = async location => {
		// Encode location to lowercase, no longer need to parse location if multiword location
		try {
			location = this.encode(location.toLowerCase());

			// await reponse, then return decided value
			let response = await http.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODING}`,
			);
			let local = {};
			local.neighborhood = undefined;
			local.city = undefined;
			response.data.results[0].address_components.forEach(loca => {
				if (loca.types[0] === 'locality') {
					local.city = this.encode(loca.short_name.toLowerCase());
				} else if (loca.types[0] === 'neighborhood') {
					local.neighborhood = this.encode(loca.short_name.toLowerCase());
				}
			});
			return local;
		} catch (err) {
			throw err;
		}
	};
	handleLocationInput = event => {
		this.setState({ location: event.target.value });
	};
	// Prevent Language Submission from refreshing page, and sets state to update selected languages
	// then clear language input
	handleLanguageSubmit = event => {
		event.preventDefault();
		let language = this.encode(event.target.value);
		this.setState((prevState, props) => ({
			// Spread operator to merge arrays in an immutable way
			selectedLanguages: [...prevState.selectedLanguages, language],
			language: '',
		}));
	};
	// Handles Language Input Box, and updates state
	handleLanguageInput = event => {
		this.setState({ language: event.target.value });
	};
	// create the search token for the github api
	createSearchToken = (
		location = { city: 'los%20angeles', neighborhood: undefined },
		selectedLanguages = this.state.defaultShownLanguages,
	) => {
		let LocationParam = '';
		if (location.neighborhood !== undefined) {
			LocationParam = location.neighborhood;
		} else if (location.city !== undefined) {
			LocationParam = location.city;
		} else {
			LocationParam = 'los%20angeles';
		}
		let token = `location:${LocationParam}`;
		selectedLanguages.forEach(lang => (token += `+location:${lang}`));
		return token;
	};
	getUserRepoData = async (username, index = 0, stars = undefined) => {
		// Get UserData, and wait for it to return before getting repos
		let starsResponse = false;
		let userResponse = await http.get(`https://api.github.com/users/${username}`, {
			headers: headers,
		});

		// await promise to resolve
		let reposResponse = await http.get(`https://api.github.com/users/${username}/repos?page=1&per_page=100`, {
			headers: headers,
		});
		if (index < 5 && stars === undefined) {
			starsResponse = await http
				.get(`https://crossorigin.me/http://git-awards.com/api/v0/users/${username}`)
				.then(response => {
					let stars = 0;
					response.data.user.rankings.forEach(rank => {
						stars += rank.stars_count;
					});
					return stars;
				})
				.catch(err => {
					return false;
				});
		} else if (stars !== undefined) {
			starsResponse = stars;
		}
		return {
			userData: userResponse.data,
			repos: reposResponse.data,
			stars: starsResponse,
		};
	};
	getStarMatchUsers = async (searchToken = '') => {
		try {
			let usersResponse = this.http.get(`https://api.github.com/search/users?q=${searchToken}`);
			// Get UserData and Repos, starts the promises concurrently, and stores them synchronously
			let promises = usersResponse.items.map((user, index) => {
				this.getUserRepoData(user.login, index).then(res => res);
			});
			let localUsers = [];
			// Iterate over them in order and await for each to return,
			// this preserves GitHubs internal search order
			for (let promise of promises) {
				localUsers.push(await promise);
			}
			return localUsers;
		} catch (err) {
			throw err;
		}
	};
	getTopStarNames = async (location = 'los%20angeles', topLanguage) => {
		try {
			if (location !== undefined) {
				let locationTopStarUsers = this.http(
					`https://crossorigin.me/http://git-awards.com/api/v0/users?city=${location}&language=${topLanguage}`,
				);
				return locationTopStarUsers.users;
			} else {
				throw new Error('Could not find a city');
			}
		} catch (err) {
			throw err;
		}
	};
	getTopStarsData = async (users, index = 1000) => {
		let topStarsUsers = [];
		let promises = users.map(user => this.getUserRepoData(user.login, index, user.stars_count));
		for (let promise of promises) {
			topStarsUsers.push(await promise);
		}
		return topStarsUsers;
	};
	getChartData = usersData => {
		usersData.forEach(data => {
			console.log('UserData Data', data);
			let reposHolder = {};
			data.matchingLanguages = {};
			data.repos.forEach(repo => {
				if (repo.language !== null) {
					// Check to see if this language has been used to calc repo score
					// This algorihthm takes into account Unique Languages and matching top languages
					if (data.matchingLanguages[repo.language] === undefined) {
						reposHolder[repo.language] = [];
						// if it hasn't give a weighted score for a newly matched language (weighted heavier than each additional repo lang)
						data.matchingLanguages[repo.language] = 1;
						// if it has, give a slightly less weighted score
					} else {
						data.matchingLanguages[repo.language] = data.matchingLanguages[repo.language] + 1;
					}

					reposHolder[repo.language].push(repo);
				}
			});

			// Level the score with a natural log and multiply by the gitmatch factor and floor it to a nice integer
			let matchingLanguagesHolder = [];
			for (var key in data.matchingLanguages) {
				// skip loop if the property is from prototype
				if (!data.matchingLanguages.hasOwnProperty(key)) continue;
				matchingLanguagesHolder.push({
					language: key,
					count: data.matchingLanguages[key],
					reposDetails: reposHolder[key],
				});
			}
			// Create a matchingLanguages property on StarMatchUsers object and give the value of the array of matchingLanguages
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
		return usersData;
	};
	genChart = (index, starUserData, locationUserData) => {
		try {
			this.setState({
				loadingText: `${index}, ${starUserData}, ${locationUserData}`,
			});
			let locationUserCountData = [];
			let locationUserColors = [];
			let starUserCountData = [];
			let starUserColors = [];
			let starUserLabels = [];
			let locationUserLabels = [];
			// Gen GitUser Chart
			locationUserData.forEach(d => {
				locationUserCountData.push(d.count);
				locationUserColors.push(COLORS[d.language].color);
				locationUserLabels.push(d.language);
			});

			// Gen GitMatch Chart
			starUserData.forEach(d => {
				starUserCountData.push(d.count);
				starUserColors.push(COLORS[d.language].color);
				starUserLabels.push(d.language);
			});

			if (locationUserData.length === 0) {
				this.setState({
					percent: 80,
					loadingText: 'gen first chart',
					chartData: {
						LocationMatchUser: this.state.chartData.LocationMatchUser,
						StarMatchUser: {
							data: {
								labels: starUserLabels,
								datasets: [
									{
										label: 'My First dataset',
										data: starUserCountData,
										backgroundColor: starUserColors,
									},
								],
							},
							options: {
								onClick: function(e) {
									console.log(e);
								},
								responsive: true,
								maintainAspectRatio: true,
							},
						},
					},
					index: index,
				});
			} else {
				this.setState({
					percent: 85,
					chartData: {
						LocationMatchUser: {
							data: {
								labels: locationUserLabels,
								datasets: [
									{
										label: 'My First dataset',
										data: locationUserCountData,
										backgroundColor: locationUserColors,
									},
								],
							},
							options: {
								responsive: true,
								maintainAspectRatio: false,
							},
						},
						StarMatchUser: {
							data: {
								labels: starUserLabels,
								datasets: [
									{
										label: 'My First dataset',
										data: starUserCountData,
										backgroundColor: starUserColors,
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
			}
		} catch (err) {
			this.setState({ loadingText: err });
		}
	};
	GitLocation = async event => {
		try {
			event.preventDefault();
			// Check To Make Sure location is valid
			let locationResponse = await this.getLocation(this.state.location);
			// Create the searchToken
			let searchToken = this.createSearchToken(locationResponse, this.state.selectedLanguages);
			// Retrieve Local Users
			let locationMatchUserResponse = await this.getStarMatchUsers(searchToken);
			// Retrieve Top Star Users
			let topStarNameResponse = await this.getTopStarNames(locationResponse.city, this.state.selectedLanguages[0]);
			// Grab Top Star Users UserData and Repos
			let topStarUsersResponse = await this.getTopStarsData(topStarNameResponse);
			// Stop Loading, Set State, and Display Results

			// Get Chart Data Generated for Users Charts
			locationMatchUserResponse = this.getChartData(locationMatchUserResponse);
			topStarUsersResponse = this.getChartData(topStarUsersResponse);

			//Generate Chars
			let chartData = this.genChart(
				0,
				topStarUsersResponse[0].matchingLanguages,
				locationMatchUserResponse[0].matchingLanguages,
			);

			this.setState({});

			//Scroll to Results
		} catch (err) {
			this.errorHandler(err);
		}
	};

	render() {
		return <h3>Location Page</h3>;
	}
}
