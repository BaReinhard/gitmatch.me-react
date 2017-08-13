import React from 'react';
import GitLocationChart from '../common/chart';
import { Row, Col, Thumbnail } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function GitLocationCard(props) {
    // Returns for User Searching for a match
    if (props.results) {
        console.log(props);
        return (
            <Col xs={12} md={6} style={{ color: 'black' }}>
                <Row>
                    {props.index > 0
                        ? <button style={{ float: 'left' }} className="btn btn-default" onClick={props.previousMatch}>
                              Previous
                          </button>
                        : <div />}
                    {props.index < props.maxIndex
                        ? <button style={{ float: 'right' }} className="btn btn-default" onClick={props.nextMatch}>
                              Next
                          </button>
                        : <div />}
                </Row>
                <br />
                <div className="information-container" style={{ minHeight: '300px' }}>
                    <Col xs={4} md={4} style={{ textAlign: 'center', margin: '0 auto' }}>
                        <Thumbnail
                            target="_blank"
                            href={props.user.userData.html_url}
                            src={props.user.userData.avatar_url}
                        />
                    </Col>
                    <Col xs={12} md={12}>
                        <h3>Top Match</h3>
                        <h4>
                            {props.user.userData.login}
                        </h4>

                        <h3>Bio</h3>
                        <p>
                            {props.user.userData.bio}
                        </p>
                    </Col>
                    <h3>Location: </h3>
                    <p>
                        {' '}{props.user.userData.location}
                    </p>
                </div>

                <GitLocationChart
                    refName={props.refName}
                    bindRef={props.bindRef}
                    chartData={props.chartData.data}
                    chartOptions={props.chartData.options}
                />

                <hr />
            </Col>
        );
        // Returns for Matched Users
    } else {
        return <div />;
    }
}
GitLocationCard.propTypes = {
    user: PropTypes.object,
    refName: PropTypes.string,
    bindRef: PropTypes.func,
    chartData: PropTypes.object,
    results: PropTypes.bool,
    index: PropTypes.number,
    maxIndex: PropTypes.number,
};
