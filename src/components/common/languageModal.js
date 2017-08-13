import React from 'react';
import AutoComplete from 'autocomplete-react-component';
import { Modal } from 'react-bootstrap';

const LanguageModal = props => {
    let results;
    if (props.display) {
        results = (
            <Modal show={props.display} bsSize="large">
                <h3>Select Your Languages </h3> <AutoComplete values={props.languages} onClick={props.onClick} />{' '}
            </Modal>
        );
    } else {
        results = <div />;
    }
    return results;
};
export default LanguageModal;
