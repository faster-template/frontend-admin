import { AnyObject, Options } from '@/types';

export function object2Options(obj: AnyObject): Options[] {
  return Object.keys(obj).map((key) => {
    return {
      value: key,
      label: obj[key] as string,
    };
  });
}

export default null;
