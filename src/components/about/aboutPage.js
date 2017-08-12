import React from 'react';
import { COLORS } from '../../.constants';
import AutoComplete from 'autocomplete-react-component';

export class AboutPageComponent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			selectedLanguages: [],
			closeLanguages: false,
		};
	}
	componentWillMount() {
		let languagesArray = [];
		for (let language in COLORS) {
			languagesArray.push(language);
		}
		console.log(languagesArray);
		this.setState({
			languagesArray: languagesArray,
		});
	}
	selectedLanguageHandler = val => {
		if (this.state.selectedLanguages.includes(val)) {
			let newLanguages = this.state.selectedLanguages.filter(language => {
				return language !== val;
			});
			this.setState({ selectedLanguages: newLanguages });
		} else {
			this.setState({
				selectedLanguages: [...this.state.selectedLanguages, val],
			});
		}
	};

	render() {
		return (
			<div style={{ color: 'black' }} onClick={this.closeDisplay}>
				<h3>About Page</h3>
				<AutoComplete
					style={{ color: 'grey' }}
					dropdownStyle={{ backgroundColor: 'yellow' }}
					valuesStyle={{ color: 'pink' }}
					values={this.state.languagesArray}
					onClick={this.selectedLanguageHandler}
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
