# Carbon Field: rest_multiselect

carbon rest multiselect

Adds a `rest_multiselect` field type to Carbon Fields. Install using Composer:

```cli
composer require iamntz/carbon-rest-multiselect
```

Usage:

```php
Field::make('rest_multiselect', 'my-name', 'My Label')
  ->set_endpoint( 'base', rest_url( 'wp/v2/posts' ) )
  ->set_endpoint( 'search', rest_url( 'wp/v2/posts/?search=' ) )
  ->set_endpoint( 'fetch_by_id', rest_url( 'wp/v2/posts/?include=' ) ) // endpoint used to look up for saved posts
```

#### Credits
**Heavily** inspired from [this awesome plugin](https://github.com/elvishp2006/carbon-field-rest-api-select). Unfortunately, there is no way of extending that one to allow multiple selection without breaking compatibility (different storage and such).


### Support me
You can get [hosting](https://m.do.co/c/c95a44d0e992), [donate](https://www.paypal.me/iamntz) or buy me a [gift](http://iamntz.com/wishlist).

### License

The code is released under MIT license.