import React from 'react';
import http from 'axios';
import GitLocationForm from './form';
import GitLocationResults from './results';
import { Modal, Grid, Button } from 'react-bootstrap';
import { GEOCODING, ACCESS_TOKEN, COLORS, STATIC_MAP_ACCESS_TOKEN, STATIC_MAP_URL } from '../../.constants';
import LoadingModal from '../common/loading';
import OverlayModal from '../common/overlay';
import RepoCard from '../common/repocard';
import Logo from '../../img/gitmatch-location-logo.png';
import subLogo from '../../img/gitlocationlogo.png';
import background from '../../img/background-location.jpg';
import Scroll from 'react-scroll';

// Create Default headers
const headers = {
	Authorization: `token ${ACCESS_TOKEN}`,
};
// Create default state to use in constructor and clearState()
let defaultState = {};
export default class LocationPageComponent extends React.Component {
	constructor(props) {
		super(props);
		defaultState = {
			defaultShownLanguages: props.defaultLanguages || ['JavaScript', 'Python', 'C'],
			location: '',
			displayRepoCard: false,
			selectedLanguages: ['JavaScript', 'Python', 'C'],
			topLocationUsers: [],
			topMatchUsers: [],
			elements: [],
			displayIndex: 0,
			starIndex: 0,
			locationIndex: 0,
			LocationMatchUsers: [],
			TopStarUsers: [],
			currentTopStarUser: { matchingLanguages: undefined },
			currentLocationUser: { matchingLanguages: undefined },
			chartData: {
				LocationMatchUser: { data: undefined },
				StarMatchUser: { data: undefined },
			},
			chartRefs: [],
			percent: 0,
			results: false,
		};
		this.state = defaultState;
	}
	errorHandler = error => {
		console.error(error);
		return error;
	};
	encode = str => {
		return encodeURIComponent(str);
	};
	select = event => {
		event.target.select();
	};
	// Clear/update Current State, when called without props use defaultState
	updateState = (state = defaultState) => {
		this.setState(state);
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
			this.setState({
				background: `${STATIC_MAP_URL}center=${local.neighborhood
					? local.city
					: this.encode(
							'los angeles',
						)}&size=640x640&style=element:labels|visibility:off&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&key=${STATIC_MAP_ACCESS_TOKEN}`,
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
		selectedLanguages = this.state.defaultShownLanguages || '',
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
		selectedLanguages.forEach(lang => (token += `+language:${this.encode(lang)}`));
		return token;
	};
	getUserRepoData = async (username, index = 0, stars = undefined) => {
		// Get UserData, and wait for it to return before getting repos
		try {
			let starsResponse = false;
			let userResponse = await http
				.get(`https://api.github.com/users/${username}`, {
					headers: headers,
				})
				.catch(err => {
					console.warn(`Could not find user: ${username}`);
					throw err;
				});
			if (!userResponse) {
				return false;
			}
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
			let matchingLanguages = [];
			if (reposResponse.data.length) {
				let uniqueLang = {};
				reposResponse.data.forEach((repo, index) => {
					if (uniqueLang[repo.language] === undefined && repo.language !== null) {
						uniqueLang[repo.language] = index;
						matchingLanguages.push({ language: repo.language, count: 1, reposDetails: [repo] });
					} else if (repo.language !== null) {
						matchingLanguages[uniqueLang[repo.language]].count++;
						matchingLanguages[uniqueLang[repo.language]].reposDetails.push(repo);
					}
				});
			} else {
				matchingLanguages = [];
			}
			return {
				userData: userResponse.data,
				repos: reposResponse.data,
				stars: starsResponse,
				matchingLanguages: matchingLanguages,
			};
		} catch (err) {
			return false;
		}
	};
	getStarMatchUsers = async (searchToken = '') => {
		try {
			let usersResponse = await http.get(`https://api.github.com/search/users?q=${searchToken}`);
			console.info('Users Response inside get Star', usersResponse);
			// Get UserData and Repos, starts the promises concurrently, and stores them synchronously
			let promises = usersResponse.data.items.map((user, index) => {
				return this.getUserRepoData(user.login, 6);
			});
			let localUsers = [];

			// Iterate over them in order and await for each to return,
			// this preserves GitHubs internal search order
			for (let promise of promises) {
				let resolvedCorrectly = await promise;
				if (!resolvedCorrectly) {
				} else {
					localUsers.push(resolvedCorrectly);
				}
			}
			console.info('Local Users', localUsers);
			return localUsers;
		} catch (err) {
			return err;
		}
	};
	getTopStarNames = async (location = 'los%20angeles', topLanguage) => {
		console.info('Location for Stars Names', location);
		console.info('Top Language', topLanguage);
		try {
			if (location !== undefined) {
				console.info('Getting Top Star Users');
				let locationTopStarUsers = await http(
					`https://crossorigin.me/http://git-awards.com/api/v0/users?city=${location}&language=${topLanguage}`,
				);
				console.info('Top Star Users', locationTopStarUsers);
				return locationTopStarUsers.data.users;
			} else {
				return [];
				throw new Error('Could not find a city');
			}
		} catch (err) {
			let users = {
				users: [
					{
						id: 15666214,
						login: 'jlmakes',
						gravatar_url: 'https://avatars.githubusercontent.com/u/2044842?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 23560,
						city_rank: 1,
						country_rank: 35,
						world_rank: 86,
					},
					{
						id: 5458844,
						login: 'zenorocha',
						gravatar_url: 'https://avatars.githubusercontent.com/u/398893?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 20553,
						city_rank: 2,
						country_rank: 43,
						world_rank: 107,
					},
					{
						id: 15657117,
						login: 'dthree',
						gravatar_url: 'https://avatars.githubusercontent.com/u/10319897?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 17805,
						city_rank: 3,
						country_rank: 52,
						world_rank: 126,
					},
					{
						id: 6068263,
						login: 'jakiestfu',
						gravatar_url: 'https://avatars.githubusercontent.com/u/1041792?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 16964,
						city_rank: 4,
						country_rank: 57,
						world_rank: 135,
					},
					{
						id: 5705548,
						login: 'briangonzalez',
						gravatar_url: 'https://avatars.githubusercontent.com/u/659829?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 10023,
						city_rank: 5,
						country_rank: 108,
						world_rank: 289,
					},
					{
						id: 5471174,
						login: 'samyk',
						gravatar_url: 'https://avatars.githubusercontent.com/u/411832?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 8190,
						city_rank: 6,
						country_rank: 140,
						world_rank: 390,
					},
					{
						id: 6986617,
						login: 'julianlloyd',
						gravatar_url: 'https://avatars.githubusercontent.com/u/2044842?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 6069,
						city_rank: 7,
						country_rank: 203,
						world_rank: 596,
					},
					{
						id: 10164501,
						login: 'reactioncommerce',
						gravatar_url: 'https://avatars.githubusercontent.com/u/5605462?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 5758,
						city_rank: 8,
						country_rank: 212,
						world_rank: 638,
					},
					{
						id: 7203480,
						login: 'dollarshaveclub',
						gravatar_url: 'https://avatars.githubusercontent.com/u/2293386?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 5104,
						city_rank: 9,
						country_rank: 249,
						world_rank: 751,
					},
					{
						id: 5094656,
						login: 'motdotla',
						gravatar_url: 'https://avatars.githubusercontent.com/u/3848?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 4688,
						city_rank: 10,
						country_rank: 271,
						world_rank: 821,
					},
					{
						id: 5289783,
						login: 'hybridgroup',
						gravatar_url: 'https://avatars.githubusercontent.com/u/212109?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 4186,
						city_rank: 11,
						country_rank: 303,
						world_rank: 922,
					},
					{
						id: 6217283,
						login: 'dabbott',
						gravatar_url: 'https://avatars.githubusercontent.com/u/1198882?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 3864,
						city_rank: 12,
						country_rank: 326,
						world_rank: 1003,
					},
					{
						id: 15977364,
						login: 'hackjutsu',
						gravatar_url: 'https://avatars.githubusercontent.com/u/7756581?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 2078,
						city_rank: 13,
						country_rank: 542,
						world_rank: 1830,
					},
					{
						id: 5141454,
						login: 'theturtle32',
						gravatar_url: 'https://avatars.githubusercontent.com/u/53184?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1826,
						city_rank: 14,
						country_rank: 597,
						world_rank: 2037,
					},
					{
						id: 5139681,
						login: 'stoyan',
						gravatar_url: 'https://avatars.githubusercontent.com/u/51308?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1590,
						city_rank: 15,
						country_rank: 683,
						world_rank: 2286,
					},
					{
						id: 5097632,
						login: 'doctyper',
						gravatar_url: 'https://avatars.githubusercontent.com/u/6960?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1545,
						city_rank: 16,
						country_rank: 701,
						world_rank: 2359,
					},
					{
						id: 5223276,
						login: 'icodeforlove',
						gravatar_url: 'https://avatars.githubusercontent.com/u/139784?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1447,
						city_rank: 17,
						country_rank: 745,
						world_rank: 2497,
					},
					{
						id: 5489921,
						login: 'davidguttman',
						gravatar_url: 'https://avatars.githubusercontent.com/u/431696?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1384,
						city_rank: 18,
						country_rank: 770,
						world_rank: 2580,
					},
					{
						id: 5273866,
						login: 'vinceg',
						gravatar_url: 'https://avatars.githubusercontent.com/u/195199?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1250,
						city_rank: 19,
						country_rank: 836,
						world_rank: 2800,
					},
					{
						id: 5208154,
						login: 'codejoust',
						gravatar_url: 'https://avatars.githubusercontent.com/u/123693?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1217,
						city_rank: 20,
						country_rank: 849,
						world_rank: 2857,
					},
					{
						id: 5796392,
						login: 'edwardhotchkiss',
						gravatar_url: 'https://avatars.githubusercontent.com/u/755709?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1209,
						city_rank: 21,
						country_rank: 857,
						world_rank: 2883,
					},
					{
						id: 11823668,
						login: 'normalize',
						gravatar_url: 'https://avatars.githubusercontent.com/u/7309604?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 1116,
						city_rank: 22,
						country_rank: 913,
						world_rank: 3073,
					},
					{
						id: 10317205,
						login: 'virtocommerce',
						gravatar_url: 'https://avatars.githubusercontent.com/u/5762443?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 926,
						city_rank: 23,
						country_rank: 1025,
						world_rank: 3540,
					},
					{
						id: 9807451,
						login: 'maxcdn',
						gravatar_url: 'https://avatars.githubusercontent.com/u/5238876?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 924,
						city_rank: 24,
						country_rank: 1027,
						world_rank: 3543,
					},
					{
						id: 5293667,
						login: 'dickeyxxx',
						gravatar_url: 'https://avatars.githubusercontent.com/u/216188?v=3',
						city: 'los angeles',
						country: 'united states',
						stars_count: 884,
						city_rank: 25,
						country_rank: 1057,
						world_rank: 3665,
					},
				],
				page: 1,
				total_pages: 95,
				total_count: 2358,
			};
			return users.users;
			throw err;
		}
	};
	getTopStarsData = async (users, index = 1000) => {
		let topStarsUsers = [];
		let promises = users.map(user => this.getUserRepoData(user.login, index, user.stars_count));
		for (let promise of promises) {
			let resolvedCorrectly = await promise;
			if (!resolvedCorrectly) {
			} else {
				topStarsUsers.push(await promise);
			}
		}
		return topStarsUsers;
	};
	getChartData = usersData => {
		usersData.forEach(data => {
			// console.log('UserData Data', data);
			// let reposHolder = {};
			// data.matchingLanguages = {};
			// data.repos.forEach(repo => {
			// 	if (repo.language !== null) {
			// 		// Check to see if this language has been used to calc repo score
			// 		// This algorihthm takes into account Unique Languages and matching top languages
			// 		if (data.matchingLanguages[repo.language] === undefined) {
			// 			reposHolder[repo.language] = [];
			// 			// if it hasn't give a weighted score for a newly matched language (weighted heavier than each additional repo lang)
			// 			data.matchingLanguages[repo.language] = 1;
			// 			// if it has, give a slightly less weighted score
			// 		} else {
			// 			data.matchingLanguages[repo.language] = data.matchingLanguages[repo.language] + 1;
			// 		}

			// 		reposHolder[repo.language].push(repo);
			// 	}
			// });

			// // Level the score with a natural log and multiply by the gitmatch factor and floor it to a nice integer
			// let matchingLanguagesHolder = [];
			// for (var key in data.matchingLanguages) {
			// 	// skip loop if the property is from prototype
			// 	if (!data.matchingLanguages.hasOwnProperty(key)) continue;
			// 	matchingLanguagesHolder.push({
			// 		language: key,
			// 		count: data.matchingLanguages[key],
			// 		reposDetails: reposHolder[key],
			// 	});
			// }
			// // Create a matchingLanguages property on StarMatchUsers object and give the value of the array of matchingLanguages
			// data.matchingLanguages = matchingLanguagesHolder;
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
		console.warn(usersData);
		usersData = usersData.filter(user => {
			return user.matchingLanguages.length > 0;
		});
		console.warn(usersData);
		return usersData;
	};
	genChart = (starIndex, locationIndex, starUserData, locationUserData) => {
		try {
			let locationUserCountData = [];
			let locationUserColors = [];
			let starUserCountData = [];
			let starUserColors = [];
			let starUserLabels = [];
			let locationUserLabels = [];
			// Gen GitUser Chart
			locationUserData.forEach(d => {
				console.log(d.language);
				locationUserCountData.push(d.count);
				locationUserColors.push(COLORS[d.language].color);
				locationUserLabels.push(d.language);
			});

			// Gen GitMatch Chart
			starUserData.forEach(d => {
				console.log(d.language);
				starUserCountData.push(d.count);
				starUserColors.push(COLORS[d.language].color);
				starUserLabels.push(d.language);
			});

			this.setState({
				percent: 75,
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
				starIndex: starIndex,
				locationIndex: locationIndex,
			});
		} catch (err) {
			console.error(err);
		}
	};
	previousUser = () => {
		try {
			this.genChart(
				this.state.starIndex - 1,
				this.state.locationIndex - 1,
				this.state.TopStarUsers[this.state.starIndex - 1].matchingLanguages,
				this.state.LocationMatchUsers[this.state.locationIndex - 1].matchingLanguages,
			);
		} catch (err) {
			console.error(err);
		}
	};
	nextUser = () => {
		try {
			this.genChart(
				this.state.starIndex + 1,
				this.state.locationIndex + 1,
				this.state.TopStarUsers[this.state.starIndex + 1].matchingLanguages,
				this.state.LocationMatchUsers[this.state.locationIndex + 1].matchingLanguages,
			);
		} catch (err) {
			console.error(err);
		}
	};
	bindRefs = (ele, refName) => {
		if (refName === 'Location') {
			ele.chart_instance.canvas.onclick = function(e, index) {
				let repos = '';
				let activePoints = ele.chart_instance.getElementsAtEvent(e);
				let firstPoint = activePoints[0];
				if (firstPoint) {
					this.setState({
						currentLocationUser: this.state.LocationMatchUsers[this.state.locationIndex],
						displayGitUserRepo: true,
						currentTopStarUser: undefined,
						displayIndex: firstPoint._index,
					});
				}
			}.bind(this);
		} else if (refName === 'Star') {
			ele.chart_instance.canvas.onclick = function(e, index) {
				let repos = '';
				let activePoints = ele.chart_instance.getElementsAtEvent(e);
				let firstPoint = activePoints[0];
				if (firstPoint) {
					console.log('showing matched users repo');
					this.setState({
						currentLocationUser: undefined,
						displayGitUserRepo: true,
						currentTopStarUser: this.state.TopStarUsers[this.state.starIndex],
						displayIndex: firstPoint._index,
					});
				}
			}.bind(this);
		}
	};

	chartClickStar = ele => {
		ele.onClick = e => {
			console.log(e);
		};

		ele.chart_instance.canvas.onclick = (e, index) => {
			let repos = '';
			let activePoints = ele.chart_instance.getElementsAtEvent(e);
			let firstPoint = activePoints[0];
			if (firstPoint) {
				console.log('showing matched users repo');
				this.setState({
					currentLocationUser: undefined,
					displayGitUserRepo: true,
					currentTopStarUser: this.state.TopStarUsers[this.state.starIndex],
					displayIndex: firstPoint._index,
				});
			}
		};

		let newElements = this.state.elements;
		newElements.push(ele.chart_instance.canvas);
		this.setState({
			elements: newElements,
		});
		console.log(this.state.elements);
	};
	chartClickLocation = ele => {
		ele.onClick = e => {
			console.log(e);
		};

		ele.chart_instance.canvas.onclick = (e, index) => {
			let repos = '';
			let activePoints = ele.chart_instance.getElementsAtEvent(e);
			let firstPoint = activePoints[0];
			if (firstPoint) {
				this.setState({
					currentLocationUser: this.state.LocationMatchUsers[this.state.locationIndex],
					displayGitUserRepo: true,
					currentTopStarUser: undefined,
					displayIndex: firstPoint._index,
				});
			}
		};

		let newElements = this.state.elements;
		newElements.push(ele.chart_instance.canvas);
		this.setState({
			elements: newElements,
		});
		console.log(this.state.elements);
	};
	closeRepoModal = () => {
		this.setState({
			currentTopStarUser: { topLanguage: undefined },
			currentLocationUser: { topLanguage: undefined },
		});
	};
	changeIndex = (index = 0) => {
		this.setState({
			displayIndex: index,
		});
	};
	GitLocation = async event => {
		event.preventDefault();

		try {
			this.setState({ loadingText: 'Validating Locations', loading: true });
			// Check To Make Sure location is valid
			let locationResponse = await this.getLocation(this.state.location);
			console.info('Location Response', locationResponse);
			this.setState({ loadingText: 'Generating Search Token', percent: 12.5 });
			// Create the searchToken
			let searchToken = this.createSearchToken(locationResponse, this.state.selectedLanguages);
			console.info('Search Token', searchToken);
			this.setState({ loadingText: 'Retrieving Local Users', percent: 25 });
			// Retrieve Local Users
			let locationMatchUserResponse = await this.getStarMatchUsers(searchToken);
			console.info('Location Matched Users', locationMatchUserResponse);
			//
			this.setState({ loadingText: 'Retrieving Top Users', percent: 37.5 });
			// Retrieve Top Star Users
			let topStarNameResponse = await this.getTopStarNames(locationResponse.city, this.state.selectedLanguages[0]);
			console.info('Top Star Name Responses', topStarNameResponse);
			//
			this.setState({ loadingText: 'Getting Top Users Repos', percent: 50 });
			// Grab Top Star Users UserData and Repos
			let topStarUsersResponse = await this.getTopStarsData(topStarNameResponse);
			console.info('Top Star Users Response', topStarUsersResponse);
			// Stop Loading, Set State, and Display Results
			this.setState({ loadingText: 'Generating Charts', percent: 62.5 });
			// Get Chart Data Generated for Users Charts
			locationMatchUserResponse = this.getChartData(locationMatchUserResponse);
			console.info('Location Matched Users Chart Data', locationMatchUserResponse);
			topStarUsersResponse = this.getChartData(topStarUsersResponse);
			console.info('Top Star Users Chart Data', topStarUsersResponse);

			//Generate Chars
			this.genChart(0, 0, topStarUsersResponse[0].matchingLanguages, locationMatchUserResponse[0].matchingLanguages);
			console.info('Chart Data', this.state.chartData);
			this.setState({ loadingText: 'Displaying Results', percent: 100 });
			setTimeout(() => {
				this.setState({
					TopStarUsers: topStarUsersResponse,
					LocationMatchUsers: locationMatchUserResponse,
					locationIndex: 0,
					starIndex: 0,
					maxStarIndex: topStarUsersResponse.length - 1,
					maxLocationIndex: locationMatchUserResponse.length,
					results: true,
					loading: false,
				});
				setTimeout(() => {
					console.log(this.state.elements);
				}, 3000);
			}, 750);

			//Scroll to Results
		} catch (err) {
			this.errorHandler(err);
		}
	};

	render() {
		return (
			<div style={{ height: '100%', width: '100%' }}>
				<GitLocationForm
					submit={this.GitLocation}
					input={this.state.location}
					onInput={this.handleLocationInput}
					select={this.select}
					background={background}
					image={Logo}
					subImage={subLogo}
					title={'Find Local Devs by language and location'}
				/>

				<GitLocationResults
					LocationMatchUser={this.state.LocationMatchUsers[this.state.locationIndex]}
					StarMatchUser={this.state.TopStarUsers[this.state.starIndex]}
					nextMatch={this.nextMatch}
					previousMatch={this.previousMatch}
					maxLocationIndex={this.state.maxLocationIndex}
					maxStarIndex={this.state.maxStarIndex}
					starIndex={this.state.starIndex}
					locationIndex={this.state.locationIndex}
					chartData={this.state.chartData}
					results={this.state.results}
					loading={this.state.loading}
					bindRef={this.bindRefs}
					background={this.state.background}
				/>
				<RepoCard
					display={this.state.displayRepoCard}
					user={this.state.currentTopStarUser || this.state.currentLocationUser}
					close={this.closeRepoModal}
					index={this.state.displayIndex}
					changeIndex={this.changeIndex}
				/>
				<LoadingModal loading={this.state.loading} text={this.state.loadingText} percent={this.state.percent} />
				<OverlayModal loading={this.state.loading} />
			</div>
		);
	}
}
