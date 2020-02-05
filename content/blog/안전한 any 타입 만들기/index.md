---
title: 안전한 any 타입 만들기  
date: 2020-02-05  
description: 타입스크립트에서 existential type 인코딩하기  
somethings: 3  
---

타입스크립트에서 가장 유용한 타입은 무엇일까요?
저는 `any` 라고 생각합니다.
항상 타입 검사를 만족시킨다는 특성이 타입스크립트에서도 자바스크립트 모듈을 손쉽게 사용할 수 있게 해주기 때문입니다.
이렇게 자바스크립트의 거대한 생태계를 그대로 활용할 수 있게 해준다는 점에서, **`any`는 타입스크립트의 생산성을 높여주는 유용한 타입**입니다.

```typescript
declare const untypedModule: any;
```

그럼 타입스크립트에서 가장 유용하지 않은 타입은 무엇일까요?
저는 이 또한 `any`라고 생각합니다.
항상 타입 검사를 만족시킨다는 특성이 타입 검사의 의의를 퇴색시키기 때문입니다.
어떤 비정상적인 연산이라도 `any` 타입이 붙어버리면 타입 검사를 통해 걸러낼 수 없기 때문에 **`any`는 프로그램의 안전성을 낮추는 유용하지 않은 타입**입니다.

```typescript
('something' as any) * 10;
```

마치 양날의 검 같군요, 잘 쓰면 빠르게 프로덕트를 개발할 수 있지만 자칫 잘못 쓰면 되려 버그 지옥에 빠지게 되니까요. 
버그 지옥에 빠질 일 없이, 안전하게 `any`를 쓰는 방법은 없을까요?

있습니다!
그것도 **안전한 `any`를 구현하는 방법**이요!
지금부터 알려드리도록 하겠습니다.

## 안전한 `any`란?

먼저, 가장 중요한 질문을 던져 보도록 하겠습니다.
**안전한 `any`란 무엇일까요?**
**`any`의 어떤 성질이 `any`를 위험하게 만들고 어떤 성질이 `any`를 가치있게 만들까요?**

이 질문에 답하려면 먼저 서브타입 관계(*subtype relation*)와 탑 타입(*top type*)을 알아야 합니다.

### 서브타입 관계

