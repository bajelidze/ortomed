export function numericRules(value: string, min: number, max: number): (boolean|string)[] {
  return [
    value != null || 'The value must not be empty',
    !isNaN(+value) || 'The value must be a number',
    +value >= min || `The value must be greater than or equal ${min}`,
    +value < max || `The value must be less than ${max}`,
  ];
}

export function nameRules(name: string, maxLength: number): (boolean|string)[] {
  return [
    name.length > 0 || 'The name must not be empty',
    name.length <= maxLength || `The name length must be less than or equal ${maxLength}`,
  ];
}
