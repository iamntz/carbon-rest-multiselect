/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState, setStatic } from 'recompose';

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
				delimiter="|"
				disabled={!field.ui.is_visible}
				defaultOptions={field.value}
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

const resolve = (path, obj) => path.split('.')
	.reduce((prev, curr) => (prev ? prev[curr] : null), obj);

export const enhance = compose(
	withStore(),
	withSetup(),
  withState('selected', 'setSelected'),

	withHandlers({
		handleChange: ({ field, setFieldValue, setSelected }) => (value) => {
			console.log(value);
			setFieldValue(field.id, value);
		},

		loadOptions: ({field, setSelected}) => (searchQuery) => {
			let parseData = (data) => {
				return {
					value: resolve('id', data),
					label: resolve('title.rendered', data),
				};
			}


			let baseEndpoint = '/wp-json/wp/v2/events';
			let searchEndpoint = `${baseEndpoint}/?search=`;
			let fetchByIdsEndpoint = `${baseEndpoint}/?include=`;
			let fetchByIdEndpointSeparator = ',';

			let endpoint = baseEndpoint;

			console.log(field.value);
			if (field.value.length) {
			  endpoint = fetchByIdsEndpoint + field.value.join(fetchByIdEndpointSeparator);
			}

			if (searchQuery.length) {
			  endpoint = searchEndpoint + searchQuery;
			}

			return fetch(endpoint)
				.then(r => r.json())
				.then(data => {
          console.log('parsed: ', data.map(parseData));
          setSelected([data.map(parseData)]);

          return data.map(parseData);
        })
		},
	}),
);

export default setStatic('type', ['rest_multiselect'])(
	enhance(rest_multiselect),
);
