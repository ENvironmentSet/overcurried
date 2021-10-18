---
title: 유령 타입   
date: 2021-10-18  
description: 무서운 녀석은 아니니까 겁 먹지 마세요. 
somethings: 2  
keywords: Phantom type, Phantom type parameter, 팬텀 타입, 유령 타입, 타입스크립트
---

유령 타입 매개변수(Phantom type parameter)는 타입 선언에는 존재하나 타입을 구성하지는 않는 타입 매개변수를 가르키는 말입니다. 유령 타입 매개변수를 갖는 타입은 유령 타입(Phantom type)이라 부릅니다.

```typescript
type T<P> = never;
// P는 유령 타입 매개변수이고, T는 유령 타입입니다.
```

유령 타입 매개변수를 사용하면 컴파일 타임에만 필요한 정보를 별도로 관리할 수 있습니다. 즉, 런타임에는 무의미한 정보를 값에서 걷어낼 수 있습니다. 아래는 클라이언트의 권한에 따른 연산에서의 제약을 기술하는 예시입니다.

```typescript
type User = 'User';
type Admin = 'Admin';
type Developer = 'Developer';

enum GameMode {
  NORMAL,
  DEBUG
}

type Client<Permission> = { name: string, level: number, gameMode: GameMode, permission: Permission };

function getLevel(client: Client<any>): number {
  return client.level;
}

function setLevel(client: Client<Admin> | Client<Developer>, target: Client<any>, level: number): void {
  target.level = level;
}

function debugModeOn(client: Client<Developer>): void {
  client.gameMode = GameMode.DEBUG;
}

function client<Permission>(name: string, permission: Permission): Client<Permission> {
  return { name, level: 1, gameMode: GameMode.NORMAL, permission };
}
```

`Client` 타입의 값들은 `permission`이라는 권한 추적용 프로퍼티를 갖습니다. 적절한 권한을 가진 클라이언트가 연산을 요청하는지는 컴파일 타임에 정적으로 분석되는 반면, 권한 추적용 프로퍼티는 런타임에도 남아 메모리 공간을 차지합니다. 즉, `permission`  프로퍼티로 다뤄지는 정보는 필요 이상으로 프로그램에 존재합니다. 이 문제는 유령 타입 매개변수를 사용하여 다음과 같이 해결할 수 있습니다.

```typescript
/**
  타입스크립트는 유령 타입 매개변수를 네이티브하게 지원하는 언어가 아닙니다.
  그렇기 때문에 유령 타입 매개변수를 우회적으로 나타내기 위한 유틸 타입이 필요합니다.
  아래의 제네릭 타입은 그런 용도의 타입으로, 지금은 무시하고 넘어가셔도 좋습니다.
 **/

abstract class PhantomTypeParameter<Identifier extends string | number | symbol, InstantiatedType> {
  protected readonly abstract _: {
    readonly [NameP in Identifier]: (_: InstantiatedType) => InstantiatedType;
  };
}

type User = 'User'
type Admin = 'Admin'
type Developer = 'Developer'

enum GameMode {
  NORMAL,
  DEBUG
}

type Client<Permission> = { name: string, level: number, gameMode: GameMode } & PhantomTypeParameter<'Permission', Permission>

function getLevel(client: Client<any>): number {
  return client.level;
}

function setLevel(client: Client<Admin> | Client<Developer>, target: Client<any>, level: number): void {
  target.level = level;
}

function debugModeOn(client: Client<Developer>): void {
  client.gameMode = GameMode.DEBUG;
}

function client<Permission>(name: string): Client<Permission> {
  return { name, level: 1, gameMode: GameMode.NORMAL } as Client<Permission>;
}
```

타입 레벨 프로그래밍에서는 타입이 곧 값이기 때문에 타입의 내부 구조는 프로그래머에게 그다지 중요한 요소가 아닙니다. 그렇기 때문에 유령 타입은 타입의 내부 구조를 기술하지 않고 무시하고 넘어가기 위해 쓰일 수도 있습니다.

```typescript
type Z = 'Z';
type S<N> = PhantomTypeParameter<'N', N>;
```

