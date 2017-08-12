import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import LocationPageComponent from './locationPage';

function render(props) {
	const div = document.createElement('div');
	return ReactDOM.render(<LocationPageComponent {...props} />, div);
}

describe('Testing Location Page', () => {
	it('renders without crashing', () => {
		let wrapper = render();
	});
	it('testing get location function', () => {
		let wrapper = render();

		return wrapper.getLocation('los angeles').then(local => {
			expect(local.city).toEqual('los%20angeles');
		});
	});
	it('testing default languages', () => {
		let wrapper = render({ defaultLanguages: ['Java', 'C++', 'BrainFuck'] });
		expect(wrapper.state.defaultShownLanguages).toEqual(wrapper.props.defaultLanguages);
		wrapper = render();
		expect(wrapper.state.defaultShownLanguages).toEqual(['JavaScript', 'Python', 'C']);
	});
	it('testing errorHandler', () => {
		let wrapper = render();
		expect(wrapper.errorHandler('Error')).toEqual('Error');
	});
	it('testing createSearch token', () => {
		let wrapper = render();
		expect(wrapper.createSearchToken()).toEqual(
			'location:los%20angeles' +
				wrapper.state.defaultShownLanguages.map(lang => `+language:${lang}`).toString().replace(/,/g, ''),
		);
		let languages = ['python', 'c++'];
		expect(wrapper.createSearchToken({ city: 'los%20angeles' }, languages)).toEqual(
			'location:los%20angeles' + languages.map(lang => `+language:${wrapper.encode(lang)}`).toString().replace(/,/, ''),
		);
	});
});
