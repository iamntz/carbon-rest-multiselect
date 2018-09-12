/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
	compose,
	withHandlers,
	withState,
	setStatic,
	lifecycle,
} from 'recompose';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';

import AsyncSelect from 'react-select/lib/Async';
import he from 'he';
import { isObject, isArray } from 'lodash';
export const rest_multiselect = ({
	name,
	field,
	handleChange,
	loadOptions,
}) => {
	return (
		<Field field={field}>
			<AsyncSelect
				name={name}
				value={
					field.value && typeof field.value[0] === 'object' ? field.value : []
				}
				delimiter={field.value_delimiter}
				disabled={!field.ui.is_visible}
				loadOptions={loadOptions}
				onChange={handleChange}
				isMulti
				cacheOptions
				defaultOptions
			/>
		</Field>
	);
};

rest_multiselect.propTypes = {
	name: PropTypes.string,
	field: PropTypes.shape({
		id: PropTypes.string,
		value: PropTypes.array,

		label_key: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array
		]),

		value_key: PropTypes.string,

		value_delimiter: PropTypes.string.isRequired,
		base_endpoint: PropTypes.string.isRequired,
		search_endpoint: PropTypes.string.isRequired,
		fetch_by_id_endpoint: PropTypes.string.isRequired,
	}),

	handleChange: PropTypes.func,
	loadOptions: PropTypes.func,
};

const resolve = (path, obj) =>
	path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

const getFetchPromise = (endpoint, setSelected, field) => {
	let parseData = (data) => {
		let label;
		if (isArray(field.label_key)) {
			label = field.label_key.map((piece) => resolve(piece, data)).join(' ');
		} else {
			label = resolve(field.label_key, data);
		}

		return {
			value: resolve(field.value_key, data),
			label: he.decode(label),
		};
	};

	return fetch(endpoint)
		.then((r) => r.json())
		.then((data) => {
			setSelected([data]);
			return data.map(parseData);
		});
};

export const enhance = compose(
	withStore(),
	withSetup(),
	withState('selected', 'setSelected'),

	lifecycle({
		componentWillMount() {
			let { field, setFieldValue, setSelected } = this.props;

			if (field.value.length && field.fetch_by_id_endpoint.length) {
				let value = field.value.join(',');
				getFetchPromise(
					field.fetch_by_id_endpoint + value,
					setSelected,
					field,
				).then((data) => {
					setFieldValue(field.id, data);
				});
			}
		},
	}),

	withHandlers({
		handleChange: ({ field, setFieldValue, setSelected }) => (value) => {
			setFieldValue(field.id, value);
		},

		loadOptions: ({ field, setSelected }) => (q) => {
			let endpoint = q.length
				? `${field.search_endpoint}${q}`
				: field.base_endpoint;

			return getFetchPromise(endpoint, setSelected, field);
		},
	}),
);

export default setStatic('type', ['rest_multiselect'])(
	enhance(rest_multiselect),
);
