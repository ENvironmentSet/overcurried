---
title: 전역 객체가 전역 객체인 이유  
date: 2020-01-18  
description: 시간의 흐름에 묻혀버린 이야기  
somethings: 1  
---

![오리너구리](./platypus.jpg)

오리너구리를 아시나요?
오리, 수달, 비버 등 여러 동물을 합쳐 놓은 듯한 혼란스러운 외형 뿐만 아니라 포유류이지만 알을 낳고, 젖이 유두 대신 유방에서 스며나온다는 특징 덕에 세상에서 가장 특이한 동물이라고 불리는 동물입니다.

자바스크립트에도 오리너구리 같이 특이한 걸로 둘째가라면 서러울 개념이 하나 있는데요, 바로 전역 객체(*global object*)입니다.

전역 객체는 정말 이상합니다:

1. `var` 문과 함수 선언문으로 정의한 전역 바인딩은 전부 전역 객체의 프로퍼티가 됩니다.
2. 반대로, 전역 객체의 모든 프로퍼티는 전역 바인딩처럼 취급됩니다.

값인 동시에 변수를 담는다니, 정말 특이한 객체가 따로 없습니다.
그런데 왜 이런 객체를 만들었을까요?
그 이유가 궁금하지 않으신가요?

아무도 말해주지 않던 뒷이야기, 지금부터 제가 알려드리도록 하겠습니다.

## 전역 객체의 잊혀진 배경

시간을 거슬러, 이야기는 자바스크립트의 초기 버전인 ES1에서 시작됩니다.

ES1에는 Variable Object라는 특별한 객체가 있었습니다.
이 객체는 각 스코프 마다 하나씩 생성되어 그 스코프에 해당하는 바인딩을 저장하는 용도로 사용되었었습니다.

```javascript
// Variable Object G: { a: 1, f: function f() ... }
var a = 1;

function f() {
  // Variable Object F: { x: 2 } 
  var x = 2;

  return a + x;
}
```

Variable Object는 개별적으로 사용되지는 않았고, 리스트에 담겨 참조 환경(*referencing environment*, a.k.a *scope chain*)을 구성하는 데 쓰였었습니다.

```javascript
// Variable Object G: { a: 1, f: function f() ... }
// Scope chain G_1 : [G]
var a = 1;

function f() {
  // Variable Object F: { x: 2 } 
  // Scope chain F_1 : [F, G]
  var x = 2;

  return a + x;
}
```

각 스코프 별로 생성되는 Variable Object는 조금씩 차이가 있었습니다.

| 스코프 | Variable Object | 동작의 차이 |
|------|-----------------|-----------|
| 전역 스코프 | 전역 객체(*Global Object*) | 구현체의 정의에 따라 다름 |
| 함수 스코프 | Activation Object | 객체에 반영되는 모든 바인딩은 삭제 불가능, `arguments` 프로퍼티를 가짐 |
| With 문 | 별도의 이름 없음 | 사용자의 정의에 따라 다름 |

익숙한 이름이 보이시나요? 전역 객체요!
전역 객체는 사실 전역 스코프의 Variable Object, 즉, 전역 스코프를 표현하기 위한 객체였던 겁니다!

이야기를 정리하자면, 자바스크립트의 초기 버전에서는 스코프를 Variable Object라고 불리는 객체를 통해 표현했었고, 그 중 전역 스코프를 나타내는 Variable Object를 전역 객체라고 불렀었다는 겁니다.
전역 객체 자체가 근본적으로 스코프를 나타내는 객체이기 때문에 바인딩들이 프로퍼티가 되고, 프로퍼티들이 바인딩처럼 취급받는 게 자연스러워 보였겠지요.

> **TMI**: 여담이지만, 객체로 스코프를 표현하던 시절이었기 때문에 지금은 이상하게만 보이는 with 문도 이때는 다른 언어의 블록 스코프에 해당되는 자연스러운 기능처럼 보였겠지요.

## ES5 에서의 변화

시간이 흘러, 이야기는 ES5의 등장과 함께 새 국면을 맞습니다.

수많은 사공들로 인해 산 속으로 영영 사라져 버린 ES4 이후, 새로이 만들어진 ES5는 수많은 레거시들을 해결해 자바스크립트의 현대화 작업의 기틀을 닦은 중요한 표준이었습니다.
이때의 레거시 해결 작업의 대상에는 스코프 체인도 있었고, Variable Object와 스코프 체인은 Environment Record와 Lexical Environment라는 개념으로 대체되었었지요.

하지만 전역 객체는 삭제되지도, 대체되지도 않았습니다.
이에 대한 공식적인 이유는 찾지 못했는데요, 저는 하위 호환성 때문이라고 생각합니다.
프로그래머가 직접 접근할 수 없었던 Activation Object와 달리 전역 객체는 표준, 비표준 가릴 거 없이 수많은 코드에서 접근하고 다룰 수 있었고 실제로도 다뤘었지요.
이런 전역 객체를 무작정 없애 버리면 잘 돌아가던 수많은 웹 사이트들이 고장날 게 뻔했기에 어쩔 수 없었던 것 같습니다.

이렇게, ES5의 변화로 전역 객체는 자신의 등장 배경을 잃게 되었고 결국 이상한 존재가 되고 말았습니다.

## 정리

지금까지가 제가 오늘 준비한 이야기의 전부입니다.
마지막으로 내용을 정리하고 글을 이만 마치도록 하겠습니다.
긴 글 읽어주셔서 감사합니다.

1. 자바스크립트의 초기 버전은 스코프를 Variable Object라는 객체를 통해 표현했었다.
2. 전역 객체는 전역 스코프를 나타내는 Variable Object 였다.
3. 이러한 배경에서 전역 객체의 특이한 동작은 스코프를 나타내는 객체로서 자연스러운 동작이였다.
4. 그러나 ES5에 올라오면서 스코프를 객체를 통해 표현하는 방식은 대체되었고, 하위 호환성 문제가 있는 전역 객체만 남게 되었다.
5. 이렇게 자신이 등장한 배경을 잃은 전역 객체는 이상한 존재가 되었다.

## 참고자료

- [ECMA-262, 1st edition](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%201st%20edition,%20June%201997.pdf) 
- [ECMA-262, 3rd edition](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf)
- [ECMA-262, 5th edition](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262%205th%20edition%20December%202009.pdf)