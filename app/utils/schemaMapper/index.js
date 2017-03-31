import { List, fromJS } from 'immutable';
import Schema from './Schema';

export default class SchemaMapper {
  static map(schema, normalizedObj, locale) {
    if (!normalizedObj) {
      return fromJS({ });
    }
    // If it's an array then apply the schema on each item
    if (List.isList(normalizedObj)) {
      return normalizedObj.map((obj) => SchemaMapper.map(schema, obj, locale));
    }
    const mapper = new Schema(schema, locale);
    return mapper.map(normalizedObj);
  }
}
