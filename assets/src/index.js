/**
 * The internal dependencies.
 */
import { registerFieldType } from '@carbon-fields/core';
import './style.scss';

import Field from './Field';

registerFieldType('rest_multiselect', Field);
