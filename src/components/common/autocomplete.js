import React from 'react';
import { COLORS } from '../../.constants';
import LanguagesDisplay from './languagesdisplay';
// need selectedLanguages array
//

const style = {
	margin: '100px',
	color: 'black',
	position: 'absolute',
	width: '400px',
};
export default class LanguagesAutoComplete extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			selectedLanguages: this.props.selectedLanguages,
			input: '',
			displayLanguages: false,
		};
	}
	componentWillReceiveProps(props) {
		if (props.selectedLanguages) {
			this.setState({ selectedLanguages: props.selectedLanguages });
		}
	}
	componentDidMount() {
		this.createLanguagesArray();
	}
	// Create an Array of Chooseable languages
	createLanguagesArray = () => {
		let languagesArray = [];
		for (let language in COLORS) {
			languagesArray.push(language);
		}
		console.log(languagesArray);
		this.setState({
			languagesArray: languagesArray,
			displayedLanguages: languagesArray,
		});
	};
	openLanguages = () => {
		this.setState({
			displayLanguages: true,
		});
	};
	closeLanguages = e => {
		let languages = this.state.selectedLanguages;
		setTimeout(() => {
			console.log(this.state);
			if (this.state.selectedLanguages.length === languages.length) {
				this.setState({ displayLanguages: false });
			} else {
				console.log(document.getElementsByClassName('autocomplete-input').me.select());
			}
		}, 300);
	};

	// Filter Languages on Input
	filterLanguages = value => {
		let newLanguages = this.state.languagesArray;
		newLanguages = this.state.languagesArray.filter(language => {
			return language.toLowerCase().includes(value.toLowerCase());
		});
		console.log(newLanguages);
		this.setState({
			displayedLanguages: newLanguages,
		});
	};
	onInput = event => {
		console.log(event.target.value);
		this.setState({ input: event.target.value });
		setTimeout(() => {
			this.filterLanguages(this.state.input);
		}, 100);
	};
	// Hacky, faking the selectedLanguageHandler to think that we created an event with a target with innertext of desired name
	onEnterPress = e => {
		if (e.key === 'Enter') {
			let event = {};
			event.target = {};
			event.target.innerText = this.state.displayedLanguages[0];
			this.props.selectedLanguageHandler(event);
		}
	};
	render() {
		return (
			<div style={style} className="autocomplete-container">
				<input
					className="autocomplete-input"
					style={{ width: '400px' }}
					type="text"
					name="me"
					value={this.state.input}
					onFocus={this.openLanguages}
					onChange={this.onInput}
					onBlur={this.closeLanguages}
					onKeyPress={this.onEnterPress}
				/>
				<LanguagesDisplay
					displayLanguages={this.state.displayLanguages}
					displayedLanguages={this.state.displayedLanguages}
					selectedLanguageHandler={this.props.selectedLanguageHandler}
					width={'400px'}
				/>
			</div>
		);
	}
}
