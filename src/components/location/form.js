import React from 'react';
import {
    OverlayTrigger,
    Tooltip,
    FormGroup,
    InputGroup,
    FormControl,
    Button,
    ControlLabel,
    Image,
    Col,
} from 'react-bootstrap';
import LanguagesModal from '../common/languageModal';

const overlay = (
    <Tooltip id="tooltip">
        <strong>Search By Location</strong>
    </Tooltip>
);
export default function GitLocationForm(props) {
    const formStyle = {
        color: 'black',
        backgroundImage: 'url(' + props.background + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'block',
        width: '100vw',
        margin: '0 auto',
        top: '0',
        left: 0,
        right: 0,
        textAlign: 'center',
        height: '100vh',
    };
    return (
        <Col xs={12} md={6} style={formStyle}>
            <form
                className="form-component"
                onSubmit={props.submit}
                style={{ top: '20%', position: 'absolute', width: '100%' }}
            >
                <Col xs={12} md={12}>
                    <Image src={props.image} style={{ margin: '0' }} />
                </Col>
                <Col xs={12} md={12}>
                    <Image src={props.subImage} />
                </Col>
                <FormGroup
                    bsClass="form-group"
                    style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto',
                    }}
                >
                    <ControlLabel style={{ color: 'white' }}>
                        {props.title + ' '}
                    </ControlLabel>
                    <OverlayTrigger placement="bottom" overlay={overlay}>
                        <InputGroup className={props.dynamicClass}>
                            <InputGroup.Button>
                                <Button type="button" onClick={props.displayLanguagesModal}>
                                    <span className="fa fa-cogs" /> Choose Languages
                                </Button>
                            </InputGroup.Button>
                            <FormControl
                                type="text"
                                name="username"
                                value={props.input}
                                className="form-control"
                                onChange={props.onInput}
                                onClick={props.select}
                                placeholder="username"
                            />
                            <InputGroup.Button>
                                <Button type="submit">
                                    <span className="fa fa-user-circle" /> LocateDevs
                                </Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </OverlayTrigger>
                </FormGroup>
            </form>
            <LanguagesModal
                languages={props.languages}
                onClick={props.onLanguageSelect}
                display={props.showLanguagesModal}
                modalHandler={props.displayLanguagesModal}
                selectedLanguages={props.selectedLanguages}
            />
        </Col>
    );
}
