/**
 * External dependencies.
 */
import { Component } from '@wordpress/element';
import { isArray } from 'lodash';
import he from 'he';

import Async from 'react-select/async';

import labelTransforms from './inc/transforms';

import resolve from './inc/resolve';

class Field extends Component {
	state = {
		optionsLoaded: false,
		selectedValues: [],
	};

	fetchDebounce = null;
	abortFetchSignal = null;

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.prepareSelectedValue();
	}

	fetch(endpoint, callback) {
		try {
			window.clearTimeout(this.fetchDebounce);
		} catch (e) {
		}

		this.fetchDebounce = window.setTimeout(() => {
			this._fetch(endpoint, callback);
		}, 100);
	}

	_fetch(endpoint, callback, withAbort = true) {
		const { field } = this.props;

		const parseData = (data) => {
			let label;

			if (isArray(field.label_key)) {
				label = field.label_key
					.map((piece) => labelTransforms(piece, data))
					.join(' ');
			} else {
				label = labelTransforms(field.label_key, data);
			}

			return {
				value: resolve(field.value_key, data),
				label: he.decode(label),
			};
		};

		let signal = null;

		if (withAbort) {
			try {
				this.abortFetchSignal.abort();
			} catch (e) {
			}
			this.abortFetchSignal = new AbortController();
			signal = this.abortFetchSignal.signal;
		}


		return fetch(endpoint, {
			signal,
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (response.ok) {
					return response;
				}

				throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
			})
			.then((r) => r.json())
			.then((data) => {
				console.log(data.map(parseData));
				return callback(data.map(parseData));
			})
			.catch((error) => {
				console.warn('Something went wrong on fetching. Are you sure you set the correct endpoints?');
				console.error(error);
			});
	}

	loadOptions(query, callback) {
		this.fetch(this.props.field.search_endpoint + query, callback);
	}

	limitResults(results) {
		const { selection_limit } = this.props.field;

		if (results && results.length && selection_limit > 0) {
			results = results.slice(results.length - selection_limit);
		}

		return results;
	}

	handleOnChange(selectedValues) {
		const { id, onChange } = this.props;

		let value = this.limitResults(selectedValues);

		this.setState({
			...this.state,
			selectedValues: value,
		});

		value = !value ? null : value.map(selectedValue => selectedValue.value);

		onChange(id, value);
	}

	prepareSelectedValue() {
		const { value, field } = this.props;

		if (this.state.optionsLoaded) {
			return;
		}

		console.log('====================================');
		console.log('====================================');
		console.log(value);
		console.log('====================================');
		console.log('====================================');
		if (!value.length) {
			this.setState({
				...this.state,
				optionsLoaded: true,
			});

			return;
		}

		const endpoint = field.fetch_by_id_endpoint + value.join(',');

		this._fetch(endpoint, (data) => {
			this.setState({
				...this.state,
				selectedValues: data,
				optionsLoaded: true,
			});
		}, false);
	}

	render() {
		const { field, name } = this.props;

		return (
			<Async
				name={`${name}[]`}
				closeMenuOnSelect={false}
				isDisabled={!this.props.visible || !this.state.optionsLoaded}

				onChange={this.handleOnChange.bind(this)}
				loadOptions={(query, callback) => this.loadOptions(query, callback)}

				value={this.state.selectedValues}

				delimiter={field.valueDelimiter}
				cacheOptions
				defaultOptions
				isMulti
			/>
		);
	}
}


export default Field;
