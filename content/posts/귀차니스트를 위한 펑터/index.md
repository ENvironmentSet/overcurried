---
title: 귀차니스트를 위한 펑터  
date: 2019-08-10  
description: 귀차니즘을 멋지게 해소해주는 개념, 펑터에 대해서 알아보도록 합시다.
somethings: 2  
keywords: Functor, 펑터, 함수형 프로그래밍, 타입스크립트, 자바스크립트
---

펑터(함자, *Functor*)는 함수형 프로그래밍의 개념 중 하나입니다.
프로그래머들의 귀차니즘을 해소해주기 위해 도입된 개념이지요.
펑터를 사용하면 코드의 재사용성이 비약적으로 상승합니다.
그럼에도 불구하고 범주론(*Category theory*, 수학의 이론 중 하나) 출신이라는 이유로 입문자들이 지레 겁을 먹고 배우기를 포기하는 개념이기도 한데요,
이 포스트에서는 수학적 배경에 대한 이야기는 전부 빼놓고 직관적인 예시를 통해 펑터에 대해 알아보도록 하겠습니다.

## 리프팅

리프팅(*Lifting*) 또한 함수형 프로그래밍의 개념 중 하나입니다.
펑터를 배움에 있어 빠질 수 없는 정말 중요한 개념이기도 합니다.
리프팅은 특정 타입을 다루는 함수를 특정 타입과 관련된 다른 타입을 다루는 함수로 변화시키는 기술인데요, 백문이 불여일견이라는 말이 있지요?
아리송한 설명은 여기까지 하고, 지금부터 예시를 통해 알려드리도록 하겠습니다.

### 함수 꾸미기

여기, 어떤 수에 10을 더하는 함수 `add10`이 있습니다.
```typescript
function add10(x: number): number {
  return x + 10;
}
```

이 함수는 `number` 타입의 값과 죽이 잘 맞습니다. 그니까... 잘 돌아간다구요.
```typescript
add10(1); // 11
add10(10); // 20
add10(100); // 110
```
만족스럽습니다. 이제 `add10` 을 가지고 `number` 타입의 값들을 멋지게 다루면 되겠네요.

엇, 근데 배열 안에 들어간 `number` 타입의 값을 다루려면 어떻게 해야 할까요?
다른 값 안에 들어 있어도 `number` 타입의 값은 `number` 타입의 값이니 `add10` 을 통해 다루고 싶은데 말이죠.
하지만 `add10`은 배열을 받을 수 없습니다. 
그러니 한번 `add10`의 배열 버전을 만들어 보겠습니다.
```typescript
function add10ForArray(xArr: number[]): number[] {
  const resultArr: number[] = [];
  
  for (const x of xArr) {
    resultArr.push(add10(x));
  }
  
  return resultArr;
}
```
짠, 이렇게 우리의 `add10`은 `number` 타입의 값 뿐만 아니라 한 발 더 나아가 `[number]` 타입의 값과도 상호작용 할 수 있게 됬습니다.

이번에는 문자열 끝에 `'a'`를 더하는 `addA` 함수의 경우를 살펴보도록 하겠습니다.
```typescript
function addA(x: string): string {
  return x + 'a';
}
```
이 함수 또한 `add10` 함수처럼 배열 안에 들어간 `string` 타입의 값 또한 다룰 수 있으면 무척 좋을 거 같습니다. 한번 만들어 보지요.
```typescript
function addAForArray(xArr: string[]): string[] {
  const resultArr: string[] = [];
  
  for (const x of xArr) {
    resultArr.push(addA(x));
  }
  
  return resultArr;
}
```
이야, 이제 배열 속에 들어있는 `string` 타입의 값들을 다룰 수 있습니다.

`add10ForArrray` 와 `addAForArray`의 공통점을 찾으실 수 있으신가요?
두 함수 모두 특정 데이터 타입을 다루는 함수를 특정 데이터 타입을 감싸는 배열에도 적용할 수 있게 하기 위해 함수를 꾸미고 있지요.

근데, 함수를 꾸미는 코드가 서로 일치하네요? 그럼 한번 추상화를 해 보지요.
```typescript
function transFunctionForArray<P, R>(f: (x: P) => R): (x: P[]) => R[] {
  return (xArr: P[]): R[] => {
    const resultArr: R[] = [];
    
    for (const x of xArr) {
      resultArr.push(f(x));
    }
    
    return resultArr;
  }
}

const add10ForArray = transFunctionForArray<number, number>(add10);
const addAForArray = transFunctionForArray<string, number>(addA);
```
우와, 코드가 엄청 간결해졌습니다. 
이제 `transFunctionForArray` 함수를 통해 새로운 함수를 만들었을 때, 그 함수의 배열 버전 또한 쉽게 만들 수 있습니다!

슬슬 감이 오지 않으시나요?
`transFunctionForArray` 함수가 하는 일이 바로 리프팅입니다.

### 리프팅의 가치

리프팅은 우리의 귀찮음을 해결해줌과 동시에 코드의 재사용성을 비약적으로 높여 주는 기술입니다.
앞서 보여드린 예시처럼, 어떤 타입 `A`의 값을 다루는 함수가 있을 때, 이 함수를 `A`와 관련된 다른 타입 `F<A>`의 값에도 적용하고 싶다면 그 타입을 지원하기 위한 코드가 들어간 새 함수를 만드는 게 일반적인데요.
이런 상황에서 '**어떻게 함수를 꾸며야 하는 지**'를 한번만 리프팅 함수를 통해 서술하면 앞으로 어떤 타입의 값을 다루는 함수를 가져와도 리프팅 함수를 통해 쉽게 함수를 변환시킬수 있게 됩니다.

