<?php
use Carbon_Fields\Carbon_Fields;
use iamntz\Rest_Multiselect\Rest_Multiselect_Field;

define( 'CARBON_REST_MULTISELECT_DIR', __DIR__ );

Carbon_Fields::extend( Rest_Multiselect_Field::class, function( $container ) {
	return new Rest_Multiselect_Field( $container['arguments']['type'], $container['arguments']['name'], $container['arguments']['label'] );
} );
