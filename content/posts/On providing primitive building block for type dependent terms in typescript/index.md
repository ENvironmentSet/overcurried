---
title: On providing primitive building block for type dependent terms in typescript 
date: 2022-01-02  
description: 타입에 의존하는 코드를 만드는 또 하나의 방법을 소개합니다.  
somethings: 1  
keywords: 타입스크립트, typescript, ts-transformer-typerep
---

타입스크립트는 자바스크립트에 정적 타입 검사를 추가한 프로그래밍 언어입니다. 자바스크립트 프로그램을 개발할 때 오류를 미리 파악할 수 없다는 점은 대형 프로젝트에서 큰 문제점으로 작용하였고, 이를 해결하기 위해 마이크로소프트 사에서는 타입스크립트를 만들었습니다.

타입스크립트는 자바스크립트와의 호환을 추구하기 때문에 자바스크립트에서 작성할 수 없는 유형의 코드는 타입스크립트에서도 작성할 수 없게 하는 것을 기본 방침으로 삼고 있습니다. 따라서 타입스크립트의 **타입에만 의존**하여 동작이 결정되는 코드는 타입스크립트에서 작성될 수 없습니다.

```typescript
function literalTypeToValue<N extends number | string | boolean | null | undefined>(): N {
  return // 무엇을 반환해야 할까요?
}
```

함수 오버로딩 기능을 사용하면 비슷하게나마 처리할 수 있으나 인코딩하는 과정에서 코드가 번잡해져 가독성이 낮아지고 이 방법으로도 해결할 수 없는 경우가 존재한다는 문제점이 있습니다.

```typescript
function literalTypeToValue<T extends number>(value: T): T
function literalTypeToValue<T extends string>(value: T): T
function literalTypeToValue<T extends boolean>(value: T): T
// 비슷한 코드가 이어집니다.
function literalTypeToValue(value: any): any {
  switch(typeof value) {
    case 'number':
      return value;
    case 'string':
    // 비슷한 코드가 이어집니다.
  }
}

function keys<N>(): string[] {
  return // 무엇을 반환해야 할까요?
}
```

이런 문제 상황에서 타입스크립트 커뮤니티는 크게 세 가지 해결책을 제시합니다.
- [컴파일러 확장으로 구현하기](https://github.com/kimamula/ts-transformer-keys)
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)와 [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)를 사용하여 구현하기
- 포기하고 다른 방식으로 구현하기


첫 번째 방법은 문서화도 거의 되어있지 않은 타입스크립트 컴파일러를 공부해야 하며, 프로그래머가 컴파일러를 다룰 줄 알아야 하기에 **비용** 면에서 부담스러운 방법입니다. 한편, 두 번째 방법은 이론적 배경을 요구하지 않는다는 점에서 프로그래머가 접근하기에 더 쉽다고 평가할 수는 있으나, 데코레이터를 사용해야 한다는 형식적 제약을 비롯해, 타입 변수는 다룰 수 없다는 기능적 제약까지 **여러 제약**이 적극적인 활용을 방해하기에 특수한 몇몇 경우를 제외하고는 사용하기 어려운 방법입니다. 이런 현실적인 문제점들과, 타입스크립트에서 타입에만 의존하는 코드를 권장하지 않는다는 점이 맞물려 프로그래머들은 보통 세 번째 해결책, ‘포기하기’를 택합니다. 포기가 옳은 선택일 수도 있지만, 타입에 의존하는 코드를 사용하는 게 더 직관적인 방법인 경우도 있기에 이런 경우를 볼 때면 아쉬웠습니다.

저는 이런 문제 상황에서 고려할 수 있는 [네 번째 옵션](https://github.com/ENvironmentSet/ts-transfromer-typerep)을 만들어 보았습니다. 타입을 값 표현으로 변환하는 `typeRep` 함수를 사용해 타입에 의존하는 코드를 만드는 방법입니다. 컴파일러 확장을 통해 구현된다는 점에서 첫 번째 옵션과 유사하지만, 사용자는 컴파일러 확장에 대해 몰라도 된다는 점에서 차이점이 있습니다. 더하여, 여타 다른 해결책들은 타입 변수를 다룰 수 없었지만 새로운 네 번째 옵션은 **타입 변수까지 처리**할 수 있기에 확장성이 더 뛰어나다고 할 수 있습니다.

기본 아이디어는 간단합니다. 구체적인 타입(다형적이지 않은 타입, monomorphic type)의 경우에는 타입의 전체 형태가 주어져 있어 바로바로 변환하면 그만입니다. 까다로운 부분은 타입 변수와 타입 변수를 포함하는 타입(다형적인 타입, polymorphic type)을 표현하는 일인데, 이 경우에는 타입의 구체적인 형태가 없어 값으로 나타내기 상당히 난감합니다. 저는 이 문제를 **변환을 지연**시키는 방법으로 해결했습니다. 타입스크립트에서는 타입 레벨 자유 변수가 전부 구체적인 타입으로 치환된다는 점에서 착안해 그 자유 변수들을 실제(값-레벨의) 변수로 모델링하고 그 변수들이 결정되는 지점에서 값 표현으로 변환해 이를 끌어모아 다형적인 타입을 계산하였습니다.

```typescript
function keys<T>(): string[] {
  const type = typeRep<T>();

  if (type.kind === TypeKind.Object) return type.properties.map(([key]) => key);
  else return [];
}

keys<{ x: 1, y: 2, z: 3 }>();
```

```javascript
function keys(_typeRep_typeParameter_T) {
  var type = _typeRep_typeParameter_T;
  if (type.kind === ts_transformer_typerep_1.TypeKind.Object)
    return type.properties.map(function (_a) {
      var key = _a[0];
      return key;
    });
  else
    return [];
}

keys({ returnType: void 0, parameters: [], parts: void 0, properties: [["x", { returnType: void 0, parameters: [], parts: void 0, properties: void 0, literal: 1, kind: 1 }], ["y", { returnType: void 0, parameters: [], parts: void 0, properties: void 0, literal: 2, kind: 1 }], ["z", { returnType: void 0, parameters: [], parts: void 0, properties: void 0, literal: 3, kind: 1 }]], literal: void 0, kind: 14 });
```

ts-transformer-typerep은 개발 단계에 있습니다. 아직 지원하지 않는 타입도 존재하며, 충분한 테스트를 거치지 않아 실무 프로젝트에서 사용하기에는 부적절합니다. 하지만 완성된다면, 그리고 검증받는다면 다양한 문제 사례를 해결할 수 있을 거라 생각합니다.