## 타입스크립트에서의 유령 타입

타입스크립트의 타입 시스템은 타입의 구조를 기준으로 타입 검사가 이루어지는 [구조적 타입 시스템(Structural type system)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system)이기 때문에 타입의 구조에 영향을 주지 않는 유령 타입 매개변수들은 실질적인 의미를 갖지 못합니다. 타입스크립트에서는 일반적인 방법으로 유령 타입의 효과를 누릴 수 없습니다.

```typescript
type Z = 'Z';
type S<N> = never; // S<Z>와 S<S<Z>>의 구조가 같기 때문에 둘은 동일하게 취급됩니다.
```

따라서 우회적으로 유령 타입 매개변수를 표현해야 합니다. 가장 간단한 방법은 유령 타입 매개변수를 타입 구조에 포함시키되, 실제 코드에서는 이를 무시하여 유령 타입 매개변수처럼 대하는 방법입니다.
```typescript
interface PhantomTypeParameter<InstantiatedType> { 
  _: InstantiatedType
}
type Client<Permission> = { name: string, level: number, gameMode: GameMode } & PhantomTypeParameter<Permission>;

function client<Permission>(name: string): Client<Permission> {
  return { name, level: 1, gameMode: GameMode.NORMAL } as Client<Permission>;
}
```

유령 타입 매개변수를 타입의 구조에 포함시키기 위해 쓰인 필드에는 어떤 값도 담기지 않습니다. 그러나 타입 선언 상, 프로그래머는 이 필드에 접근할 수 있고, 유령 타입 매개변수 타입에 해당하는 값을 기대할 수 있습니다.

```typescript
const john = client<User>('john');

john.permission; // 타입 검사에서는 문제 없는 코드, 그러나 실제로는 문제 발생
```

단순히 “이 필드는 타입 시스템을 속이기 위해 만든 더미 필드니까 우리 모두 접근하지 맙시다” 라는 약속만으로는 충분하지 않습니다. 더미 필드에 접근할 수 없도록 타입을 수정해야 합니다.

```typescript
abstract class PhantomTypeParameter<InstantiatedType> {
  protected abstract _: InstantiatedType;
}

type Client<Permission> = { name: string, level: number, gameMode: GameMode } & PhantomTypeParameter<Permission>;
```

또한, 유령 타입 매개변수를 여러 개 정의할 수도 있어야 합니다.
```typescript
type Client<Permission, Something> = 
  { name: string, level: number, gameMode: GameMode } 
  & PhantomTypeParameter<Permission> 
  & PhantomTypeParameter<Something>;
```
앞선 구현에서는 모든 유령 타입 매개변수가 `_` 라는 더미 필드에 저장되기 때문에 여러 개의 유령 타입 매개변수를 정의하고자 한다면 골치아픈 문제가 발생합니다. 이는 각 유령 타입 매개변수를 정의할 때 고유한 식별자를 부여하게 하는 방법으로 해결할 수 있습니다.

```typescript
abstract class PhantomTypeParameter<Identifier extends string | number | symbol, InstantiatedType> {
  protected abstract _: {
    readonly [NameP in Identifier]: InstantiatedType;
  };
}

type Client<Permission, Something> =
  { name: string, level: number, gameMode: GameMode } 
  & PhantomTypeParameter<'Permission', Permission> 
  & PhantomTypeParameter<'Something', Something>;
```

마지막으로, 유령 타입 매개변수에 주어진 타입이 다른 유령 타입은 다르게 취급되어야 합니다. 즉, `Client<User>`와 `Client<User | Admin>`은 다른 타입으로 인식되어야 합니다. 이는 유령 타입 매개변수들이 [무공변적(invariant)](https://stackoverflow.com/questions/8481301/covariance-invariance-and-contravariance-explained-in-plain-english)이게 만듦으로써 만족시킬 수 있습니다.

```typescript
abstract class PhantomTypeParameter<Identifier extends string | number | symbol, InstantiatedType> {
  protected abstract _: {
    readonly [NameP in Identifier]: (_: InstantiatedType) => InstantiatedType;
  };
}
```

