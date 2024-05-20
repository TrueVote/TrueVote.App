import { CandidateModel } from '@/TrueVote.Api';
import _ from 'lodash';

export const formatCandidateName: any = (candidate: CandidateModel) =>
  candidate.Name +
  (candidate.PartyAffiliation !== undefined &&
  candidate?.PartyAffiliation?.length !== undefined &&
  candidate?.PartyAffiliation?.length > 0
    ? ', ' + candidate.PartyAffiliation
    : '');

const bdiff = (a: any, b: any): any =>
  _.reduce(
    a,
    (res, val, key) =>
      res.concat(
        (_.isPlainObject(val) || _.isArray(val)) && b
          ? bdiff(val, b[key]).map((x: string) => key + '.' + x)
          : !b || val != b[key]
          ? [key]
          : [],
      ),
    [],
  );

export const objectDifference = (a: any, b: any): any => {
  const u = bdiff(a, b),
    v = bdiff(b, a);
  return u
    .filter((x: any) => !v.includes(x))
    .map((x: string) => ' < ' + x)
    .concat(u.filter((x: any) => v.includes(x)).map((x: string) => ' | ' + x))
    .concat(v.filter((x: any) => !u.includes(x)).map((x: string) => ' > ' + x));
};

// Fake function to simulate a delay
export const delay: any = async (ms: number): Promise<void> => {
  await new Promise<void>((resolve: any) => setTimeout(() => resolve(), ms)).then(() =>
    console.info('Delay Fired', ms),
  );
};

// Function to convert Uint8Array to a regular array
export const uint8ArrayToArray: (uint8Array: Uint8Array) => number[] = (uint8Array: Uint8Array) => {
  return Array.from(uint8Array);
};

// Function to convert string to Uint8Array
export const stringToUint8Array: (str: string) => Uint8Array = (str: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};