**다른 한 타입을 포함하는 타입**을 **슈퍼타입(*supertype*)**이라고 하고, **슈퍼타입에 포함되는 타입**을 **서브타입(*subtype*)**이라고 합니다.
'타입을 포함한다'의 기준은 타입 시스템 별로 다르지만 구조적 타입 시스템(*structural type system*)을 가진 [타입스크립트의 경우, 한 타입이 다른 한 타입의 값을 모두 포함하고 있으면 그 타입을 포함한다고 합니다](https://github.com/microsoft/TypeScript/blob/master/doc/spec.md#3.11.3).

```typescript
type Supertype = { x: boolean }
type Subtype = { x: boolean, y: number }
``` 

위 코드에서, `Supertype`의 값은 타입이 `boolean`인 프로퍼티 `x`를 가진 객체입니다.
`Subtype`의 값은 마찬가지로 타입이 `boolean`인 프로퍼티 `x`를 가지지만 동시에 타입이 `number`인 프로퍼티 `y`도 가지는 객체이지요.

유심히 살펴보니 `Subtype`의 값은 타입이 `boolean`인 프로퍼티 `x`를 가지는 객체이기도 합니다.
즉, 모든 `Subtype`의 값은 `Supertype`의 값이기도 한 것이지요.
이렇게 `Supertype`이 `Subtype`을 포함하기 때문에, `Supertype`은 `Subtype`의 슈퍼타입이고 `Subtype`은 `Supertype`의 서브타입이라고 할 수 있습니다.

이러한 **슈퍼타입과 서브타입, 두 타입 간의 포함 관계를 서브타입 관계**라고 하며 `<:`를 통해 `서브타입 <: 슈퍼타입` 형식으로 표현합니다.

```
 Subtype <: Supertype
 number <: number | string
```

> **심화 문제 #1**  
`StarWars <: Movie <: Entertainment`라고 할 때, `(starWars: StarWars) => Entertainment`는 `(movie: Movie) => Movie`의 서브타입인가요?
그리고 왜 그렇게 생각하셨나요?  

> **심화 문제 #2**  
타입스크립트에서 `Array<number>` 타입은  `Array<number | string>` 타입의 서브타입입니다.
이 서브타입 관계는 올바른 관계인가요?
>그리고 왜 그렇게 생각하셨나요?

### 탑 타입

서브타입 관계를 따질 수 있는 타입 시스템에는 탑 타입이라 불리는 특별한 타입이 존재합니다.

**탑 타입**은 **모든 타입의 슈퍼타입**으로 **모든 타입의 값을 담을 수 있지만, 모든 타입의 값에 대해 공통적으로 할 수 있는 연산 외에는 그 어떤 연산도 할 수 없다는 점이 특징**입니다.
타입스크립트에서 탑 타입은 `unknown`입니다.

```typescript
let top: unknown = 'a';
top = {};
top = 1;

top + 1; // Wrong!
```

> **심화 문제 #3**  
왜 탑 타입의 값에 대해서는 모든 타입의 값에 대해 공통적으로 할 수 있는 연산 외에 어떤 연산도 할 수 없을까요?

### 모순적인 타입, `any`

`any`는 모든 타입의 슈퍼타입이기 때문에 탑 타입입니다.
그렇지만, `any`는 탑 타입의 '탑 타입의 값에는 모든 타입의 값에 적용 가능한 연산 외에 어떤 연산도 적용할 수 없다'라는 특징을 가지고 있지 않습니다.
이게 과연 가능한 일일까요?

아니요, 전혀 그렇지 않습니다.
탑 타입은 모든 타입의 값을 갖기 때문에 안전한 타입이 되려면 당연히 모든 타입의 값에 적용 가능한 연산만 적용할 수 있어야 함이 마땅하기 때문이죠.
즉, **탑 타입이면서 탑 타입의 특징을 가지고 있지 않은 타입의 존재는 모순 그 자체이며, 그렇기에 `any`는 위험한 타입입니다**.

### `any`의 가치

그럼 타입스크립트는 왜 이런 모순적인 타입을 가지고 있는 걸까요?
그 이유는 [타입스크립트의 디자인 목표](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals)에서부터 추측할 수 있습니다.

타입스크립트의 개발 목표는 **철옹성과 같은 안전한 타입 시스템**을 도입해 자바스크립트에서 발생할 수 있는 **모든 오류를 걷어내는 데 있는 게 아니라**,
**자바스크립트의 생산성을 보전하면서 오류가 될 수 있는 코드들을 걸러주는 거름망 같은 타입 시스템**을 도입하는 데 있기 때문에 `any`와 같이 안전성을 해치지만 생산성을 보전하는 데에 도움이 되는 타입을 만들었다고 생각합니다.

그렇기에 **`any`의 가치는 자바스크립트 코드를 그대로 사용할 수 있게 함으로서 타입스크립트의 생산성을 높여주는 데 있다**고 할 수 있겠습니다.

----

다시 본론으로 돌아가, 계속해서 안전한 `any`를 정의해 보도록 하지요.

안전한 `any`는 그리 거창한 게 아닙니다.
`any`의 가치를 보전하면서 `any`를 위험하게 만드는 성질을 제거한 타입을 안전한 `any`라고 할 수 있겠지요.

`any`를 위험하게 만드는 성질은 `any`가 탑 타입이면서 탑 타입의 특징을 가지지 않는다는 성질이고, `any`의 가치는 모든 자바스크립트 코드를 수용할 수 있다는 점에 있는데 이 특징은 `any`가 탑 타입이라는 성질에서 비롯된 것이니 **탑 타입의 특징을 제대로 가지고 있는 `any`가 안전한 `any`**라고 할 수 있겠습니다.

이렇게, 안전한 `any`가 무엇인지 정의하였으니 지금부터는 안전한 `any`를 만들기 위한 지식을 익히고 안전한 `any`를 만들어 보도록 하겠습니다.

## 제네릭

**제네릭(*generic*)은 특정 개념의 정의에 타입 매개변수(*type parameter*)를 포함시킬 수 있게 해주는 기능**입니다.
여러 타입을 가질 수 있는 일반적인 개념의 타입을 하나로 제한하지 않고, 여러 타입을 가질 수 있게 하기 위해 사용되는 기능입니다.

```typescript
const identity: <A>(a: A) => A // 타입 A와, 그 타입의 값 a를 받고 A 타입의 값을 반환하는 함수
  = a => a;

identity<number>(1); // 1 as number
identity<boolean>(true); // true as boolean
```

### 제네릭에 대한 다른 해석

앞서 보여드린 예시의 `identity` 함수는 타입 `A`와 그 타입의 값인 `a`를 받아 `A` 타입의 값을 반환하는 함수입니다.
하지만 모든 타입 `A`에 대해 `(a: A) => A` 타입을 갖는 함수가 존재한다는 선언으로도 볼 수도 있습니다.

제네릭에 대한 다른 해석은 다음과 같이 의사 코드로 표현할 수 있습니다.

```typescript
const identity: <forall A>(a: A) => A // 모든 타입 A에 대해 (a: A) => A 타입을 갖는 함수
  = a => a;
```

여기서 `forall`이 **모든 타입**(`A`)에 대해 개념(`(a: A) => A` 타입의 함수)이 **존재**함을 선언한다고 하여 `forall`을 **보편 양화사(*universal quantifier*, a.k.a `∀`)**라고 부릅니다.
또한, 이렇게 **보편 양화사를 통해 표현된 타입의 값은 무한한 곱 타입(*product type*)이나 교차 타입(*intersection type*)의 값으로도 볼 수 있습니다**.

```typescript
const identity: 
  & ((a: number) => number)
  & ((a: boolean) => boolean)
  & ((a: string) => string)
  & ... 
  = a => a;
```

> **심화 문제 #4**  
무한한 곱 타입의 값으로 `identity` 함수를 표현해 보세요.
무한한 교차 타입의 값으로 표현된 경우와 같다고 할 수 있나요?
왜 그렇게 생각하셨나요?

> **심화 문제 #5**  
`<forall A>(a: A) => void` 타입과 `(a: <forall A>A) => void` 타입은 같은가요?
같다면 같은 이유를, 다르다면 다른 이유를 설명해 보세요.

> **심화 문제 #6**  
`<forall A>() => A` 타입과 `() => <forall A>A` 타입은 같은가요?
이 문제 또한 같다면 같은 이유를, 다르다면 다른 이유를 설명해 보세요.

### 보편 양화사의 짝

대수 데이터 타입(*algebraic data type*)에서 곱 타입의 짝이 합 타입(*sum type*)인 것 처럼, 보편 양화사에게도 **무한한 합 타입으로 나타낼 수 있는 짝**이 있습니다.
바로 `for some` 혹은 `there exist`라고도 불리는 **존재 양화사(*existential quantifier*, a.k.a `∃`)**이지요.
존재 양화사는 보편 양화사와 달리 모든 타입이 아닌 **어떤 타입**에 대해 **개념이 존재**함을 나타내는 양화사입니다.

`identity` 함수의 `forall`을 존재 양화사를 나타내는 `forsome`으로 바꾸어 봅시다.

```typescript
const identity2: <forsome A>(a: A) => A // 어떤 타입 A에 대해 (a: A) => A 타입을 갖는 함수
  = a => a;
```

외형적으로는 `forall`이 `forsome`으로 바뀌었다는 점 외에는 차이가 없습니다만, 의미론적으로 둘 사이에는 큰 차이가 존재합니다.
바로 identity2 함수는 호출될 수 없다는 점이지요.
왜냐면 타입이 호출할 수 있을 만큼 구체적이지 않기 때문입니다.

이 사실은 `identity2`함수의 타입을 무한한 합 타입(*sum type*)으로 표현하면 더욱 잘 드러납니다.

```typescript
const identuty2: 
  | ((a: number) => number)
  | ((a: boolean) => boolean)
  | ((a: string) => string)
  | ... 
  = a => a;
```

보시다시피 `identity2`의 타입은 `((a: number) => number) | ((a: boolean) => boolean) | ...`으로, 호출할 수 있을 만큼의 구체적인 타입이 아닙니다.

`identity2`의 타입과 같이 존재 양화사를 통해 정의된 타입을 existential type이라 부르는데요, 이런 타입들은 한 가지 문제를 가지고 있습니다.
바로 **한번 existential type으로 업캐스팅(*upcasting*)을 하면 타입 시스템이 이전 타입을 잊어 버리기 때문에 다시는 다운캐스팅(*downcasting*)을 할 수 없다는 점**입니다.

다시 다운캐스팅 될 수 없기 때문에 existential type으로 업캐스팅 된 값에는 더 제한적인 연산, 즉 existential type을 무한한 합 타입으로 보았을 때 existential type을 구성하는 모든 타입에 대해 가능한 연산만 수행할 수 있습니다.
이러한 제약을 반영해, existential type의 값에 대해 함수를 적용하는 연산은 일반적인 값들과 달리 `$`나 `pipe` 함수와 같은 부류의 함수가 아닌 **eliminator**라는 부류의 함수로 추상화되곤 합니다.

구체적으로, **eliminator는 처리하고자 하는 값과 그 값의 타입을 구성하는 모든 타입의 값을 처리할 수 있는 함수를 받아, 그 값을 함수에 적용하여 얻은 결과를 반환하는 함수**입니다.
위 `identity2` 함수와 같은 함수들을 처리하는 eliminator는 아래와 같이 정의할 수 있습니다.

```typescript
const elimIdentityFunction: <forall R>(id: <forsome A>(a: A) => A, f: <forall A>(x: (a: A) => A) => R) => R
  = (id, f) => f(id);
```

> **심화 문제 #7**  
`elimIdentityFunction(identity2, identity)`는 실행 가능한 코드인가요?
왜 그렇게 생각하셨나요?

## 안전한 `any` 만들기

지금까지가 안전한 `any`를 만들기 위해 필요한 배경 지식이었습니다.
이제부터 안전한 `any`를 만들어 보도록 하지요.

우리의 목표인 안전한 `any`는 모든 타입의 슈퍼타입, 즉 탑 타입입니다.
그렇기에 **모든 타입을 포함해야 하고, 이는 아래와 같이 합 타입을 통해 표현할 수 있겠습니다**.

```typescript
type SafeAny = number | boolean | string | ...;
```

합 타입을 보면 무언가가 떠오르지 않으시나요?
앞서 무한한 합 타입으로도 취급할 수 있는 것에 대해 이야기했었잖아요.
네! 존재 양화사요!

그러고 보니 타입스크립트에서 **타입은 무한히 존재**합니다.
이는 배열 타입을 통해 쉽게 증명할 수 있지요.

```typescript
type ArrayOfNumber = Array<number>
type ArrayOfArrayOfNumber = Array<ArrayOfNumber>
type ArrayOfArrayOfArrayOfNumber = Array<ArrayOfArrayOfNumber>
type ArrayOf...ArrayOfNumber = Array<ArrayOf...ArrayOfNumber>
```

어떤 자연수 n에 대해 n차원 배열 타입이 존재할 때, n+1 차원의 배열 타입이 존재하며, 1차원의 배열 타입은 항상 존재하니 귀납적으로 모든 자연수에 대해 그 자연수를 차원으로 하는 배열 타입이 존재함을 알 수 있지요.
또한 정수는 무한하니 배열 타입이 무한히 존재함을 이를 통해 알 수 있지요.

다시 탑 타입으로 돌아가 이야기를 계속하자면, 타입 시스템에 있는 타입이 무한하다면 탑 타입은 무한한 합 타입으로 표현될 수 있다는 이야기입니다.
즉, **존재 양화사를 이용해서 탑 타입을 정의할 수 있다**는 말이지요.

```typescript
type SafeAny = <forsome A>A
```

이것이 바로 탑 타입이자 우리가 지금까지 찾던 안전한 `any` 타입입니다!
하지만 이 정의에는 문제가 하나 있습니다.
바로 타입스크립트에는 `forsome`과 같은 직접적으로 존재 양화사를 나타내는 방법이 없다는 점입니다.
위 `SafeAny`는 우리의 상상 속 타입 시스템에는 존재하나 타입스크립트의 타입 시스템에는 존재하지 않지요.

하지만 걱정 마세요, **존재 양화사는 보편 양화사를 통해 표현될 수 있습니다**.
제네릭이란 이름으로 타입스크립트에 있는 우리의 친구를 통해서요!

### 보편 양화사로 존재 양화사를 표현하는 방법

여기, 존재 양화사로 정의된 함수가 있습니다.

```typescript
const discard: (_: <forsome A>A) => undefined
  = _ => undefined;
```

이 함수의 타입을 무한한 합 타입으로 풀어서 보면

```typescript
const discard: (_: number | boolean | string | ...) => undefined 
  = _ => undefined;
```

`discard` 함수는 `number` 타입이나 `boolean` 타입이나 `string` 타입이나 ... 타입의 값을 받아서 `undefined` 타입의 값으로 바꾸는 함수, 즉 어떤 타입의 값이든 전부 `undefined` 타입의 값으로 바꾸는 함수라는 것을 알 수 있습니다.

`discard` 함수의 구현만 보면 이는 더 명백하게 드러납니다.

```typescript
_ => undefined
```

여기, 이번에는 제네릭으로 정의된 함수가 있습니다.

```typescript
const discard2: <A>(_: A) => undefined
  = _ => undefined;
```

제네릭을 이용한 선언은 보편 양화사를 이용한 선언으로도 볼 수 있으니 위 코드를 보편 양화사를 이용한 코드로 바꾸어 보겠습니다.

```typescript
const discard2: <forall A>(_: A) => undefined
  = _ => undefined;
```

또한 보편 양화사를 통해 표현된 타입은 무한한 교차 타입으로 표현할 수도 있으니 다시 코드를 바꾸어 보겠습니다.

```typescript
const discard2: 
  & ((a: number) => undefined)
  & ((a: boolean) => undefined)
  & ((a: string) => undefined)
  & ... 
  = _ => undefined;
```

바꾼 코드를 보면 `discard2` 함수가 `number` 타입의 값을 받아 `undefined` 타입의 값으로 바꾸는 함수이면서, `boolean` 타입의 값을 받아 `undefined` 타입의 값으로 바꾸는 함수이고 ... 타입의 값을 받아 `undefined` 타입의 값으로 바꾸는 함수임을 알 수 있습니다.
그리고 이는 곧 `discard2` 함수가 어떤 타입의 값이든 전부 `undefined` 타입의 값으로 바꾸는 함수라는 말과 같지요.

이번에도 `discard2` 함수의 구현만 보면 이는 더 명백하게 드러납니다.

```typescript
_ => undefined
```

지금까지 보셨다시피, `number` 타입이나 `boolean` 타입이나 `string` 타입이나 ... 타입의 값을 받아서 `undefined` 타입의 값으로 바꾸는 함수의 타입은 `number` 타입의 값을 받아 `undefined` 타입의 값으로 바꾸는 함수이면서 ... 타입의 값을 받아 `undefined` 타입의 값으로 바꾸는 함수의 타입과 같습니다.
즉, **existential type의 값을 받는 함수는 그 타입을 구성하는 모든 타입에 대해 정의된 함수와 같다**는 거지요.

이는 아래와 같이 일반화하여 표현할 수 있으며, 이것이 바로 존재 양화사를 보편 양화사로 표현하는 방법 중 하나입니다.

```typescript
// T는 임의의 제네릭 타입
<forall B>(x: <forsome A>T<A>) => B = <forall B, forall A>(x: T<A>) => B
```

> **심화 문제 #8**  
`forall B. forsome A. (x: A) => B` 타입을 보편 양화사만 사용해서 표현해 보세요.

----

좋아요, 이제 존재 양화사를 보편 양화사로 대체하는 방법을 알아냈으니 `SafeAny`의 정의에서 존재 양화사를 제거할 수 있겠지요?
유감이지만, 아닙니다.
`SafeAny`의 정의에서의 존재 양화사는 매개변수의 타입을 나타내는 데 쓰인 게 아니기 때문에 우리가 알아낸 방법으로 제거할 수 없습니다.

그렇다고 낙담하지는 마세요, 해결책이 있습니다.
바로 `SafeAny`의 값이 일반적인 값이 아니라, 컨티뉴에이션(*continuation*)이 되게 만드는 방법입니다.

### 값을 표현하는 함수

**컨티뉴에이션은 값을 표현하는 함수로, 구체적으로는 함수를 받아 자신이 표현하는 값에 그 함수를 적용하는 함수입니다.**
놀랍게도, 어떤 값의 컨티뉴에이션은 그 값과 본질적으로 같습니다.
왜냐하면 어떤 값과 그 값의 컨티뉴에이션은 모두 같은 목적으로 쓰일 수 있으며, 한 쪽이 다른 쪽으로 변환될 수도 있기 때문입니다.

예를 들어, `1`과 `1`의 컨티뉴에이션은 다음과 같이 정의할 수 있습니다.

```typescript
const one = 1;
const contOfOne = f => f(1);

one + 1 === contOfOne(n => n + 1) // 같은 연산을 수행할 수도 있습니다
one === contOfOne(n => n) && (n => f => f(n))(one)(n => n) === contOfOne(n => n) // 한 쪽이 다른 쪽 표현으로 변환될 수도 있습니다
```

> **심화 문제 #9**  
어떤 값을 받아 그 값의 컨티뉴에이션을 만드는 함수 `to`와, 컨티뉴에이션을 받아 그 컨티뉴에이션이 표현하는 값을 꺼내는 함수 `from`을 만들어 보시고, 만든 두 함수를 각기 다른 순서로 합성해 함수 `id1`과 `id2`를 만들어 보세요.
`id1`과 `id2`는 각각 어떤 함수인가요?

----

`SafeAny`의 값이 모든 타입의 값에서 모든 타입의 값의 컨티뉴에이션이 되면 `SafeAny`의 정의를 `<forall R>(f: (x: <forsome A>A) => R) => R`로 바꿀 수 있고, 이 타입의 존재 양화사는 앞서 우리가 알아낸 방법을 통해 아래와 같이 보편 양화사로 치환할 수 있습니다!

```typescript
type SafeAny = <forall R>(f: <forall A>(x: A) => R) => R
```

제네릭과 보편 양화사는 같으므로 보편 양화사를 표현하기 위해 사용한 의사 코드인 `forall`을 제거해 올바른 타입스크립트 코드로 만들어 줍시다.

```typescript
type SafeAny = <R>(f: <A>(x: A) => R) => R
```

이렇게 우리의 안전한 `any`, `SafeAny`가 만들어졌습니다!
하지만 아직 모든 일이 끝난 건 아닙니다.
`SafeAny`의 값이 모든 타입의 값이 아닌 모든 타입의 값의 컨티뉴에이션이기 때문에, 모든 타입의 값을 컨티뉴에이션으로 바꿔 주는 함수가 필요합니다.

모든 타입의 값을 컨티뉴에이션으로 바꿔 주는 함수는 아래와 같이 정의할 수 있습니다.

```typescript
const safeAny: (x: <forsome A>A) => SafeAny
  = x => f => f(x);
```

이 함수의 존재 양화사를 보편 양화사로 치환하는 일을 마지막으로, 안전한 `any`가 완성됩니다.

```typescript
type SafeAny = <R>(f: <A>(x: A) => R) => R

const safeAny: <A>(x: A) => SafeAny
  = x => f => f(x);
```

> **심화 문제 #10**  
`SafeAny`의 eliminator를 만들고, 커링해 보세요.
어떤 함수가 보이시나요?

> **심화 문제 #11**  
`() => string` 타입의 `toString` 메서드가 있어 문자열로 바꿀 수 있는 모든 값을 담는 타입, `HasShow`를 구현해 보세요.

## 마무리

이번 글에서는 안전한 `any` 타입을 만들어 보며 보편 양화사와 존재 양화사에 대해 알아보았습니다.
일반적인 프로그래밍에서는 잘 쓰이지 않고 타입 레벨 프로그래밍에서나 주로 쓰이는, 많은 분들이 생소해 하실 법한 개념이라 최대한 쉽게 설명하고자 노력해 보았는데 그래도 어려운 부분이 남아있는 거 같아 읽으시는 내내 힘들지는 않으셨는지 걱정되네요.

이미 알고 계신 분도 있으시겠지만 사실 이번에 만든 안전한 `any` 타입은 [타입스크립트에 이미 `unknown` 이란 이름으로 구현되어 있습니다](https://github.com/microsoft/TypeScript/pull/24439).
심지어 더 사용하기에 편한 형태로요.
물론 그렇다고 해서 지금껏 공부한 개념들이 무용지물이 되는 것은 아닙니다.
Existential type으로 탑 타입을 만드는 일만 할 수 있는 게 아니라 [타입을 통해 값의 소코프를 결정하는 일(a.k.a ST Trick)](https://www.typescriptlang.org/play/index.html#code/C4TwDgpgBAcg9gWwJYDsCGAbDIAq4IAmA6ksABYAKZaKwiAPDgDSwB8UAvFDlAGRRUadBHkgU0AJzQIIwCBPoxWAbgCwAKA1oARgGdgUgMbAohjGl26B1WolERxUmXIUV2AbygaoUMBLhyxoRQOvpGJgD6KIiomDhoAOYAFGAAXAIAlOkUGgC+GhqgkFAAyjj0JSwAguxc8MjoWLj4xKSUNsL0nhIQaARwKNhQAG6YAK4Q6VVQuSwlKgXqAGZjKMZIA1D6FdWsSaMYE1NZpeWVUDVQnt5QPcBjEihXNz4HE0w3uSFWZTsXC+p8pp1PoAHQINBgThQP5VFgAIT2S3SSTQx047HhGQxUCSnje0Fy6V+5xq2I47G250RSSW+3GEAyGTUIOAoMh0NhCL2+IZ6SWM2JZxYqPRFKgiPJ7DxIwZgtOsNYUqgdIJzI0YO0qAInNJ3JlBPlJN2ytpKLRF2VxolSpxqoZ6tZoPIECeXC5NqSESFitN+nhPuptvF-pZGhWa2AGyeElWvxqSUMA2A6Qqeytwv+J2m13UPjuDyeSdoSQyoIJLKBhXwpwAShAlorofVYk17K1yIJbAgurcG1MZnMAeHVutNvp643SXsesjLULJ03c-nZIXnnmfH2lp9vnWG4rK4sI2OnigIAB3MqL6f0w6TecK85X-fTjxeDcFx5bYBJCcN28TEyh7AseUabD0fTPlOuwyrORo4NeJqBrsVzviu9xfvoSSzo6VbLKOYFPOeEikBAUGKr+wCTlUC4vkhuIWlUGZ-MMcBIAQHg3J+TxoDiy6bn+SxVKCcFcGgYYbuha5YasBANqghCOj4QJ4bGKC-CgYwINo8h7GmpYYjcmran85HnJp2m6SwFk6RIewvFAZ6Xgh-4AAxMg52ENjiYIuigLFsQQ1labZezEaRUFeUsGRJAAjEyXmQS5dI4R56jYgA1FAABMyhQAA9PlUAAMyLGpZRJPpyrGSgBBJE5ZksNocBwBgvQoHsBiATFEEEFBQEFUVXUQGVcY4EkBnig1yVxQNhVQPI-gSAAhEAA)이나, [정적 타입 시스템에서 동적 타이핑을 구현하는 일](https://hackage.haskell.org/package/base-4.12.0.0/docs/Data-Dynamic.html)과 같은 재미있는 일들을 많이 할 수 있거든요.
시간 나실때 이런 것들을 직접 찾아보시면서 만들어 보시는 것도 좋을 거 같습니다.

그럼 저는 이만 여기서 글을 마무리하도록 하겠습니다.
긴 글 읽어주셔서 감사합니다.

## 읽을거리

- [Thinking with Types](https://thinkingwithtypes.com)  
타입 레벨 프로그래밍 책입니다.
대수 타입에서 시작해 의존 타입까지 다룹니다.
이론적인 측면보다는 하스켈을 통한 실용적인 측면에서 이야기를 펼쳐나가기 때문에 논리학이나 타입 이론을 잘 모르는 독자도 큰 문제 없이 읽을 수 있다는 장점이 있습니다.

- [Existential type-curry](http://blog.ezyang.com/2010/10/existential-type-curry/)  
보편 양화사로 존재 양화사를 표현하는 법에 대한 글입니다.
수학적인 증명을 포함해, 더 엄밀하고 정확한 설명이 담겨 있습니다.

- [Quantified Types as Products and Sums](https://en.m.wikibooks.org/wiki/Haskell/Existentially_quantified_types#Quantified_Types_as_Products_and_Sums)  
각 양화사로 표현된 타입을 각각 무한한 곱 타입과 합 타입으로 보는 관점에 대한 토막글입니다.

- [Existential vs. Universally quantified types in Haskell](https://stackoverflow.com/questions/14299638/existential-vs-universally-quantified-types-in-haskell)  
존재 양화사로 정의된 타입과 보편 양화사로 정의된 타입의 차이를 묻는 스택오버플로 질문글입니다.
두 답변이 있는데 둘 다 존재 양화사에 대해서 잘 설명하고 있으니 더 알고 싶으시다면 읽어보셔도 좋은 글입니다.