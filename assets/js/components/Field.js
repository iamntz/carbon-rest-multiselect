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
				value={field.value && typeof field.value[0] === 'object' ? field.value : []}
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
	}),
	handleChange: PropTypes.func,
	loadOptions: PropTypes.func,
};

const resolve = (path, obj) =>
	path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

const getFetchPromise = (endpoint, setSelected = null) => {
	let parseData = (data) => {
		return {
			value: resolve('id', data),
			label: resolve('title.rendered', data),
		};
	};

	return fetch(endpoint)
		.then((r) => r.json())
		.then((data) => {
			if ('function' === typeof setSelected) {
				setSelected([data])
			}
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

			if (field.value) {
				let value = field.value.join(',');
				getFetchPromise(field.fetch_by_id_endpoint + value, setSelected).then((data) => {
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

			return getFetchPromise(endpoint, setSelected);
		},
	}),
);

export default setStatic('type', ['rest_multiselect'])(
	enhance(rest_multiselect),
);
