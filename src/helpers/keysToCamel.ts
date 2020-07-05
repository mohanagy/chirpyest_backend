// https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript

const isDate = (a: Date) => {
  return a instanceof Date;
};

const isArray = (a: any[]) => {
  return Array.isArray(a);
};

const isObject = (o: any) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const keysToCamel = (o: any) => {
  if (isObject(o) && !isDate(o)) {
    const n: any = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i: string) => {
      return keysToCamel(i);
    });
  }

  return o;
};

export default keysToCamel;
