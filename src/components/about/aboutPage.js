import React from 'react';
import AutoComplete from '../common/autocomplete';

export class AboutPageComponent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			selectedLanguages: [],
			closeLanguages: false,
		};
	}
	selectedLanguageHandler = event => {
		if (this.state.selectedLanguages.includes(event.target.innerText)) {
			let newLanguages = this.state.selectedLanguages.filter(language => {
				return language !== event.target.innerText;
			});
			this.setState({ selectedLanguages: newLanguages });
		} else {
			this.setState({
				selectedLanguages: [...this.state.selectedLanguages, event.target.innerText],
			});
		}
	};

	render() {
		return (
			<div style={{ color: 'black' }} onClick={this.closeDisplay}>
				<h3>About Page</h3>
				<AutoComplete
					selectedLanguageHandler={this.selectedLanguageHandler}
					selectedLanguages={this.state.selectedLanguages}
				/>
				<h4>Selected Languages</h4>
				{this.state.selectedLanguages.map(language => {
					return (
						<p key={language + 'key'}>
							{language}
						</p>
					);
				})}
			</div>
		);
	}
}
