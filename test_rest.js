const PROJECT_ID = "project-f784e72e-e435-42c2-bff";

function toFirestore(obj) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') result[key] = { stringValue: val };
    else if (typeof val === 'number') result[key] = { integerValue: val.toString() };
    else if (typeof val === 'boolean') result[key] = { booleanValue: val };
    else if (Array.isArray(val)) result[key] = { arrayValue: { values: val.map(v => toFirestore({_:v})._) } };
    else if (val === null) result[key] = { nullValue: null };
    else if (typeof val === 'object') result[key] = { mapValue: { fields: toFirestore(val) } };
  }
  return result;
}

function fromFirestore(fields) {
  if (!fields) return {};
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    if ('stringValue' in val) result[key] = val.stringValue;
    else if ('integerValue' in val) result[key] = parseInt(val.integerValue);
    else if ('booleanValue' in val) result[key] = val.booleanValue;
    else if ('arrayValue' in val) result[key] = (val.arrayValue.values || []).map(v => fromFirestore({_:v})._);
    else if ('mapValue' in val) result[key] = fromFirestore(val.mapValue.fields);
    else if ('nullValue' in val) result[key] = null;
  }
  return result;
}

const data = {
  name: "John",
  age: 20,
  isStudent: true,
  tags: ["a", "b"],
  nested: { foo: "bar" }
};

console.log(JSON.stringify(toFirestore(data), null, 2));
console.log(JSON.stringify(fromFirestore(toFirestore(data)), null, 2));
