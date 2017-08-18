import React from 'react';
import { Modal } from 'react-bootstrap';

const ErrorModal = props => {
    return (
        <Modal show={props.error} bsSize="large">
            <div
                style={{
                    textAlign: 'center',
                    margin: '10px 0',
                    color: 'red',
                }}
            >
                <h3>
                    {props.text}...
                </h3>
                <i className="fa fa-exclamation-triangle" />
                <span className="sr-only">Loading...</span>
            </div>
        </Modal>
    );
};

export default ErrorModal;
