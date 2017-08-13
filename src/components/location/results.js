import React from 'react';
import GitMatchResultCard from './resultcard';
import PseudoAfter from '../common/pseudoAfter';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';

export default function GitMatchResults(props) {
    let results;

    if (!props.results & !props.loading) {
        results = <div />;
    } else {
        results = (
            <div id="results-location">
                <GitMatchResultCard
                    user={props.LocationMatchUser}
                    bindRef={props.bindRef}
                    chartData={props.chartData.LocationMatchUser}
                    results={props.results}
                    refName={'Location'}
                    index={props.locationIndex}
                    maxIndex={props.maxLocationIndex}
                />
                <Waypoint onEnter={props.setClass} onLeave={props.unsetClass} />

                <GitMatchResultCard
                    user={props.StarMatchUser}
                    bindRef={props.bindRef}
                    chartData={props.chartData.StarMatchUser}
                    results={props.results}
                    refName={'Star'}
                    index={props.starIndex}
                    maxIndex={props.maxStarIndex}
                />
                <PseudoAfter background={props.background} />
            </div>
        );
    }
    return results;
}
GitMatchResults.propTypes = {
    background: PropTypes.string,
    StarMatchUser: PropTypes.object,
    starIndex: PropTypes.number,
    maxStarIndex: PropTypes.number,
    locationIndex: PropTypes.number,
    maxLocationIndex: PropTypes.number,
    refName: PropTypes.string,
    bindRef: PropTypes.func,
    chartData: PropTypes.object,
    results: PropTypes.bool,
    loading: PropTypes.bool,
    index: PropTypes.number,
    maxIndex: PropTypes.number,
};
