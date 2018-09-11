<?php

namespace iamntz\Rest_Multiselect;

use Carbon_Fields\Field\Predefined_Options_Field;
use Carbon_Fields\Helper\Delimiter;
use Carbon_Fields\Value_Set\Value_Set;

class Rest_Multiselect_Field extends Predefined_Options_Field
{
	protected $endpoints = [];
	protected $value_delimiter = '|';

	public static function admin_enqueue_scripts()
	{
		$root_uri = \Carbon_Fields\Carbon_Fields::directory_to_url(CARBON_REST_MULTISELECT_DIR);

		wp_enqueue_script('rest-multiselect', $root_uri . '/assets/js/bundle.js', ['carbon-fields-boot']);
		wp_enqueue_style('rest-multiselect', $root_uri . '/assets/css/field.css');
	}

	public function set_endpoint($name, $endpoint)
	{
		$this->endpoints[$name] = $endpoint;

		return $this;
	}

	public function __construct($type, $name, $label)
	{
		$this->set_value_set(new Value_Set(Value_Set::TYPE_MULTIPLE_VALUES));
		parent::__construct($type, $name, $label);
	}

	/**
	 * Load the field value from an input array based on its name
	 *
	 * @param array $input Array of field names and values.
	 */
	public function set_value_from_input($input)
	{
		if (!isset($input[$this->get_name()])) {
			return $this->set_value(array());
		}

		$value = stripslashes_deep($input[$this->get_name()]);

		$value = Delimiter::split($value, $this->value_delimiter);

		$value = array_map(function ($val) {
			return Delimiter::unquote($val, $this->value_delimiter);
		}, $value);

		return $this->set_value($value);
	}

	/**
	 * Returns an array that holds the field data, suitable for JSON representation.
	 *
	 * @param bool $load  Should the value be loaded from the database or use the value from the current instance.
	 * @return array
	 */
	public function to_json($load)
	{
		$field_data = parent::to_json($load);

		$field_data['value'] = array_filter($field_data['value']);

		$this->endpoints['base'] = $this->endpoints['base'] ?? '/';

		$field_data = array_merge($field_data, [
			'value_delimiter' => $this->value_delimiter,
			'base_endpoint' => $this->endpoints['base'],
			'search_endpoint' => $this->endpoint['search'] ?? $this->endpoints['base'] . '/?search=',
			'fetch_by_id_endpoint' => $this->endpoint['fetch_by_id'] ?? $this->endpoints['base'] . '/?include=',
		]);

		return $field_data;
	}
}
