---
title: 타입 레벨 고차 함수  
date: 2022-04-09  
description: 타입스크립트에서 타입 레벨 고차 함수를 구현하는 방법을 알아봅시다.  
somethings: 1  
keywords: 타입스크립트, typescript, type-level programming, 타입 레벨 프로그래밍, 타입 레벨 함수, type level function
---

타입스크립트의 최근 몇 년간 행보는 '타입 레벨 프로그래밍(Type-level programming)' 한 단어로 요약할 수 있습니다.
조건부 타입과 템플릿 리터럴 타입, 재귀적인 타입 동의어(type alias/type synonym)를 비롯한
다양한 타입 레벨 기능들이 타입스크립트에 도입되어 타입 레벨에서 더 복잡한 계산이 가능해졌습니다.
[타입 안전한 `querySelector`](https://www.typescriptlang.org/play?#code/C4TwDgpgBAymA2BLYAeGUIA9gQHYBMBnKQ4AJ0VwHMAaKAEQ2zyJPMqoD4oBeWJnAWIADACQBvSgDMIZKABUAvhPrLJuGXICqi4VAD8UANry6AOgtwkqLXXqcAulABcxmA4DcAKFCQFAQwBrCAAZf1IUADVuPkiBFmIjJ0NcCAA3WRcoOKxBViNSCmpk7KMABidXHOYhY0KOcwtpTIAlEvkg0PDUFu5XVIyyb19oeQoAWxCIKVRqvOJ66hjs+Nq9CWa5Ft0DBQmpmZRerMjh8FGJlsQqAAtZ1dZFrl4V3ISoMXVNKG2P3bHEOMrrcen1smc-ADxlEHgt2EsXlCDqgocC7lFOJwIdAYOwwABZAD2+EQUkQshhb1qTzo+NhbCKz1i9M+mygITU+LUbIAgjtDCETtjYHiiSSybJCJSao94UyRRQCcTSeSyGhRcqJWrcYqxSqKTrEErxaqonQAORmc2cC0AYmtFqMDqg5uc1uFHWCYVIPJmsnkhOCuGl8wZDQU9Key0Nxv1ZClnq6ESsyBQUIxdHkmKxPnOUAA4hBgN7gABReAQcZ4YAAOX8VZD7yjiM6Jd9ODIAaDadb3Xb-sDeDNLpdNtH7tzfkLZf8AGMbuXK9W6w3InRBVTZYyki8kssvFBD68ZYknAejxeBVBzxfD1V6QU5Wfb0fDEYLGYQnRpyXF1XcLW9YQFE5QOI414vnex6ho+jKNGYbJtBBkGGNOpZzguFb-oBDYtHQ74WF+BZFr+WHLkBIEVI43A3rerhJMKaFkQBK4QFKcxNnKyxoRhf7kQ2KazBaNDWjmIxQHxAEAEIgKxjbUlxLy0RxtTBCAhJSFAAAS8j4iEknAB0VCsfi-hgMhL6GDpekGUZJlmUYkTPpB96bsQakabAkT5rZ-jGUBpnmbRl5eT5zGGX59lgI5zkvq4BnCqZwDzuhKXhcOG4nhJ4VQAAPlAuAAK7wPALxFSV+4Xip+SxbeV7BUerlZbBHC1SFgr5QZMlyZEoE0ZBJwPjSUAfohbWvlASUpbx6V4eyeXZUu0myRRvVUf1Lnst4k7QAAioVsggC0bHFSikaKXwU0LjNS2oExt2sQmmLbQA9AAVG9B5vRJmD1ggEBfS9Xj4BAs7wP4ZDQFIhW4LOwCIISuBQAAjgdZAgDAEAVnDhJqvI52MpwAAUqOHa48gAJSuPth3HYQp1pjmXizojpBQP4Lyk+jmPY8AuNE+aJJpGYABG-i4KkcjcP4Zizv4JUALR8wrc7w4j5oU1AL0vQr3DWSEPKwzcuMGczrPAFAIuc2jGNY6DfNkALlBgIVwB0ELGtazreu6SEACSuAu2WOX5fr9CIGkpss7gbOztbh08-b-PmrOiBkGDEBGLOmA8AARAAjAArGUucOJ72u66FADCacZ1H5tQPg8fc3bOOO+aIuu3zuC2p3IAK7ghIAO7l972m+1JXeI-XMcW9AfBc7bvPJ4Q9sI0jYDOGS8bAArGlK+cGseF7lf6wAChDflkGZmG3V4QA)를 처음 보았을 때 얼마나 놀라웠던지요. [타입 레벨 게임](https://github.com/ricklove/rick-love-master/tree/master/code/typescript-type-system-adventure)은 얼마나 신기했었구요.

![타입 안전한 `querySelector`](./typesafe-querySelector.png)

누군가는 타입 레벨 프로그래밍의 시대가 열렸다고 할지도 모르겠습니다만, 제가 보기에는 아직 한 가지가 부족합니다.
**타입스크립트에는 타입 레벨 고차 함수가 없습니다.**
본격적인 타입 레벨 프로그래밍의 시대가 열리려면 타입 레벨 고차 함수가 필요합니다.

타입 레벨 고차 함수는 통상적인 고차 함수와 크게 다르지 않습니다.
단지 전달받고 전달하는 대상이 통상적인 함수가 아니라 타입 레벨 함수인 타입 레벨 함수일 뿐입니다.

타입 레벨 함수가 생소하실 분들을 위해 설명을 덧붙이겠습니다.
한 집합의 모든 요소를 다른 집합의 어떤 요소 하나하나에 대응시키는 관계를 두고 우리는 함수라 부릅니다.
여기서 주목해야 하는 부분은 바로 '집합의 요소'라는 단어 선택입니다.
**함수가 다루는 대상은 우리가 흔히 값이라 부르는 수나 문자열, 배열 따위의 것들일 필요가 없습니다.**
집합에 요소로써 포함될 수 있는 대상이면 충분합니다.
예컨대, 문자열에 대한 함수를 정의할 수 있는 이유는 다른 그 어떤 것도 아니라 문자열 값이 `string`이라는 집합의 요소이기 때문입니다.
타입도 마찬가지입니다.
타입의 집합을 구성할 수 있기 때문에 타입에 대한 함수도 정의할 수 있으며, 이때 타입 간의 관계를 타입 동의어를 통해 정의하기에 타입 동의어는 자연스럽게 타입 레벨 함수가 됩니다.

```typescript
// string 집합에서 string 집합으로의 함수
function toUpper(char: string): string {
  return char.toUpperCase();
}

// boolean 집합에서 boolean 집합으로의 함수
function not(x: boolean): boolean {
  return x === true ? false : true;
}

// 모든 타입의 집합에서 모든 타입의 집합으로의 함수
type Identity <x> = x;

// boolean 타입의 서브타입의 집합에서 boolean 타입의 서브타입의 집합으로의 함수
type Not<x extends boolean> = x extends true ? false : true;
```

다시 타입 레벨 고차 함수 이야기로 돌아갑시다.
왜 타입 레벨 고차 함수가 필요할까요?

타입 레벨에는 구문(statement)이라 부를 수 있는 것이 없다시피하기에 함수형 프로그래밍이 강제됩니다.
함수형 프로그래밍에서 코드를 재사용하는 가장 기본적인 방법은 반복되는 로직을 고차 함수로 추상화하는 방법입니다.

```javascript
// 함수형 프로그래밍에서 if 문 대신 사용하는, 분기를 추상화한 함수
function cond(pred, then, orElse) {
  return pred() ? then() : orElse();
}

const isPositive = x => cond(n => n > 0, () => true, () => false);
```

타입스크립트에서 타입 매개변수에 주어지는 모든 타입은 구체적 -- 모든 타입 매개변수가 실제 타입으로 치환된 상태 -- 이여야만 합니다. 
그러나 타입 레벨 함수는 타입 매개변수가 남아 있는 타입 동의어이기에 타입 매개변수로서 주어질 수 없고, 따라서 타입 레벨 고차 함수를 타입스크립트에서는 작성할 수 없습니다.
가장 기본적인 코드 재사용 도구를 타입스크립트의 타입 레벨 프로그래밍에서는 사용할 수 없습니다.

이 문제를 해결하기 위한 많은 시도가 있었습니다. 
[타입스크립트에 타입 레벨 고차 함수를 추가하자는 제안](https://github.com/microsoft/TypeScript/issues?q=is%3Aissue+is%3Aopen+HKT)은 타입스크립트 깃허브 저장소에 여럿 올라왔으며, 다른 기능들을 활용해 타입 레벨 고차 함수를 모델링하는 방법들도 나왔습니다.
fp-ts는 [비슷한 처지인 OCaml의 사례](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf)를 참고하여 [인터페이스 병합을 활용한 구현법](https://gcanti.github.io/fp-ts/guides/purescript.html#polymorphic-data)을 제시하였고, 저를 비롯한 몇몇 사람들은 [`this` 타입을 이용한 구현법](https://gist.github.com/ENvironmentSet/1662a140f99381bc85fd6be51ecdcbb5)을 발견했습니다.

타입스크립트의 인터페이스는 **인터페이스 병합**이라는 특이한 기능을 하나 가지고 있습니다.
같은 이름의 인터페이스를 여러 번 정의하면 각 정의는 하나로 합쳐집니다.

```typescript
interface I {
  a: number;
}

interface I {
  b: string;
}

interface I {
  c: boolean;
}

// 타입스크립트는 위 코드를 읽고 인터페이스 I를 아래와 같이 정의합니다.

interface I {
  a: number;
  b: string;
  c: boolean;
}
```

별 볼 일 없어보이는 이 기능은 `declare` 문과 만나 그 힘을 발휘합니다.
`declare` 문과 인터페이스 병합을 조합하면 다른 모듈에 있는 인터페이스를 확장할 수 있습니다.

```typescript
// module.ts

interface I {
  a: number;
  b: string;
  c: boolean;
}

// main.ts

declare module './module.ts' {
  interface I {
    d: void;
  }
}

// 위와 같이 구성된 프로젝트에서, 타입스크립트는 인터페이스 I를 다음과 같이 정의합니다.

interface I {
  a: number;
  b: string;
  c: boolean;
  d: void;
}
```

fp-ts는 이 기능을 똑똑하게 활용합니다.
[타입 레벨 함수들을 저장하는 전역 레지스트리를 인터페이스로 구현](https://github.com/gcanti/fp-ts/blob/8486dd7866ff12b11d0a7553d2e4beddb96cae2d/src/HKT.ts#L48)하고, [타입 레벨 고차 함수들은 타입 레벨 함수를 직접 받는 대신 레지스트리에서 그 함수와 대응하는 식별자를 대신 받도록 작성](https://github.com/gcanti/fp-ts/blob/8486dd7866ff12b11d0a7553d2e4beddb96cae2d/src/Functor.ts#L34)합니다.
타입 레벨 함수를 직접 전달하는 게 어려우니 그 함수에 대응하는 식별자를 사용해 간접적으로 함수를 전달하는 아이디어입니다.
비록 [타입 레벨 함수의 매개변수 숫자에 맞춰 레지스트리를 여러 개 만들어야 한다는 문제점](https://github.com/gcanti/fp-ts/blob/master/src/HKT.ts#L48-L66)과 [식별자를 실제 함수로 대응](https://github.com/gcanti/fp-ts/blob/8486dd7866ff12b11d0a7553d2e4beddb96cae2d/src/HKT.ts#L104)시켜야 하기에 번거롭다는 문제점이 있기는 하지만
타입스크립트 팀의 설계 의도를 벗어나지 않아 예상치 못한 버그를 마주할 경우가 희박한 안전한 방법입니다.

```typescript
type Not<x> = x extends true ? false : true;

interface HighOrderTFunctions<T> {
  'Not': Not<T>
}
type HighOrderTFunctionNames = keyof HighOrderTFunctions<any>;

type Call<Identifier extends HighOrderTFunctionNames, T> = HighOrderTFunctions<T>[Identifier];

type Filter<Pred extends HighOrderTFunctionNames, List>
  = List extends [infer Head, ...infer Tail] ?
  Call<Pred, Head> extends true ? [Head, ...Filter<Pred, Tail>] : Filter<Pred, Tail>
  : [];

type Test = Filter<'Not', [true, true, false, true]>; // [false]
```

`this` 타입을 이용한 방법은 조금 더 깔끔합니다.
`this` 타입은 자신을 언급하는 프로퍼티 혹은 메서드가 포함된 객체 타입을 가르키는 타입입니다.
중요한 특징은, **이 타입이 가르키는 객체 타입은 이 타입이 계산될 때 마다 결정된다는 점**입니다.
따라서 교차 타입(intersection type)을 활용하면 동적으로 `this` 타입의 계산 결과를 바꿔나갈 수 있습니다.
즉, 타입 레벨 함수 호출을 구현할 수 있습니다.

```typescript
interface HighOrderTFunction {
  param: unknown;
  result: unknown;
}

interface Not extends HighOrderTFunction {
  result: this['param'] extends true ? false : true;
}

type Call<F extends HighOrderTFunction, T> = (F & { param: T })['result'];
```

`this` 타입을 통해 구현된 타입 레벨 함수는 형식적으로는 타입 매개변수가 없는 상태이기 때문에 자유롭게 타입 매개변수에 전달될 수 있으며, 따라서 타입 레벨 고차 함수도 쉽게 구현할 수 있습니다.

```typescript

type Filter<Pred extends HighOrderTFunction, List>
  = List extends [infer Head, ...infer Tail] ?
  Call<Pred, Head> extends true ? [Head, ...Filter<Pred, Tail>] : Filter<Pred, Tail>
  : [];

type Test = Filter<Not, [true, true, false, true]>; // [false]
```

이 트릭은 [타입스크립트 팀으로부터 기능으로 인정받은 트릭](https://github.com/microsoft/TypeScript/issues/40928)입니다만, 타입스크립트의 구현 의도와 버그 사이를 아슬아슬하게 줄타기하는 트릭이기에 [가끔 이상한 상황](https://github.com/gcanti/fp-ts/issues/1208#issuecomment-627965353)이 발생하기도 합니다.
인터페이스 병합을 이용하는 방식보다는 편리하지만 위험 부담이 있습니다.

--------

타입스크립트에서 타입 레벨 고차 함수를 구현하는 방법을 살펴보았습니다.
타입스크립트의 다른 기능들을 활용해 타입 레벨 고차 함수를 임의로 구현할 수 있으나 각 방법마다 무시할 수 없는 결점이 있었습니다.
빠른 시일 내에 타입스크립트에서 타입 레벨 고차 함수를 정식으로 지원해 이런 트릭을 안 써도 되는 날이 왔으면 하는 바람입니다.
긴 글 읽어주셔서 감사합니다.