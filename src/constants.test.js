import React from 'react';
import expect from 'expect';
import * as Constants from './.constants';

describe('Testing to ensure constants exist', () => {
	it('Testing that github ACCESS_TOKEN exists', () => {
		expect(Constants.ACCESS_TOKEN).toExist();
	});
	it('Test that google map GEOCODING exists', () => {
		expect(Constants.GEOCODING).toExist();
	});
	it('Test that google map STATIC_MAP_ACCESS_TOKEN exists', () => {
		expect(Constants.STATIC_MAP_ACCESS_TOKEN).toExist();
	});
	it('Test that google map STATIC_MAP_URL exists', () => {
		expect(Constants.STATIC_MAP_URL).toExist();
	});
	it('Test that COLORS exist', () => {
		expect(Constants.COLORS).toExist();
	});
});
