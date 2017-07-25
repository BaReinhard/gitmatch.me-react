import React from 'react';
import { MatchPageComponent } from './components/match/matchPage';
import { LocationPageComponent } from './components/location/locationPage';
import { AboutPageComponent } from './components/about/aboutPage';

import {
	BrowserRouter,
	Route,
	Link,
	NavLink,
} from 'react-router-dom';
function App() {
	return (
		<BrowserRouter>
			<div>
				<ul>
					<li>
						<NavLink exact to="/" activeClassName="selected">
							Match
						</NavLink>
					</li>
					<li>
						<NavLink exact to="/location" activeClassName="selected">
							Location
						</NavLink>
					</li>
					<li>
						<NavLink exact to="/about" activeClassName="selected">
							About
						</NavLink>
					</li>
				</ul>
				<hr />
				<Route exact path={'/'} component={MatchPageComponent} />
				<Route path="/location" component={LocationPageComponent} />
				<Route path="/about" component={AboutPageComponent} />
			</div>
		</BrowserRouter>
	);
}
export default App;
