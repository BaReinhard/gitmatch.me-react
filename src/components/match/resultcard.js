import React from 'react';
import GitMatchChart from '../common/chart';
import { Row, Col, Thumbnail } from 'react-bootstrap';
import Waypoint from 'react-waypoint';

export default function GitMatchResultCard(props) {
    // Returns for User Searching for a match
    if (props.results && !props.nextMatch) {
        return (
            <Col id="resultsScroll" xs={12} md={6}>
                <Row>
                    <button style={{ float: 'left', opacity: '0' }} className="btn btn-default">
                        Previous
                    </button>
                    <button style={{ float: 'right', opacity: '0' }} className="btn btn-default hidden">
                        Next
                    </button>
                </Row>
                <br />

                <div className="information-container" style={{ minHeight: '300px' }}>
                    <Col xs={4} md={4}>
                        <Thumbnail
                            target="_blank"
                            href={props.user.userData.html_url}
                            src={props.user.userData.avatar_url}
                        />
                    </Col>
                    <Col xs={12} md={12}>
                        <h3>Match</h3>
                        <h4>
                            {props.user.userData.login}
                        </h4>
                        <h3>Stars</h3>
                        <p>
                            {props.user.stars === false
                                ? <button className="btn btn-info" onClick={props.getMyStars}>
                                      Update My Stars
                                  </button>
                                : props.user.stars === 'error'
                                  ? <span>
                                        {' '}<button className="btn btn-info" onClick={props.getMyStars}>
                                            Update My Stars
                                        </button>
                                        <span>
                                            There was an error retrieving {props.user.userData.login}'s stars,
                                            Unfortunately,{' '}
                                            <a
                                                href={`http://git-awards.com/users/search?login=${props.user.userData
                                                    .login}`}
                                            >
                                                Git-Awards
                                            </a>{' '}
                                            doesn't have their data on file
                                        </span>
                                    </span>
                                  : props.user.stars}
                        </p>
                    </Col>
                    <div>
                        <h3>Location:</h3>
                        <p>
                            {' '}{props.user.userData.location}
                        </p>
                    </div>
                </div>
                <GitMatchChart
                    chartData={props.chartData.data}
                    chartOptions={props.chartData.options}
                    bindRef={props.bindRef}
                    refName={'GitMatchUser'}
                />
                <hr />
                <Waypoint onEnter={props.setClass} onLeave={props.unsetClass} />
            </Col>
        );
        // Returns for Matched Users
    } else if (props.nextMatch && props.results) {
        return (
            <Col xs={12} md={6} key={props.key}>
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
                        <h3>Stars</h3>
                        <p>
                            {props.user.stars === false
                                ? <button className="btn btn-info" onClick={props.getMyStars}>
                                      Update My Stars
                                  </button>
                                : props.user.stars === 'error'
                                  ? <span>
                                        {' '}<button className="btn btn-info" onClick={props.getMyStars}>
                                            Update My Stars
                                        </button>
                                        <span>
                                            There was an error retrieving {props.user.userData.login}'s stars,
                                            Unfortunately,{' '}
                                            <a
                                                href={`http://git-awards.com/users/search?login=${props.user.userData
                                                    .login}`}
                                            >
                                                Git-Awards
                                            </a>{' '}
                                            doesn't have their data on file
                                        </span>
                                    </span>
                                  : props.user.stars}
                        </p>
                        <h3>Score</h3>
                        <p>
                            {props.user.score}
                        </p>
                    </Col>
                    <h3>Location: </h3>
                    <p>
                        {' '}{props.user.userData.location}
                    </p>
                </div>

                <GitMatchChart
                    refName={'MatchedUser'}
                    bindRef={props.bindRef}
                    chartData={props.chartData.data}
                    chartOptions={props.chartData.options}
                />

                <hr />
            </Col>
        );
    } else {
        return <div />;
    }
}
