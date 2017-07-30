import React from 'react';
import { MatchPageComponent } from './components/match/matchPage';
import { LocationPageComponent } from './components/location/locationPage';
import { AboutPageComponent } from './components/about/aboutPage';
import {
	LinkContainer,
	IndexLinkContainer,
} from 'react-router-bootstrap';
import {
	Navbar,
	Nav,
	NavItem,
	MenuItem,
	NavDropdown,
} from 'react-bootstrap';

import { BrowserRouter, Route, NavLink } from 'react-router-dom';
function App() {
	return (
		<BrowserRouter>
			<div>
				<Navbar inverse collapseOnSelect>
					<Navbar.Header>
						<LinkContainer to="/">
							<Navbar.Brand>GitMatch.me</Navbar.Brand>
						</LinkContainer>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight>
							<IndexLinkContainer to="/" activeClassName="active">
								<NavItem>Match</NavItem>
							</IndexLinkContainer>

							<LinkContainer to="/location" activeClassName="active">
								<NavItem>Location </NavItem>
							</LinkContainer>
							<LinkContainer to="/about" activeClassName="active">
								<NavItem>About </NavItem>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Route exact path={'/'} component={MatchPageComponent} />
				<Route
					exact
					path="/location"
					component={LocationPageComponent}
				/>
				<Route exact path="/about" component={AboutPageComponent} />
			</div>
		</BrowserRouter>
		// <BrowserRouter>
		// 	<div>
		// 		<ul>
		// 			<li>
		// 				<NavLink exact to="/" activeClassName="selected">
		// 					Match
		// 				</NavLink>
		// 			</li>
		// 			<li>
		// 				<NavLink exact to="/location" activeClassName="selected">
		// 					Location
		// 				</NavLink>
		// 			</li>
		// 			<li>
		// 				<NavLink exact to="/about" activeClassName="selected">
		// 					About
		// 				</NavLink>
		// 			</li>
		// 		</ul>
		// 		<hr />
		// 		<Route exact path={'/'} component={MatchPageComponent} />
		// 		<Route path="/location" component={LocationPageComponent} />
		// 		<Route path="/about" component={AboutPageComponent} />
		// 	</div>
		// </BrowserRouter>
	);
}
export default App;
