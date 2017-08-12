import React from 'react';
import Autocomplete from 'autocomplete-react-component';
export default class UsingAutoComplete extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			languagesArray: ['JavaScript', 'Java', 'Python'],
		};
	}

	selectedLanguageHandler = clickedValue => {
		console.log(clickedValue);
		// JavaScript
		// Example Output, if clicked Language: JavaScript
	};
	render() {
		return (
			<AutoComplete
				style={{ color: 'grey' }}
				dropdownStyle={{ backgroundColor: 'grey' }}
				valuesStyle={{ color: 'pink' }}
				values={this.state.languagesArray}
				onClick={this.selectedLanguageHandler}
			/>
		);
	}
}
