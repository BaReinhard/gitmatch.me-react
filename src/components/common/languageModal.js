import React from 'react';
import AutoComplete from 'autocomplete-react-component';
import { Modal, Col, Button } from 'react-bootstrap';

const LanguageModal = props => {
    let results;
    if (props.display) {
        results = (
            <Modal.Dialog
                show={props.display}
                style={{
                    color: 'black',
                    textAlign: 'center',
                }}
                bsSize="large"
            >
                <Modal.Header>
                    <h3>Select Your Languages</h3>
                </Modal.Header>
                <Modal.Body style={{ margin: '10px', height: '75%', textAlign: 'center' }}>
                    <div>
                        <Col xs={6} md={6} style={{ position: 'relative' }}>
                            <h4>Selected Languages</h4>
                            <div style={{ position: 'relative', height: '12em', overflow: 'scroll' }}>
                                {props.selectedLanguages.map(language => {
                                    return (
                                        <p
                                            onClick={e => {
                                                console.log(e.target);
                                                props.onClick(e.target.innerText);
                                            }}
                                            name="language"
                                            key={language}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {language}
                                        </p>
                                    );
                                })}
                            </div>
                        </Col>
                        <Col xs={6} md={6} style={{ position: 'relative' }}>
                            <h3>Select Your Languages </h3>
                            <AutoComplete
                                values={props.languages}
                                style={{ position: 'relative', textAlign: 'left', margin: '50px auto' }}
                                onClick={props.onClick}
                            />
                        </Col>
                    </div>
                    <Button onClick={props.modalHandler} style={{ position: 'relative', margin: '10px auto' }}>
                        Close
                    </Button>
                </Modal.Body>
            </Modal.Dialog>
        );
    } else {
        results = <div />;
    }
    return results;
};
export default LanguageModal;