다시말해, **리프팅은 `A`타입의 값을 다루는 함수를 가지고 `F<A>` 타입의 값을 다루는 함수를 정말 간단하게 유도할 수 있게 해 줍니다**.

## 펑터

펑터는...

- 다른 타입을 하나 받아서 구성되는 타입입니다.
- 자신을 구성하는 타입의 값을 다루는 함수를 리프팅하거나 자신에게 적용하는 방법을 제공해야 합니다.

쉽게 말해...
- `F<T>` 꼴의 선언을 갖습니다.
- `(f: (x: A) => B) => (tx: F<A>) => F<B>` 꼴 또는 `(f: (x: A) => B, tx: F<A>) => F<B>` 꼴의 함수를 지원해야 합니다.

어렵게 느껴지시나요? 예시를 하나 보여드리겠습니다.
우리의 친구, 배열은 펑터입니다!

왜냐하면 배열은...
- 다른 타입을 하나 받아서 구성됩니다! `Array<T>`나 `T[]` 처럼요!
- 자신을 구성하는 타입의 값을 다루는 함수를 리프팅하거나 자신에게 적용하는 방법을 제공합니다! `Array.prototype.map`의 타입 시그너쳐(*Type Signature*)는 `<U>(f: (x: T) => U): U[]` 입니다.(`this`가 `F<T>`이기 때문에 생략되었습니다.)

정리해드리자면, 펑터는 리프팅이 가능한 `F<A>` 꼴의 선언을 갖는 타입입니다!

### 나작펑(나만의 작은 펑터)

이제 펑터가 무엇인지 배웠으니, 직접 만들어 보도록 하겠습니다.
[Fantasy Land](https://github.com/fantasyland/fantasy-land) 명세를 따르도록 하겠습니다.
Fantasy Land는 JavaScript/TypeScript 모듈 간의 대수 구조들에 대한 상호 운용성을 성립시키기 위한 명세로, 쉽게 말해 리프트 함수 같이 함수형 프로그래밍에서 특수한 목적으로 쓰이는 함수들의 이름을 미리 정하여 함수형 프로그래밍 모듈 간의 호환성을 형성하기 위한 명세입니다.
```typescript
import { map } from 'fantasy-land';

abstract class Maybe<A> {
  [map]<B>(f: (x: A) => B): Maybe<B> {
    if (this instanceof Just) {
      const { value } = this;
      
      return new Just(f(value));
    } else return new Nothing;
  }
}

class Just<A> extends Maybe<A> {
  constructor(public value: A) {
    super();
  }
}

class Nothing<A> extends Maybe<A> {}
```
제가 만든 펑터는 함수형 프로그래밍에서 자주 쓰이는 `Maybe` 타입입니다.
간단하게 `Maybe` 타입을 소개시켜드리자면, 계산 실패를 의미하는 `null`이나 `undefined`를 `Nothing`이라는 특별한 값으로 대체시킨 타입 입니다.
약간 어렵나요? 여기 실용적인 예시가 있습니다.
```typescript
import { map } from 'fantasy-land';

function parseBool(x: string): Maybe<boolean> {
  const isTrue = /^true$/;
  const isFalse = /^false$/;
  const caseIgnoredX = x.toLowerCase();
  
  if (isTrue.test(caseIgnoredX)) return new Just(true);
  else if (isFalse.test(caseIgnoredX)) return new Just(false);
  else return new Nothing;
}

function not(x: boolean): boolean {
  return !x;
}

parseBool('true')[map](not); // Just(false)
parseBool('false')[map](not); // Just(true)
parseBool('Jaewon seo')[map](not); // Nothing
```
짠, `Maybe`를 사용하면 이렇게 실패할 수 있는 연산을 쉽게 다룰 수 있습니다.
힘들게 실패한 케이스를 반복적으로 헨들링 할 필요가 없지요.

## 정리

오늘은 펑터에 대해서 간단하게 알아보았습니다.
중요한 개념들을 다시 살펴보는 것으로 글을 이만 마무리하도록 하겠습니다.
긴 글 읽어주셔서 감사합니다. 😀

- 리프팅(*Lifting*): 특정 타입을 다루는 함수를 특정 타입과 관련된 다른 타입을 다루는 함수로 변화시키는 기술
- 펑터(*Functor*): 리프팅이 가능한 `F<A>` 꼴의 선언을 갖는 타입

## 읽을거리

- [Static Land](https://github.com/fantasyland/static-land)  
Fantasy Land와 같이 JavaScript 생태계에서 모듈 간의 대수 구조들에 대한 상호 운용성을 성립시키기 위해 만들어진 명세들입니다.
- [Functors, Applicatives, And Monads In Pictures](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)  
모나드(*Monad*), 펑터와 같은 함수형 프로그래밍의 개념들을 쉽게 그림으로 설명하는 글 입니다.
- [Monads are just monoids in the category of endofunctors](https://blog.merovius.de/2018/01/08/monads-are-just-monoids.html#footnote2_back)  
모나드, 펑터와 같은 함수형 프로그래밍에 존재하는 범주론으로부터 빌려 온 개념들을 적절한 수준의 수학적 접근을 통해 설명하는 글 입니다.

## 양해의 말

입문자분들께 펑터와 같은 함수형 프로그래밍의 개념을 소개시켜드리기 위해 작성한 글이다 보니 어렵게 작성할 수 없어 내용을 쉽게 만드는 과정에서 아쉽게도 많은 내용들이 빠지거나 변형되었습니다.
부디 이 점 양해해주셨으면 합니다. 🙇🙇