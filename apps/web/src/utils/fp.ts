// short and simple functional programming typescript stuff

// use for errors
export interface Left<E> {
  tag: 'left';
  value: E;
}

// use for results
export interface Right<R> {
  tag: 'right';
  value: R;
}

export type Either<E, R> = Left<E> | Right<R>;

export const left = <T>(val: T): Left<T> => {
  return {
    tag: 'left',
    value: val,
  };
};

export const right = <T>(val: T): Right<T> => {
  return {
    tag: 'right',
    value: val,
  };
};

export const isRight = <L,R>(check: Left<L> | Right<R>): boolean => {
  return check.tag === 'right';
};
