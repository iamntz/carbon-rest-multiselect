# Carbon Field: rest_multiselect

carbon rest multiselect

Adds a `rest_multiselect` field type to Carbon Fields. Install using Composer:

```cli
composer require iamntz/carbon-rest-multiselect
```

Usage:

```php
Field::make('rest_multiselect', 'my-name', 'My Label')
  ->set_endpoint( 'base', get_rest_url( null, 'wp/v2/posts' ) )
  ->set_endpoint( 'search', get_rest_url( null, 'wp/v2/posts/?search=' ) )
  ->set_endpoint( 'fetch_by_id', get_rest_url( null, 'wp/v2/posts/?include=' ) ) // endpoint used to look up for saved posts
  ->set_value_key('id') // the REST response key to use as a value in the select
  ->set_label_key('title.rendered') // OR
  ->set_label_key(['date', 'title.rendered']); // the REST response key to use as a label in the select
```

**ALL** endpoints are required!

#### `set_label_key`

This one is as extensible as it gets: you can use either a string, a dotted string (so it will search for children) or an array that will be combined in to a nicely formatted string.

You can also set some transformations on labels:

```php
->set_label_key(['title.rendered|substring:0,10|toUpperCase', 'date|wrap(%label%)']);
```

Basically any JS prototype function that's callable on a string.

There is an exception: you can use a `wrap` transform that will ... well, wrapp your label.

#### Credits
**Heavily** inspired by @elvishp2006's [awesome plugin](https://github.com/elvishp2006/carbon-field-rest-api-select). Unfortunately, there is no way of extending that one to allow multiple selection without breaking compatibility (different storage and such).


### Support me
You can get [hosting](https://m.do.co/c/c95a44d0e992), [donate](https://www.paypal.me/iamntz) or buy me a [gift](http://iamntz.com/wishlist).

### License

The code is released under MIT license.