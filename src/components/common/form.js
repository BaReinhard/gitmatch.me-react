import React from 'react';

export default function GitMatchForm(props) {
	return (
		<form className="" onSubmit={props.GitMatch}>
			<label htmlFor="username">
				Get matched with nearby developers instantly!
			</label>
			<input
				name="username"
				type="text"
				value={props.username}
				className="form-control"
				onChange={props.input}
				onClick={props.select}
			/>

			<button type="submit" className="btn btn-primary">
				<span className="glyphicon glyphicon-plus" />Match Me
			</button>
		</form>
	);
}
