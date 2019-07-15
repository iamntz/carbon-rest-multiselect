/**
 * External dependencies.
 */
import {Component} from '@wordpress/element';
import {isArray} from 'lodash';
import he from 'he';

import AsyncSelect from 'react-select/async';

import labelTransforms from './inc/transforms';

import resolve from './inc/resolve';

class Field extends Component {
  state = {
    loaded: false,
    parsedValue: [],
  }

  componentDidMount() {
  }

  componentWillMount() {
    const {field, value} = this.props;

    if (value.length && field.fetch_by_id_endpoint.length) {
      this.preloadSavedValues();
    } else {
      this.setState({
        loaded: true,
      });
    }
  }

  preloadSavedValues() {
    const {field} = this.props;

    const value = field.value.join(',');

    this.fetch(field.fetch_by_id_endpoint + value).then(data => {

      this.setState({
        loaded: true,
        parsedValue: data
      })
    })
  }

  fetch(endpoint) {
    const {field} = this.props;

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

    return fetch(endpoint)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
      })
      .then((r) => r.json())
      .then((data) => {
        return data.map(parseData);
      })
      .catch((error) => {
        console.warn("Something went wrong on fetching. Are you sure you set the correct endpoints?");
        console.error(error)
      })
  }

  loadOptions(query) {
    return this.fetch(this.props.field.search_endpoint + query);
  }

  limitResults(results) {
    const {selection_limit} = this.props.field;

    if (results && results.length && selection_limit > 0) {
      results = results.slice(results.length - selection_limit);
    }

    return results;
  }

  onChange(selectedValues) {
    const {id, onChange} = this.props;

    let value = this.limitResults(selectedValues);

    this.setState({
      parsedValue: value
    });

    value = !value ? null : value.map(selectedValue => selectedValue.value).join(this.props.field.value_delimiter);

    onChange(id, value);
  }

  render() {
    const {field, value} = this.props;

    if (!this.state.loaded) {
      return (<div>Loading...</div>);
    }

    return (
      <div>
        <AsyncSelect
          isMulti
          defaultOptions
          value={this.state.parsedValue}
          loadOptions={(query) => this.loadOptions(query)}
          onChange={(e) => this.onChange(e)}
        />

        <input type="hidden" name={this.props.name} value={this.props.value}/>
      </div>
    );
  }
}


export default Field;
