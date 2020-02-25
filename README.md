# Carbon Field: `rest_multiselect`

Prov

Adds a `rest_multiselect` field type to Carbon Fields 3. Install using Composer:

```cli
composer require iamntz/carbon-rest-multiselect:^3.0
```

For Carbon Fields 2 (legacy):

```cli
composer require iamntz/carbon-rest-multiselect:^2.0"
```

Usage:

```php
Field::make('rest_multiselect', 'my-name', 'My Label')
  ->set_endpoint( 'base', get_rest_url( null, 'wp/v2/posts' ) )
  ->set_endpoint( 'search', get_rest_url( null, 'wp/v2/posts/?search=' ) )
  ->set_endpoint( 'fetch_by_id', get_rest_url( null, 'wp/v2/posts/?include=' ) ) // endpoint used to look up for saved posts
  ->set_value_key('id') // the REST response key to use as a value in the select
  ->set_selection_limit(999) // what's the maximum amount of selectable items.
  ->set_label_key('title.rendered') // OR
  ->set_label_key(['date', 'title.rendered']) // the REST response key to use as a label in the select
```

**ALL** endpoints are required!
If needed, you can specify nonces (or extra variables) directly on the endpoint url: `get_rest_url( null, "wp/v2/posts/?nonce={$generated_nonce}&search=" )`

#### `set_label_key`

This one is as extensible as it gets: you can use either a string, a dotted string (so it will search for children) or an array that will be combined in to a nicely formatted string.

You can also set some transformations on labels:

```php
->set_label_key(['title.rendered|substring:0,10|toUpperCase', 'date|wrap(%label%)']);
```

Basically any JS prototype function that's callable on a string.

There is an exception: you can use a `wrap` transform that will ... well, wrap your label.

#### `set_selection_limit`
You can set what's the maximum amount of selectable items. This will work ad infinitum, without any limit or warning (just like regular HTML `select` tag works). So any new selection will be appended to the existing items, therefore if the limit is reached, then the first element of the selection is lost, the new element will be appended.

Basically if you add `->set_selection_limit(1)` you make the field to behave just like a regular HTML `select`.

#### Return Value
The field will _always_ return an array of items, with values picked form the key set via `set_value_key('id')` method.

#### Credits
**Heavily** inspired by @elvishp2006's [awesome plugin](https://github.com/elvishp2006/carbon-field-rest-api-select). Unfortunately, there is no way of extending that one to allow multiple selection without breaking compatibility (different storage and such).


### Support me
You can get [hosting](https://m.do.co/c/c95a44d0e992), [donate](https://www.paypal.me/iamntz) or be my [patreon](https://www.patreon.com/iamntz).

### License

The code is released under MIT license.
