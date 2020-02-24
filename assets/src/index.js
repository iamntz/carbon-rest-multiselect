/**
 * The internal dependencies.
 */
import { registerFieldType } from '@carbon-fields/core';
import './style.scss';

import Field from './field';

registerFieldType('rest_multiselect', Field);
