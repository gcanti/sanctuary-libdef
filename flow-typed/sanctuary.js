declare module 'sanctuary' {

  declare type Type = any;

  declare type Accessible = Object;

  declare type TypeRep<A> = (a: any, ...rest: Array<void>) => A;

  declare type Fn1<A, B> = (a: A, ...rest: Array<void>) => B;
  declare type Fn2<A, B, C> = (a: A, b: B, ...rest: Array<void>) => C;
  declare type Fn3<A, B, C, D> = (a: A, b: B, c: C, ...rest: Array<void>) => D;
  declare type Fn4<A, B, C, D, E> = (a: A, b: B, c: C, d: D, ...rest: Array<void>) => E;

  declare type FixedCurried2<A, B, C> = Fn1<A, Fn1<B, C>>;
  declare type FixedCurried3<A, B, C, D> = Fn1<A, FixedCurried2<B, C, D>>;
  declare type FixedCurried4<A, B, C, D, E> = Fn1<A, FixedCurried3<B, C, D, E>>;

  declare type CurriedFn2<A, B, C> =
    & Fn1<A, Fn1<B, C>>
    & Fn2<A, B, C>;
  declare type CurriedFn3<A, B, C, D> =
    & Fn1<A, CurriedFn2<B, C, D>>
    & Fn2<A, B, Fn1<C, D>>
    & Fn3<A, B, C, D>;
  declare type CurriedFn4<A, B, C, D, E> =
    & Fn1<A, CurriedFn3<B, C, D, E>>
    & Fn2<A, B, CurriedFn2<C, D, E>>
    & Fn3<A, B, C, Fn1<D, E>>
    & Fn4<A, B, C, D, E>;

  declare interface Semigroup<A> {
    concat(x: A, y: A, ...rest: Array<void>): A;
  }

  declare interface Functor<A> {
    map<B>(f: Fn1<A, B>, ...rest: Array<void>): Functor<B>;
  }

  declare interface Apply<A> extends Functor<A> {
    ap<B>(ff: any): Apply<B>; // FIXME can we do better with ff?
  }

  declare interface Foldable<A> {
    reduce<B>(f: (b: B, a: A) => B, b: B, ...rest: Array<void>): B; // <= do not use Fn2 for f because arrays pass in more arguments (currentIndex: number, array: Array<T>)
  }

  declare type Alternative = any; // FIXME can we do better?

  declare type Ord = any; // FIXME can we do better?

  //
  // Classify
  //

  // type :: a -> String
  declare function type(a: any, ...rest: Array<void>): string;

  // is :: TypeRep a -> b -> Boolean
  declare function is<A>(typeRep: TypeRep<A>, ...rest: Array<void>): Fn1<any, boolean>;
  declare function is<A>(typeRep: TypeRep<A>, b: any, ...rest: Array<void>): boolean;

  //
  // Combinator
  //

  // I :: a -> a
  declare function I<A>(a: A, ...rest: Array<void>): A;

  // K :: a -> b -> a
  declare function K<A>(a: A, ...rest: Array<void>): Fn1<any, A>;
  declare function K<A>(a: A, b: any): A;

  // A :: (a -> b) -> a -> b
  declare function A<A, B>(f: Fn1<A, B>, ...rest: Array<void>): Fn1<A, B>;
  declare function A<A, B>(f: Fn1<A, B>, a: A, ...rest: Array<void>): B;

  // T :: a -> (a -> b) -> b
  declare function T<A, B>(a: A, ...rest: Array<void>): Fn1<Fn1<A, B>, B>;
  declare function T<A, B>(a: A, f: Fn1<A, B>, ...rest: Array<void>): B;

  // C :: (a -> b -> c) -> b -> a -> c
  declare function C<A, B, C>(f: FixedCurried2<A, B, C>, ...rest: Array<void>): CurriedFn2<B, A, C>;
  declare function C<A, B, C>(f: FixedCurried2<A, B, C>, b: B, ...rest: Array<void>): Fn1<A, C>;
  declare function C<A, B, C>(f: FixedCurried2<A, B, C>, b: B, a: A, ...rest: Array<void>): C;

  // B :: (b -> c) -> (a -> b) -> a -> c
  declare function B<A, B, C>(f: Fn1<B, C>, ...rest: Array<void>): CurriedFn2<Fn1<A, B>, A, C>;
  declare function B<A, B, C>(f: Fn1<B, C>, g: Fn1<A, B>, ...rest: Array<void>): Fn1<A, C>;
  declare function B<A, B, C>(f: Fn1<B, C>, g: Fn1<A, B>, a: A, ...rest: Array<void>): C;

  // S :: (a -> b -> c) -> (a -> b) -> a -> c
  declare function S<A, B, C>(f: FixedCurried2<A, B, C>, ...rest: Array<void>): CurriedFn2<Fn1<A, B>, A, C>;
  declare function S<A, B, C>(f: FixedCurried2<A, B, C>, g: Fn1<A, B>, ...rest: Array<void>): Fn1<A, C>;
  declare function S<A, B, C>(f: FixedCurried2<A, B, C>, g: Fn1<A, B>, a: A, ...rest: Array<void>): C;

  // flip :: ((a, b) -> c) -> b -> a -> c
  declare function flip<A, B, C>(f: Fn2<A, B, C>, ...rest: Array<void>): CurriedFn2<B, A, C>;
  declare function flip<A, B, C>(f: Fn2<A, B, C>, b: B, ...rest: Array<void>): Fn1<A, C>;
  declare function flip<A, B, C>(f: Fn2<A, B, C>, b: B, a: A, ...rest: Array<void>): C;

  // lift :: Functor f => (a -> b) -> f a -> f b
  declare function lift<A, B>(f: Fn1<A, B>, ...rest: Array<void>): Fn1<Functor<A>, Functor<B>>;
  declare function lift<A, B>(f: Fn1<A, B>, fa: Functor<A>, ...rest: Array<void>): Functor<B>;

  // lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
  declare function lift2<A, B, C>(f: FixedCurried2<A, B, C>, ...rest: Array<void>): CurriedFn2<Apply<A>, Apply<B>, Apply<C>>;
  declare function lift2<A, B, C>(f: FixedCurried2<A, B, C>, fa: Apply<A>, ...rest: Array<void>): Fn1<Apply<B>, Apply<C>>;
  declare function lift2<A, B, C>(f: FixedCurried2<A, B, C>, fa: Apply<A>, fb: Apply<B>, ...rest: Array<void>): Apply<C>;

  // lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
  declare function lift3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, ...rest: Array<void>): CurriedFn3<Apply<A>, Apply<B>, Apply<C>, Apply<D>>;
  declare function lift3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, fa: Apply<A>, ...rest: Array<void>): CurriedFn3<Apply<B>, Apply<C>, Apply<D>>;
  declare function lift3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, fa: Apply<A>, fb: Apply<B>, ...rest: Array<void>): Fn1<Apply<C>, Apply<D>>;
  declare function lift3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, fa: Apply<A>, fb: Apply<B>, fc: Apply<C>, ...rest: Array<void>): Apply<D>;

  // compose :: (b -> c) -> (a -> b) -> a -> c
  declare function compose<A, B, C>(bc: Fn1<B, C>, ...rest: Array<void>): CurriedFn2<Fn1<A, B>, A, C>;
  declare function compose<A, B, C>(bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, C>;
  declare function compose<A, B, C>(bc: Fn1<B, C>, ab: Fn1<A, B>, a: A, ...rest: Array<void>): C;

  // pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n
  declare function pipe<A, B, C>(fns: [Fn1<A, B>, Fn1<B, C>], ...rest: Array<void>): Fn1<A, C>;
  declare function pipe<A, B, C>(fns: [Fn1<A, B>, Fn1<B, C>], a: A, ...rest: Array<void>): C;
  declare function pipe<A, B, C, D>(fns: [Fn1<A, B>, Fn1<B, C>, Fn1<C, D>], ...rest: Array<void>): Fn1<A, D>;
  declare function pipe<A, B, C, D>(fns: [Fn1<A, B>, Fn1<B, C>, Fn1<C, D>], a: A, ...rest: Array<void>): D;
  declare function pipe<A, B, C, D, E>(fns: [Fn1<A, B>, Fn1<B, C>, Fn1<C, D>, Fn1<D, E>], ...rest: Array<void>): Fn1<A, E>;
  declare function pipe<A, B, C, D, E>(fns: [Fn1<A, B>, Fn1<B, C>, Fn1<C, D>, Fn1<D, E>], a: A, ...rest: Array<void>): E;
  declare function pipe<A, B, C, D, E, F>(fns: [Fn1<A, B>, Fn1<B, C>, Fn1<C, D>, Fn1<D, E>, Fn1<E, F>], ...rest: Array<void>): Fn1<A, F>;
  declare function pipe<A, B, C, D, E, F>(fns: [Fn1<A, B>, Fn1<B, C>, Fn1<C, D>, Fn1<D, E>, Fn1<E, F>], a: A, ...rest: Array<void>): F;

  //
  // Maybe
  //

  declare class Nothing {

    // Maybe#isNothing :: Boolean
    isNothing: true,

    // Maybe#isJust :: Boolean
    isJust: false,

    // Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
    ap<A, B>(ff: Maybe<Fn1<A, B>>, ...rest: Array<void>): Maybe<B>,

    // Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
    chain<A, B>(f: Fn1<A, Maybe<B>>, ...rest: Array<void>): Maybe<B>,

    // Maybe#concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
    concat<A>(x: Maybe<A>, ...rest: Array<void>): Maybe<A>,

    // Maybe#empty :: Maybe a ~> Maybe a
    empty(...rest: Array<void>): Nothing,

    // Maybe#equals :: Maybe a ~> Maybe b -> Boolean
    equals<B>(fb: Maybe<B>, ...rest: Array<void>): boolean,

    // Maybe#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
    extend<A>(f: Fn1<Maybe<A>, A>, ...rest: Array<void>): Maybe<A>,

    // Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a
    filter<A>(f: Fn1<A, boolean>, ...rest: Array<void>): Maybe<A>,

    // Maybe#map :: Maybe a ~> (a -> b) -> Maybe b
    map<A, B>(f: Fn1<A, B>, ...rest: Array<void>): Maybe<B>,

    // Maybe#of :: Maybe a ~> b -> Maybe b
    of<B>(b: B, ...rest: Array<void>): Maybe<B>,

    // Maybe#reduce :: Maybe a ~> ((b, a) -> b) -> b -> b
    reduce<A, B>(f: Fn2<B, A, B>, b: B, ...rest: Array<void>): B,
    reduce<A, B>(f: Fn2<B, A, B>, ...rest: Array<void>): Fn1<B, B>,

    // Maybe#sequence :: Applicative f => Maybe (f a) ~> (a -> f a) -> f (Maybe a)
    sequence<A>(f: Fn1<any, A>, ...rest: Array<void>): any, // <= warning: unsafe

    // Maybe#toBoolean :: Maybe a ~> Boolean
    toBoolean(...rest: Array<void>): boolean,

    // Maybe#inspect :: Maybe a ~> String
    inspect(...rest: Array<void>): string

  }

  declare class Just<A> {

    // Maybe#isNothing :: Boolean
    isNothing: false,

    // Maybe#isJust :: Boolean
    isJust: true,

    // Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
    ap<B>(ff: Maybe<Fn1<A, B>>, ...rest: Array<void>): Maybe<B>,

    // Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
    chain<B>(f: Fn1<A, Maybe<B>>, ...rest: Array<void>): Maybe<B>,

    // Maybe#concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
    concat(x: Maybe<A>, ...rest: Array<void>): Maybe<A>,

    // Maybe#empty :: Maybe a ~> Maybe a
    empty(...rest: Array<void>): Nothing,

    // Maybe#equals :: Maybe a ~> Maybe b -> Boolean
    equals<B>(fb: Maybe<B>, ...rest: Array<void>): boolean,

    // Maybe#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
    extend(f: Fn1<Maybe<A>, A>, ...rest: Array<void>): Maybe<A>,

    // Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a
    filter(f: Fn1<A, boolean>, ...rest: Array<void>): Maybe<A>,

    // Maybe#map :: Maybe a ~> (a -> b) -> Maybe b
    map<B>(f: Fn1<A, B>, ...rest: Array<void>): Maybe<B>,

    // Maybe#of :: Maybe a ~> b -> Maybe b
    of<B>(b: B): Maybe<B>,

    // Maybe#reduce :: Maybe a ~> ((b, a) -> b) -> b -> b
    reduce<B>(f: Fn2<B, A, B>, b: B, ...rest: Array<void>): B,
    reduce<B>(f: Fn2<B, A, B>, ...rest: Array<void>): Fn1<B, B>,

    // Maybe#sequence :: Applicative f => Maybe (f a) ~> (a -> f a) -> f (Maybe a)
    sequence(f: Fn1<any, A>, ...rest: Array<void>): any, // <= warning: unsafe

    // Maybe#toBoolean :: Maybe a ~> Boolean
    toBoolean(...rest: Array<void>): boolean,

    // Maybe#inspect :: Maybe a ~> String
    inspect(...rest: Array<void>): string

  }

  declare type Maybe<A> = Nothing | Just<A>;

  // fromMaybe :: a -> Maybe a -> a
  declare function fromMaybe<A>(a: A, ...rest: Array<void>): Fn1<Maybe<A>, A>;
  declare function fromMaybe<A>(a: A, fa: Maybe<A>, ...rest: Array<void>): A;

  // maybeToNullable :: Maybe a -> Nullable a
  declare function maybeToNullable<A>(fa: Maybe<A>, ...rest: Array<void>): null | A;

  // toMaybe :: a? -> Maybe a
  declare function toMaybe<A>(a: ?A, ...rest: Array<void>): Maybe<A>;

  // maybe :: b -> (a -> b) -> Maybe a -> b
  declare function maybe<A, B>(b: B, ...rest: Array<void>): CurriedFn2<A, Maybe<A>, B>;
  declare function maybe<A, B>(b: B, f: Fn1<A, B>, ...rest: Array<void>): Fn1<Maybe<A>, B>;
  declare function maybe<A, B>(b: B, f: Fn1<A, B>, fa: Maybe<A>, ...rest: Array<void>): B;

  // justs :: Array (Maybe a) -> Array a
  declare function justs<A>(fas: Array<Maybe<A>>): Array<A>;

  // mapMaybe :: (a -> Maybe b) -> Array a -> Array b
  declare function mapMaybe<A, B>(f: Fn1<A, Maybe<B>>, ...rest: Array<void>): Fn1<Array<A>, Array<B>>;
  declare function mapMaybe<A, B>(f: Fn1<A, Maybe<B>>, as: Array<A>, ...rest: Array<void>): Array<B>;

  // encase :: (a -> b) -> a -> Maybe b
  declare function encase<A, B>(f: Fn1<A, B>, ...rest: Array<void>): Fn1<A, Maybe<B>>;
  declare function encase<A, B>(f: Fn1<A, B>, a: A, ...rest: Array<void>): Maybe<B>;

  // encase2 :: (a -> b -> c) -> a -> b -> Maybe c
  declare function encase2<A, B, C>(f: FixedCurried2<A, B, C>, ...rest: Array<void>): CurriedFn2<A, B, Maybe<C>>;
  declare function encase2<A, B, C>(f: FixedCurried2<A, B, C>, a: A, ...rest: Array<void>): Fn1<B, Maybe<C>>;
  declare function encase2<A, B, C>(f: FixedCurried2<A, B, C>, a: A, b: B, ...rest: Array<void>): Maybe<C>;

  // encase2_ :: ((a, b) -> c) -> a -> b -> Maybe c
  declare function encase2_<A, B, C>(f: Fn2<A, B, C>, ...rest: Array<void>): CurriedFn2<A, B, Maybe<C>>;
  declare function encase2_<A, B, C>(f: Fn2<A, B, C>, a: A, ...rest: Array<void>): Fn1<B, Maybe<C>>;
  declare function encase2_<A, B, C>(f: Fn2<A, B, C>, a: A, b: B, ...rest: Array<void>): Maybe<C>;

  // encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d
  declare function encase3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, ...rest: Array<void>): CurriedFn3<A, B, C, Maybe<D>>;
  declare function encase3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, a: A, ...rest: Array<void>): CurriedFn2<B, C, Maybe<D>>;
  declare function encase3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, a: A, b: B, ...rest: Array<void>): Fn1<C, Maybe<D>>;
  declare function encase3<A, B, C, D>(f: FixedCurried3<A, B, C, D>, a: A, b: B, c: C, ...rest: Array<void>): Maybe<D>;

  // encase3_ :: ((a, b, c) -> d) -> a -> b -> c -> Maybe d
  declare function encase3_<A, B, C, D>(f: Fn3<A, B, C, D>, ...rest: Array<void>): CurriedFn3<A, B, C, Maybe<D>>;
  declare function encase3_<A, B, C, D>(f: Fn3<A, B, C, D>, a: A, ...rest: Array<void>): CurriedFn2<B, C, Maybe<D>>;
  declare function encase3_<A, B, C, D>(f: Fn3<A, B, C, D>, a: A, b: B, ...rest: Array<void>): Fn1<C, Maybe<D>>;
  declare function encase3_<A, B, C, D>(f: Fn3<A, B, C, D>, a: A, b: B, c: C, ...rest: Array<void>): Maybe<D>;

  //
  // Either
  //

  declare class Left<A> {

    // Either#isLeft :: Boolean
    isLeft: boolean,

    // Either#isRight :: Boolean
    isRight: boolean,

    // Either#ap :: Either a (b -> c) ~> Either a b -> Either a c
    ap<B, C>(ff: Either<A, Fn1<B, C>>, ...rest: Array<void>): Either<A, C>,

    // Either#chain :: Either a b ~> (b -> Either a c) -> Either a c
    chain<B, C>(f: Fn1<B, Either<A, C>>, ...rest: Array<void>): Either<A, C>,

    // Either#concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b
    concat<B>(x: Either<A, B>, ...rest: Array<void>): Either<A, B>,

    // Either#equals :: Either a b ~> c -> Boolean
    equals(x: any, ...rest: Array<void>): boolean,

    // Either#extend :: Either a b ~> (Either a b -> b) -> Either a b
    extend<B>(f: Fn1<Either<A, B>, B>, ...rest: Array<void>): Either<A, B>,

    // Either#map :: Either a b ~> (b -> c) -> Either a c
    map<B, C>(f: Fn1<B, C>, ...rest: Array<void>): Either<A, C>,

    // Either#of :: Either a b ~> c -> Either a c
    of<C>(c: C, ...rest: Array<void>): Either<A, C>,

    // Either#reduce :: Either a b ~> ((c, b) -> c) -> c -> c
    reduce<B, C>(f: Fn2<C, B, C>, ...rest: Array<void>): Fn1<C, C>,
    reduce<B, C>(f: Fn2<C, B, C>, c: C, ...rest: Array<void>): C,

    // Either#sequence :: Applicative f => Either a (f b) ~> (b -> f b) -> f (Either a b)
    sequence<B>(f: Fn1<B, any>, ...rest: Array<void>): any,

    // Either#toBoolean :: Either a b ~> Boolean
    toBoolean(...rest: Array<void>): boolean,

    // Either#inspect :: Either a b ~> String
    inspect(...rest: Array<void>): string

  }

  declare class Right<B> {

    // Either#isLeft :: Boolean
    isLeft: boolean,

    // Either#isRight :: Boolean
    isRight: boolean,

    // Either#ap :: Either a (b -> c) ~> Either a b -> Either a c
    ap<A, C>(ff: Either<A, Fn1<B, C>>, ...rest: Array<void>): Either<A, C>,

    // Either#chain :: Either a b ~> (b -> Either a c) -> Either a c
    chain<A, C>(f: Fn1<B, Either<A, C>>, ...rest: Array<void>): Either<A, C>,

    // Either#concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b
    concat<A>(x: Either<A, B>): Either<A, B>,

    // Either#equals :: Either a b ~> c -> Boolean
    equals(x: any, ...rest: Array<void>): boolean,

    // Either#extend :: Either a b ~> (Either a b -> b) -> Either a b
    extend<A>(f: Fn1<Either<A, B>, B>, ...rest: Array<void>): Either<A, B>,

    // Either#map :: Either a b ~> (b -> c) -> Either a c
    map<A, C>(f: Fn1<B, C>, ...rest: Array<void>): Either<A, C>,

    // Either#of :: Either a b ~> c -> Either a c
    of<A, C>(c: C, ...rest: Array<void>): Either<A, C>,

    // Either#reduce :: Either a b ~> ((c, b) -> c) -> c -> c
    reduce<C>(f: Fn2<C, B, C>, ...rest: Array<void>): Fn1<C, C>,
    reduce<C>(f: Fn2<C, B, C>, c: C, ...rest: Array<void>): C,

    // Either#sequence :: Applicative f => Either a (f b) ~> (b -> f b) -> f (Either a b)
    sequence(f: Fn1<B, any>, ...rest: Array<void>): any,

    // Either#toBoolean :: Either a b ~> Boolean
    toBoolean(...rest: Array<void>): boolean,

    // Either#inspect :: Either a b ~> String
    inspect(...rest: Array<void>): string

  }

  declare type Either<A, B> = Left<A> | Right<B>;

  // maybeToEither :: a -> Maybe b -> Either a b
  declare function maybeToEither<A, B>(a: A, ...rest: Array<void>): Fn1<Maybe<B>, Either<A, B>>;
  declare function maybeToEither<A, B>(a: A, fb: Maybe<B>, ...rest: Array<void>): Either<A, B>;

  // either :: (a -> c) -> (b -> c) -> Either a b -> c
  declare function either<A, B, C>(f: Fn1<A, C>, ...rest: Array<void>): CurriedFn2<Fn1<B, C>, Either<A, B>, C>;
  declare function either<A, B, C>(f: Fn1<A, C>, g: Fn1<B, C>, ...rest: Array<void>): Fn1<Either<A, B>, C>;
  declare function either<A, B, C>(f: Fn1<A, C>, g: Fn1<B, C>, fa: Either<A, B>, ...rest: Array<void>): C;

  // lefts :: Array (Either a b) -> Array a
  declare function lefts<A, B>(xs: Array<Either<A, B>>): Array<A>;

  // rights :: Array (Either a b) -> Array b
  declare function rights<A, B>(xs: Array<Either<A, B>>): Array<B>;

  // encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r
  declare function encaseEither<A, L, R>(f: Fn1<Error, L>, ...rest: Array<void>): CurriedFn2<Fn1<A, R>, A, Either<L, R>>;
  declare function encaseEither<A, L, R>(f: Fn1<Error, L>, g: Fn1<A, R>, ...rest: Array<void>): Fn1<A, Either<L, R>>;
  declare function encaseEither<A, L, R>(f: Fn1<Error, L>, g: Fn1<A, R>, a: A, ...rest: Array<void>): Either<L, R>;

  // encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r
  declare function encaseEither2<A, B, L, R>(f: Fn1<Error, L>, ...rest: Array<void>): CurriedFn3<FixedCurried2<A, B, R>, A, B, Either<L, R>>;
  declare function encaseEither2<A, B, L, R>(f: Fn1<Error, L>, g: FixedCurried2<A, B, R>, ...rest: Array<void>): CurriedFn2<A, B, Either<L, R>>;
  declare function encaseEither2<A, B, L, R>(f: Fn1<Error, L>, g: FixedCurried2<A, B, R>, a: A, ...rest: Array<void>): Fn1<B, Either<L, R>>;
  declare function encaseEither2<A, B, L, R>(f: Fn1<Error, L>, g: FixedCurried2<A, B, R>, a: A, b: B, ...rest: Array<void>): Either<L, R>;

  // encaseEither2_ :: (Error -> l) -> ((a, b) -> r) -> a -> b -> Either l r
  declare function encaseEither2_<A, B, L, R>(f: Fn1<Error, L>, ...rest: Array<void>): CurriedFn3<Fn2<A, B, R>, A, B, Either<L, R>>;
  declare function encaseEither2_<A, B, L, R>(f: Fn1<Error, L>, g: Fn2<A, B, R>, ...rest: Array<void>): CurriedFn2<A, B, Either<L, R>>;
  declare function encaseEither2_<A, B, L, R>(f: Fn1<Error, L>, g: Fn2<A, B, R>, a: A, ...rest: Array<void>): Fn1<B, Either<L, R>>;
  declare function encaseEither2_<A, B, L, R>(f: Fn1<Error, L>, g: Fn2<A, B, R>, a: A, b: B, ...rest: Array<void>): Either<L, R>;

  // encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r
  declare function encaseEither3<A, B, C, L, R>(f: Fn1<Error, L>, ...rest: Array<void>): CurriedFn4<FixedCurried3<A, B, C, R>, A, B, C, Either<L, R>>;
  declare function encaseEither3<A, B, C, L, R>(f: Fn1<Error, L>, g: FixedCurried3<A, B, C, R>, ...rest: Array<void>): CurriedFn3<A, B, C, Either<L, R>>;
  declare function encaseEither3<A, B, C, L, R>(f: Fn1<Error, L>, g: FixedCurried3<A, B, C, R>, a: A, ...rest: Array<void>): CurriedFn2<B, C, Either<L, R>>;
  declare function encaseEither3<A, B, C, L, R>(f: Fn1<Error, L>, g: FixedCurried3<A, B, C, R>, a: A, b: B, ...rest: Array<void>): Fn1<C, Either<L, R>>;
  declare function encaseEither3<A, B, C, L, R>(f: Fn1<Error, L>, g: FixedCurried3<A, B, C, R>, a: A, b: B, c: C, ...rest: Array<void>): Either<L, R>;

  // encaseEither3_ :: (Error -> l) -> ((a, b, c) -> r) -> a -> b -> c -> Either l r
  declare function encaseEither3_<A, B, C, L, R>(f: Fn1<Error, L>, ...rest: Array<void>): CurriedFn4<Fn3<A, B, C, R>, A, B, C, Either<L, R>>;
  declare function encaseEither3_<A, B, C, L, R>(f: Fn1<Error, L>, g: Fn3<A, B, C, R>, ...rest: Array<void>): CurriedFn3<A, B, C, Either<L, R>>;
  declare function encaseEither3_<A, B, C, L, R>(f: Fn1<Error, L>, g: Fn3<A, B, C, R>, a: A, ...rest: Array<void>): CurriedFn2<B, C, Either<L, R>>;
  declare function encaseEither3_<A, B, C, L, R>(f: Fn1<Error, L>, g: Fn3<A, B, C, R>, a: A, b: B, ...rest: Array<void>): Fn1<C, Either<L, R>>;
  declare function encaseEither3_<A, B, C, L, R>(f: Fn1<Error, L>, g: Fn3<A, B, C, R>, a: A, b: B, c: C, ...rest: Array<void>): Either<L, R>;

  // eitherToMaybe :: Either a b -> Maybe b
  declare function eitherToMaybe<A, B>(fa: Either<A, B>): Maybe<B>;

  //
  // Alternative
  //

  // and :: Alternative a => a -> a -> a
  declare function and<A: Alternative>(a: A, ...rest: Array<void>): Fn1<A, A>;
  declare function and<A: Alternative>(a: A, a: A, ...rest: Array<void>): A;

  // or :: Alternative a => a -> a -> a
  declare function or<A: Alternative>(a: A, ...rest: Array<void>): Fn1<A, A>;
  declare function or<A: Alternative>(a: A, a: A, ...rest: Array<void>): A;

  // xor :: (Alternative a, Monoid a) => a -> a -> a
  declare function xor<A: Alternative>(a: A, ...rest: Array<void>): Fn1<A, A>;
  declare function xor<A: Alternative>(a: A, a: A, ...rest: Array<void>): A;

  //
  // Logic
  //

  // not :: Boolean -> Boolean
  declare function not(b: boolean): boolean;

  // ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b
  declare function ifElse<A, B>(f: Fn1<A, boolean>, ...rest: Array<void>): CurriedFn3<Fn1<A, B>, Fn1<A, B>, A, B>;
  declare function ifElse<A, B>(f: Fn1<A, boolean>, g: Fn1<A, B>, ...rest: Array<void>): CurriedFn2<Fn1<A, B>, A, B>;
  declare function ifElse<A, B>(f: Fn1<A, boolean>, g: Fn1<A, B>, h: Fn1<A, B>, ...rest: Array<void>): Fn1<A, B>;
  declare function ifElse<A, B>(f: Fn1<A, boolean>, g: Fn1<A, B>, h: Fn1<A, B>, a: A, ...rest: Array<void>): B;

  // allPass :: Array (a -> Boolean) -> a -> Boolean
  declare function allPass<A>(f: Fn1<A, boolean>, ...rest: Array<void>): Fn1<A, boolean>;
  declare function allPass<A>(f: Fn1<A, boolean>, a: A, ...rest: Array<void>): boolean;

  // anyPass :: Array (a -> Boolean) -> a -> Boolean
  declare function anyPass<A>(f: Fn1<A, boolean>, ...rest: Array<void>): Fn1<A, boolean>;
  declare function anyPass<A>(f: Fn1<A, boolean>, a: A, ...rest: Array<void>): boolean;

  //
  // List
  //

  // concat :: Semigroup a => a -> a -> a
  declare function concat<A: Semigroup<*> | string>(a: A, ...rest: Array<void>): Fn1<A, A>;
  declare function concat<A: Semigroup<*> | string>(a: A, a: A, ...rest: Array<void>): A;

  // slice :: Integer -> Integer -> [a] -> Maybe [a]
  declare function slice<A>(start: number, ...rest: Array<void>): CurriedFn2<number, Array<A> | string, Maybe<Array<A>>>;
  declare function slice<A>(start: number, end: number, ...rest: Array<void>): Fn1<Array<A> | string, Maybe<Array<A>>>;
  declare function slice<A>(start: number, end: number, xs: Array<A> | string, ...rest: Array<void>): Maybe<Array<A>>;

  // at :: Integer -> [a] -> Maybe a
  declare function at<A>(i: number, ...rest: Array<void>): Fn1<Array<A>, Maybe<A>>;
  declare function at<A>(i: number, xs: Array<A>, ...rest: Array<void>): Maybe<A>;

  // head :: [a] -> Maybe a
  declare function head<A>(xs: Array<A>, ...rest: Array<void>): Maybe<A>;

  // last :: [a] -> Maybe a
  declare function last<A>(xs: Array<A>, ...rest: Array<void>): Maybe<A>;

  // tail :: [a] -> Maybe [a]
  declare function tail<A>(xs: Array<A>, ...rest: Array<void>): Maybe<Array<A>>;

  // init :: [a] -> Maybe [a]
  declare function init<A>(xs: Array<A>, ...rest: Array<void>): Maybe<Array<A>>;

  // take :: Integer -> [a] -> Maybe [a]
  declare function take<A>(n: number, ...rest: Array<void>): Fn1<Array<A>, Maybe<Array<A>>>;
  declare function take<A>(n: number, xs: Array<A>, ...rest: Array<void>): Maybe<Array<A>>;

  // takeLast :: Integer -> [a] -> Maybe [a]
  declare function takeLast<A>(n: number, ...rest: Array<void>): Fn1<Array<A>, Maybe<Array<A>>>;
  declare function takeLast<A>(n: number, xs: Array<A>, ...rest: Array<void>): Maybe<Array<A>>;

  // drop :: Integer -> [a] -> Maybe [a]
  declare function drop<A>(n: number, ...rest: Array<void>): Fn1<Array<A>, Maybe<Array<A>>>;
  declare function drop<A>(n: number, xs: Array<A>, ...rest: Array<void>): Maybe<Array<A>>;

  // dropLast :: Integer -> [a] -> Maybe [a]
  declare function dropLast<A>(n: number, ...rest: Array<void>): Fn1<Array<A>, Maybe<Array<A>>>;
  declare function dropLast<A>(n: number, xs: Array<A>, ...rest: Array<void>): Maybe<Array<A>>;

  // reverse :: [a] -> [a]
  declare function reverse<A>(xs: Array<A>, ...rest: Array<void>): Array<A>;

  // indexOf :: a -> [a] -> Maybe Integer
  declare function indexOf<A>(a: A, ...rest: Array<void>): Fn1<Array<A>, Maybe<A>>;
  declare function indexOf<A>(a: A, xs: Array<A>, ...rest: Array<void>): Maybe<A>;

  // lastIndexOf :: a -> [a] -> Maybe Integer
  declare function lastIndexOf<A>(a: A, ...rest: Array<void>): Fn1<Array<A>, Maybe<A>>;
  declare function lastIndexOf<A>(a: A, xs: Array<A>, ...rest: Array<void>): Maybe<A>;

  //
  // Array
  //

  // append :: a -> Array a -> Array a
  declare function append<A>(a: A, ...rest: Array<void>): Fn1<Array<A>, Array<A>>;
  declare function append<A>(a: A, xs: Array<A>, ...rest: Array<void>): Array<A>;

  // prepend :: a -> Array a -> Array a
  declare function prepend<A>(a: A, ...rest: Array<void>): Fn1<Array<A>, Array<A>>;
  declare function prepend<A>(a: A, xs: Array<A>, ...rest: Array<void>): Array<A>;

  // find :: (a -> Boolean) -> Array a -> Maybe a
  declare function find<A>(f: Fn1<A, boolean>, ...rest: Array<void>): Fn1<Array<A>, Maybe<A>>;
  declare function find<A>(f: Fn1<A, boolean>, xs: Array<A>, ...rest: Array<void>): Maybe<A>;

  // pluck :: Accessible a => TypeRep b -> String -> Array a -> Array (Maybe b)
  declare function pluck<A: Accessible, B>(typeRep: TypeRep<B>, ...rest: Array<void>): CurriedFn2<string, Array<A>, Array<Maybe<B>>>;
  declare function pluck<A: Accessible, B>(typeRep: TypeRep<B>, s: string, ...rest: Array<void>): Fn2<Array<A>, Array<Maybe<B>>>;
  declare function pluck<A: Accessible, B>(typeRep: TypeRep<B>, s: string, xs: Array<A>, ...rest: Array<void>): Array<Maybe<B>>;

  // reduce :: Foldable f => (a -> b -> a) -> a -> f b -> a
  declare function reduce<A, B>(f: FixedCurried2<A, B, A>, ...rest: Array<void>): CurriedFn2<A, Foldable<B>, A>;
  declare function reduce<A, B>(f: FixedCurried2<A, B, A>, a: A, ...rest: Array<void>): Fn1<Foldable<B>, A>;
  declare function reduce<A, B>(f: FixedCurried2<A, B, A>, a: A, fa: Foldable<B>, ...rest: Array<void>): A;

  // reduce_ :: Foldable f => ((a, b) -> a) -> a -> f b -> a
  declare function reduce_<A, B>(f: Fn2<A, B, A>, ...rest: Array<void>): CurriedFn2<A, Foldable<B>, A>;
  declare function reduce_<A, B>(f: Fn2<A, B, A>, a: A, ...rest: Array<void>): Fn1<Foldable<B>, A>;
  declare function reduce_<A, B>(f: Fn2<A, B, A>, a: A, fa: Foldable<B>, ...rest: Array<void>): A;

  // unfoldr :: (b -> Maybe (Pair a b)) -> b -> Array a
  declare function unfoldr<A, B>(f: Fn1<B, Maybe<[A, B]>>, ...rest: Array<void>): Fn1<B, Array<A>>;
  declare function unfoldr<A, B>(f: Fn1<B, Maybe<[A, B]>>, b: B, ...rest: Array<void>): Array<A>;

  // range :: Integer -> Integer -> Array Integer
  declare function range(start: number, ...rest: Array<void>): Fn1<number, Array<number>>;
  declare function range(start: number, end: number, ...rest: Array<void>): Array<number>;

  //
  // Object
  //

  // prop :: Accessible a => String -> a -> b
  declare function prop<A: Accessible, B>(key: $Keys<A>, ...rest: Array<void>): Fn1<A, B>;
  declare function prop<A: Accessible, B>(key: $Keys<A>, a: A, ...rest: Array<void>): B;

  // get :: Accessible a => TypeRep b -> String -> a -> Maybe b
  declare function get<A: Accessible, B>(typeRep: TypeRep<B>, ...rest: Array<void>): CurriedFn2<string, A, Maybe<B>>;
  declare function get<A: Accessible, B>(typeRep: TypeRep<B>, key: string, ...rest: Array<void>): Fn2<A, Maybe<B>>;
  declare function get<A: Accessible, B>(typeRep: TypeRep<B>, key: string, a: A, ...rest: Array<void>): Maybe<B>;

  // gets :: Accessible a => TypeRep b -> Array String -> a -> Maybe b
  declare function gets<A: Accessible, B>(typeRep: TypeRep<B>, ...rest: Array<void>): CurriedFn2<Array<string>, A, Maybe<B>>;
  declare function gets<A: Accessible, B>(typeRep: TypeRep<B>, keys: Array<string>, ...rest: Array<void>): Fn2<A, Maybe<B>>;
  declare function gets<A: Accessible, B>(typeRep: TypeRep<B>, keys: Array<string>, a: A, ...rest: Array<void>): Maybe<B>;

  // keys :: StrMap a -> Array String
  declare function keys<A: { [key: string]: any }>(a: A, ...rest: Array<void>): $Keys<A>;

  // values :: StrMap a -> Array a
  declare function values<A, B: { [key: string]: A }>(b: B, ...rest: Array<void>): Array<A>;

  // pairs :: StrMap a -> Array (Pair String a)
  declare function pairs<A, B: { [key: string]: A }>(b: B, ...rest: Array<void>): Array<[string, A]>;

  //
  // Number
  //

  // negate :: ValidNumber -> ValidNumber
  declare function negate(n: number, ...rest: Array<void>): number;

  // add :: FiniteNumber -> FiniteNumber -> FiniteNumber
  declare function add(a: number, ...rest: Array<void>): Fn1<number, number>;
  declare function add(a: number, b: number, ...rest: Array<void>): number;

  // sum :: Foldable f => f FiniteNumber -> FiniteNumber
  declare function sum<A: Foldable<number>>(x: A): number;

  // sub :: FiniteNumber -> FiniteNumber -> FiniteNumber
  declare function sub(a: number, ...rest: Array<void>): Fn1<number, number>;
  declare function sub(a: number, b: number, ...rest: Array<void>): number;

  // inc :: FiniteNumber -> FiniteNumber
  declare function inc(n: number, ...rest: Array<void>): number;

  // dec :: FiniteNumber -> FiniteNumber
  declare function dec(n: number, ...rest: Array<void>): number;

  // mult :: FiniteNumber -> FiniteNumber -> FiniteNumber
  declare function mult(a: number, ...rest: Array<void>): Fn1<number, number>;
  declare function mult(a: number, b: number, ...rest: Array<void>): number;

  // product :: Foldable f => f FiniteNumber -> FiniteNumber
  declare function product<A: Foldable<number>>(x: A): number;

  // div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber
  declare function div(a: number, ...rest: Array<void>): Fn1<number, number>;
  declare function div(a: number, b: number, ...rest: Array<void>): number;

  // min :: Ord a => a -> a -> a
  declare function min<A: Ord>(a: A, ...rest: Array<void>): Fn1<A, A>;
  declare function min<A: Ord>(a: A, b: A, ...rest: Array<void>): A;

  // max :: Ord a => a -> a -> a
  declare function max<A: Ord>(a: A, ...rest: Array<void>): Fn1<A, A>;
  declare function max<A: Ord>(a: A, b: A, ...rest: Array<void>): A;

  //
  // Integer
  //

  // even :: Integer -> Boolean
  declare function even(n: number, ...rest: Array<void>): boolean;

  // odd :: Integer -> Boolean
  declare function odd(n: number, ...rest: Array<void>): boolean;

  //
  // Parse
  //

  // parseDate :: String -> Maybe Date
  declare function parseDate(s: string, ...rest: Array<void>): Maybe<Date>;

  // parseFloat :: String -> Maybe Number
  declare function parseFloat(s: string, ...rest: Array<void>): Maybe<number>;

  // parseInt :: Integer -> String -> Maybe Integer
  declare function parseInt(radix: number, ...rest: Array<void>): Fn1<string, Maybe<number>>;
  declare function parseInt(radix: number, s: string, ...rest: Array<void>): Maybe<number>;

  // parseJson :: TypeRep a -> String -> Maybe a
  declare function parseJson<A>(typeRep: TypeRep<A>, ...rest: Array<void>): Fn1<string, Maybe<A>>;
  declare function parseJson<A>(typeRep: TypeRep<A>, s: string, ...rest: Array<void>): Maybe<A>;

  //
  // RegExp
  //

  // regex :: RegexFlags -> String -> RegExp
  declare function regex(flags: string, ...rest: Array<void>): Fn1<string, RegExp>;
  declare function regex(flags: string, s: string, ...rest: Array<void>): RegExp;

  // regexEscape :: String -> String
  declare function regexEscape(s: string, ...rest: Array<void>): string;

  // test :: RegExp -> String -> Boolean
  declare function test(re: RegExp, ...rest: Array<void>): Fn1<string, boolean>;
  declare function test(re: RegExp, s: string, ...rest: Array<void>): boolean;

  // match :: RegExp -> String -> Maybe (Array (Maybe String))
  declare function match(re: RegExp, ...rest: Array<void>): Fn1<string, Maybe<Array<Maybe<string>>>>;
  declare function match(re: RegExp, s: string, ...rest: Array<void>): Maybe<Array<Maybe<string>>>;

  //
  // String
  //

  // toUpper :: String -> String
  declare function toUpper(s: string, ...rest: Array<void>): string;

  // toLower :: String -> String
  declare function toLower(s: string, ...rest: Array<void>): string;

  // trim :: String -> String
  declare function trim(s: string, ...rest: Array<void>): string;

  // words :: String -> Array String
  declare function words(s: string, ...rest: Array<void>): Array<string>;

  // unwords :: Array String -> String
  declare function unwords(words: Array<string>, ...rest: Array<void>): string;

  // lines :: String -> Array String
  declare function lines(s: string, ...rest: Array<void>): Array<string>;

  // unlines :: Array String -> String
  declare function unlines(words: Array<string>, ...rest: Array<void>): string;

  declare type Module = {
    type: typeof type,
    is: typeof is,
    I: typeof I,
    K: typeof K,
    A: typeof A,
    T: typeof T,
    C: typeof C,
    B: typeof B,
    S: typeof S,
    flip: typeof flip,
    lift: typeof lift,
    lift2: typeof lift2,
    lift3: typeof lift3,
    compose: typeof compose,
    pipe: typeof pipe,
    Maybe: {
      // Maybe#@@type :: String
      '@@type': 'sanctuary/Maybe',
      // Maybe.empty :: -> Maybe a
      empty<A>(...rest: Array<void>): Maybe<A>,
      // Maybe.of :: a -> Maybe a
      of<A>(a: A, ...rest: Array<void>): Maybe<A>
    },
    Just<A>(a: A, ...rest: Array<void>): Maybe<A>,
    Nothing: Maybe<any>,
    isNothing<A>(fa: Maybe<A>, ...rest: Array<void>): boolean,
    isJust<A>(fa: Maybe<A>, ...rest: Array<void>): boolean,
    fromMaybe: typeof fromMaybe,
    maybeToNullable: typeof maybeToNullable,
    toMaybe: typeof toMaybe,
    maybe: typeof maybe,
    justs: typeof justs,
    mapMaybe: typeof mapMaybe,
    encase: typeof encase,
    encase2: typeof encase2,
    encase2_: typeof encase2_,
    encase3: typeof encase3,
    encase3_: typeof encase3_,
    maybeToEither: typeof maybeToEither,
    Either: {
      // Either#@@type :: String
      '@@type': 'sanctuary/Either',
      // Either.of :: b -> Either a b
      of<A, B>(b: B, ...rest: Array<void>): Either<A, B>
    },
    Left<A, B>(a: A, ...rest: Array<void>): Either<A, B>,
    Right<A, B>(b: B, ...rest: Array<void>): Either<A, B>,
    isLeft<A, B>(fa: Either<A, B>, ...rest: Array<void>): boolean,
    isRight<A, B>(fa: Either<A, B>, ...rest: Array<void>): boolean,
    either: typeof either,
    lefts: typeof lefts,
    rights: typeof rights,
    encaseEither: typeof encaseEither,
    encaseEither2: typeof encaseEither2,
    encaseEither2_: typeof encaseEither2_,
    encaseEither3: typeof encaseEither3,
    encaseEither3_: typeof encaseEither3_,
    eitherToMaybe: typeof eitherToMaybe,
    and: typeof and,
    or: typeof or,
    xor: typeof xor,
    ifElse: typeof ifElse,
    allPass: typeof allPass,
    anyPass: typeof anyPass,
    concat: typeof concat,
    slice: typeof slice,
    at: typeof at,
    head: typeof head,
    last: typeof last,
    tail: typeof tail,
    init: typeof init,
    take: typeof take,
    takeLast: typeof takeLast,
    drop: typeof drop,
    dropLast: typeof dropLast,
    reverse: typeof reverse,
    indexOf: typeof indexOf,
    lastIndexOf: typeof lastIndexOf,
    append: typeof append,
    prepend: typeof prepend,
    find: typeof find,
    pluck: typeof pluck,
    reduce: typeof reduce,
    reduce_: typeof reduce_,
    unfoldr: typeof unfoldr,
    range: typeof range,
    prop: typeof prop,
    get: typeof get,
    gets: typeof gets,
    keys: typeof keys,
    values: typeof values,
    pairs: typeof pairs,
    negate: typeof negate,
    add: typeof add,
    sum: typeof sum,
    sub: typeof sub,
    inc: typeof inc,
    dec: typeof dec,
    mult: typeof mult,
    product: typeof product,
    div: typeof div,
    min: typeof min,
    max: typeof max,
    even: typeof even,
    odd: typeof odd,
    parseDate: typeof parseDate,
    parseFloat: typeof parseFloat,
    parseInt: typeof parseInt,
    parseJson: typeof parseJson,
    regex: typeof regex,
    regexEscape: typeof regexEscape,
    test: typeof test,
    match: typeof match,
    toUpper: typeof toUpper,
    toLower: typeof toLower,
    trim: typeof trim,
    words: typeof words,
    unwords: typeof unwords,
    lines: typeof lines,
    unlines: typeof unlines
  };

  declare var exports: {
    // create :: { checkTypes :: Boolean, env :: Array Type } -> Module
    create(options: { checkTypes: boolean, env: Array<Type> }): Module,
    // env :: Array Type
    env: Array<Type>
  }

}
