import React from 'react';

export default function LanguagesDisplay(props) {
	if (props.displayLanguages) {
		return (
			<div
				name="languagesdisplay"
				className="languagesdisplay-container"
				style={{
					position: 'absolute',
					zIndex: '200',
					height: '300px',
					width: props.width,
					overflow: 'scroll',
					color: 'black',
					backgroundColor: 'green',
					borderBottomLeftRadius: '10px',
					borderBottomRightRadius: '10px',
				}}
			>
				{props.displayedLanguages.map(language => {
					return (
						<p
							className="languagesdisplay-item"
							style={{ padding: '4px', boxSizing: 'border-box' }}
							onClick={props.selectedLanguageHandler}
							name={language}
							key={language + 'me'}
						>
							{language}
						</p>
					);
				})}
			</div>
		);
	} else {
		return <div />;
	}
}
