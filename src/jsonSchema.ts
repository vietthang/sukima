/** @internal */
export type PropertyMap = {
  [key: string]: JsonSchema;
};

/** @internal */
export interface JsonSchema {
  /**
   * The "id" keyword (or "id", for short) is used to alter the resolution scope. When an id is encountered, an
   * implementation MUST resolve this id against the most immediate parent scope. The resolved URI will be the new
   * resolution scope for this subschema and all its children, until another id is encountered.
   *
   * When using "id" to alter resolution scopes, schema authors SHOULD ensure that resolution scopes are unique within
   * the schema.
   */
  id?: string;
  /**
   * The "$schema" keyword is both used as a JSON Schema version identifier and the location of a resource which is
   * itself a JSON Schema, which describes any schema written for this particular version.
   */
  $schema?: string;
  /**
   * Inlines a valid JSON schema reference.
   */
  $ref?: string;
  /**
   * Decorate a user interface with information about the data produced by this user interface. A title will preferrably
   * be short.
   */
  title?: string;
  /**
   * A description will provide explanation about the purpose of the instance described by this schema.
   */
  description?: string;
  /**
   * This keyword can be used to supply a default JSON value associated with a particular schema. It is RECOMMENDED that
   * a default value be valid against the associated schema.
   */
  'default'?: any;
  /**
   * The value of "multipleOf" MUST be a JSON number. This number MUST be strictly greater than 0.
   */
  multipleOf?: number;
  /**
   * The value of "maximum" MUST be a JSON number.
   */
  maximum?: number;
  /**
   * The value of "exclusiveMaximum" MUST be a boolean.
   *
   * If "exclusiveMaximum" is present, "maximum" MUST also be present.
   */
  exclusiveMaximum?: boolean;
  /**
   * The value of "minimum" MUST be a JSON number.
   */
  minimum?: number;
  /**
   * The value of "exclusiveMinimum" MUST be a boolean.
   *
   * If "exclusiveMinimum" is present, "minimum" MUST also be present.
   */
  exclusiveMinimum?: boolean;
  /**
   * The value of this keyword MUST be an integer. This integer MUST be greater than, or equal to, 0.
   */
  maxLength?: number;
  /**
   * The value of this keyword MUST be an integer. This integer MUST be greater than, or equal to, 0.
   */
  minLength?: number;
  /**
   * The value of this keyword MUST be a string. This string SHOULD be a valid regular expression, according to the
   * ECMA 262 regular expression dialect.
   */
  pattern?: string;
  /**
   * The value of "additionalItems" MUST be either a boolean or an object. If it is an object, this object MUST be a
   * valid JSON Schema.
   */
  additionalItems?: boolean | JsonSchema;
  /**
   * The value of "items" MUST be either an object or an array. If it is an object, this object MUST be a valid JSON
   * Schema. If it is an array, items of this array MUST be objects, and each of these objects MUST be a valid JSON
   * Schema.
   */
  items?: JsonSchema | JsonSchema[];
  /**
   * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.
   */
  maxItems?: number;
  /**
   * An array instance is valid against "minItems" if its size is greater than, or equal to, the value of this keyword.
   */
  minItems?: number;
  /**
   * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the
   * instance validates successfully if all of its elements are unique.
   */
  uniqueItems?: boolean;
  /**
   * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the
   * value of this keyword.
   */
  maxProperties?: number;
  /**
   * An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the
   * value of this keyword.
   */
  minProperties?: number;
  /**
   * An object instance is valid against this keyword if its property set contains all elements in this keyword's array
   * value.
   */
  required?: string[];
  /**
   * The value of "additionalProperties" MUST be a boolean or an object. If it is an object, it MUST also be a valid
   * JSON Schema.
   */
  additionalProperties?: boolean | JsonSchema;
  /**
   * The value of "properties" MUST be an object. Each value of this object MUST be an object, and each object MUST be a
   * valid JSON Schema.
   */
  properties?: PropertyMap;
  /**
   * The value of "patternProperties" MUST be an object. Each property name of this object SHOULD be a valid regular
   * expression, according to the ECMA 262 regular expression dialect. Each property value of this object MUST be an
   * object, and each object MUST be a valid JSON Schema.
   */
  patternProperties?: PropertyMap;
  /**
   * This keyword's value MUST be an object. Each value of this object MUST be either an object or an array.
   *
   * If the value is an object, it MUST be a valid JSON Schema. This is called a schema dependency.
   *
   * If the value is an array, it MUST have at least one element. Each element MUST be a string, and elements in the
   * array MUST be unique. This is called a property dependency.
   */
  dependencies?: {
    [key: string]: JsonSchema | string[];
  };
  /**
   * The value of this keyword MUST be an array. This array MUST have at least one element. Elements in the array MUST
   * be unique.
   *
   * Elements in the array MAY be of any type, including null.
   *
   * An instance validates successfully against this keyword if its value is equal to one of the elements in this
   * keyword's array value.
   */
  enum?: any[];
  /**
   * The value of this keyword MUST be either a string or an array. If it is an array, elements of the array MUST be
   * strings and MUST be unique.
   *
   * String values MUST be one of the seven primitive types defined by the core specification.
   *
   * An instance matches successfully if its primitive type is one of the types defined by keyword. Recall: "number"
   * includes "integer".
   */
  type?: string | string[];
  /**
   * This keyword's value MUST be an array. This array MUST have at least one element.
   *
   * Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates successfully against all schemas defined by
   * this keyword's value.
   */
  allOf?: JsonSchema[];
  /**
   * This keyword's value MUST be an array. This array MUST have at least one element.
   *
   * Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates successfully against at least one schema
   * defined by this keyword's value.
   */
  anyOf?: JsonSchema[];
  /**
   * This keyword's value MUST be an array. This array MUST have at least one element.
   *
   * Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates successfully against exactly one schema
   * defined by this keyword's value.
   */
  oneOf?: JsonSchema[];
  /**
   * This keyword's value MUST be an object. This object MUST be a valid JSON Schema.
   *
   * An instance is valid against this keyword if it fails to validate successfully against the schema defined by this
   * keyword.
   */
  not?: JsonSchema;
  /**
   * This keyword's value MUST be an object. Each member value of this object MUST be a valid JSON Schema.
   *
   * This keyword plays no role in validation per se. Its role is to provide a standardized location for schema authors
   * to inline JSON Schemas into a more general schema.
   */
  definitions?: {
    [key: string]: JsonSchema;
  };
  /**
   * Structural validation alone may be insufficient to validate that an instance meets all the requirements of an
   * application. The "format" keyword is defined to allow interoperable semantic validation for a fixed subset of
   * values which are accurately described by authoritative resources, be they RFCs or other external specifications.
   *
   * The value of this keyword is called a format attribute. It MUST be a string. A format attribute can generally only
   * validate a given set of instance types. If the type of the instance to validate is not in this set, validation for
   * this format attribute and instance SHOULD succeed.
   */
  format?: 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | string;

}
