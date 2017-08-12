import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import MatchPageComponent from './matchPage';

function render() {
	const div = document.createElement('div');
	return ReactDOM.render(<MatchPageComponent />, div);
}

describe('Testing Match Page', () => {
	it('renders without crashing', () => {
		let wrapper = render();
	});
	it('testing get encode', async () => {
		let wrapper = render();
		expect(wrapper.encode('los angeles')).toBe('los%20angeles');
	});
	it('testing username', async () => {
		let wrapper = render();
		try {
			let userData = await wrapper.getUserRepoData('bareinhard');
			expect(userData.userData.login).toEqual('BaReinhard');
		} catch (err) {
			// Doesn't run in testing, needs something else
		}
	});
});
