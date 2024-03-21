const pick = <T extends Record<string, unknown>, Q extends keyof T>(
  obj: T,
  keyArray: Q[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keyArray) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
