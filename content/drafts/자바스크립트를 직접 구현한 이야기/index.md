---
title: 자바스크립트를 직접 구현한 이야기  
date: 2021-12-24  
description: 그래서... 모나드가 뭔지 알고 싶으시다고요?  
somethings: 1  
keywords: 자바스크립트, javascript, 타입스크립트, typescript, 개발기, 인터프리터, interpreter
---

# 자바스크립트로 자바스크립트를 구현한 이야기

우공이산(愚公移山)이라는 한자성어가 있습니다. 산을 욺기기 위해 돌자루를 나르던 노인이 마을 사람들의 비아냥에도 불구하고 끊임없이 노력한 결과, 정말로 산을 욺기고 말았다는 이야기에서 비롯된 한자성어지요.

살다 보면, 그런 사람들이 종종 보입니다. 자신만의 꿈을 안고 가시밭길을 달리는 사람들이요. 다른 사람들이 모두 의미 없는 일이다, 말도 안 되는 일이다, 그게 될 거라고 생각하느냐며 말려도 멈추지 않고 도전하는 사람들이요. 하늘을 나는 꿈을 갖고 비행기를 만든 사람, 자동차에 빠져 직접 자동차를 제작한 사람, 그리고 우주에 인류를 보내고자 로켓을 만든 사람이요.

한 사람의 프로그래머로서, 그리고 프로그래밍 언어론을 좋아하는 한 학도로서, 3년 전에 저는 어찌 생각하면 매우 무의미할 수도 있는 하나의 프로젝트를 시작했습니다. 오늘은 이 프로젝트에 대한 이야기를 풀어 보고자 합니다.

## 학생, 자바스크립트를 만나다

제가 처음으로 공부한 프로그래밍 언어는 자바스크립트입니다. 제게 있어서는 뜻하지 않은 시작이었는데요, 사실 저는 자바를 공부하고자 했었습니다. 그래서 서점에 가 자바 입문 서적을 구입하고자 했었지요. 그런데 거기서 실수로 자바스크립트 서적을 사버리고 만 겁니다. 자바로 착각하고서는요.

이 일을 생각할 때면 운명이라는 게 실제로 있는 건가 싶기도 합니다. 우연히 만난 이 언어는 그 뒤로 지금까지 7년간 제 주 언어로, 컴퓨터 세상에서의 모국어로 기능해 주었으니까요. 누군가에게는 이상한 동작으로 힐난의 대상이기도 하지만, 미운 정 고운 정 다 들어버린 지금의 저에게는 이제 인생의 반려처럼 느껴지는 언어입니다.

그래서 결심했습니다. 자바스크립트를 자바스크립트로 구현해보기로. 분명 성장한 제 실력을 확인하고 제 자신을 한계까지 밀어붙여 더 크게 성장하고자 하는 마음도 있었지만, 모든 것의 중심에는 제 프로그래밍 인생의 반려인 이 언어에 대한 헌정의 의미가 있었습니다. 이 프로젝트는 저만의, 프로그래밍 판 「엘리제를 위하여」 였습니다.

## 프로젝트 목표

프로젝트를 본격적으로 시작하기 앞서, 저는 몇 가지 세부 목표를 설정하고 시작했습니다. 목표가 명확한 사람은 어떤 혼란 속에서도 길을 잃지 않으니까요.

- 타입스크립트만 사용하여 개발을 진행한다.
- 프로그램은 타입이 잘 주어져야(well-typed) 한다.
- 순수 함수형 프로그래밍에서 벗어난 방식을 사용하지 않는다.
- 함수형 프로그래밍에 필요한 유틸리티 함수들을 제외한 나머지 언어 구현에 필요한 모든 것은 직접 개발하여 사용한다.

### 타입스크립트만 사용하여 개발을 진행한다

타입스크립트는 자바스크립트에 정적 타입 검사 기능을 추가한 언어로, 마땅히 자바스크립트의 한 형태로 취급받을 수 있는 언어입니다. 그렇기에 저는 타입스크립트를 사용하는 것이 자바스크립트로 자바스크립트를 개발한다는 프로젝트의 목표에서 벗어나지 않는다고 생각하고 타입스크립트의 여러 이점을 활용하기 위해 타입스크립트를 사용하기로 결정했습니다.

### 프로그램은 타입이 잘 주어져야 한다

타입 시스템이 프로그래머에게 제시하는 제약은 절대 개발을 방해하는 요소가 아니라는 점을 보이기 위해, 충분히 표현력이 뛰어난 타입 시스템이 주어지면 타이핑하지 못할 프로그램은 없다는 것을 보이기 위해 이러한 목표를 설정했습니다.

### 순수 함수형 프로그래밍에서 벗어난 방식을 사용하지 않는다

함수형 프로그래밍의 팬으로서, 함수형 프로그래밍이 마냥 이론적이기만 한 접근 방법이, 비생산적인 접근 방법이 아니라는 점을 보이고 싶어 이런 목표를 설정했습니다.

### 함수형 프로그래밍에 필요한 유틸리티 함수들을 제외한 나머지 언어 구현에 필요한 모든 것은 직접 개발하여 사용한다

자동차를 재발명하는데, 바퀴를 가져다 쓸 수는 없는 노릇이지요. 처음부터 개발하는 것이 무의미한 함수형 프로그래밍 라이브러리를 제외한 나머지 모든 요소는 제가 직접 코드를 작성했습니다.

## 프로그램 구조

과거에 몇 번 인터프리터를 만들어 본 경험이 있기에 보다 수월하게 만들 수 있으리라 생각하여 이번 프로젝트에도 인터프리터 구조를 채택했습니다.

[]

## 어휘 분석 모듈: Lexer

[]

소재:
- Automata: not to use regexp + why not parser combinator…
- Automata: Automata class
- Automata: Two kinds of impl
- Automata: State/Transition -> Phantom type for trace/verification
- Automata: Class ADT -> fp-ts (thoughts on adt impl)
- Automata: transitionPredicateConstructors
- Automata: Automata Algebra(forgotton idea)
- Automata: AnyAutomata - Existential types
- Automata: String to automata for productivity
- Token: Token classification/def
- Token: Name mistake
- LexemeRecognizer: Recognizers…
- LexemeRecognizer: TokenConstructorTable
- Tokenize: Functional madness
- Tokenize: ((->) r) monad (thougths on railroad, branched)

## 구문 분석 모듈: Parser

- AST: AST Def, ADT in original passion.
- AST: -Only suffix, my mistake.
- TokenState/Parser, etc..: A Special Monad / Pusedo-parser-combinator
- Parsers: Power of monad
- Parsers: Debugging hell // error message for dev
- Parsers: Need do notations

## 해석 모듈: NaiveEvaluator

- Type: Designing types (Thoughts)
- Type: Desigining objects/refs
- Runtime/Type: Mistake-Spec types
- Runtime: Designing runtime monad(dsl, cont, monad, context, object handle, minimal.. etc)
- Evaluators: …
- Eval: Fn mistake(context(
- compile: behind name and mental model
- Error hell

## Futher works
- Full impl(syntax, feat)
- Version up
- opt
- Static analysis
- Compiler (Runtime-to or other eval dsl)

## Annex: Utilities
- Structure
- immutable obj(record) handle (variance… )

## 결론
만들면서 배운 것들. 과정이 중요. 성장.
> Shoot for the moon if you miss you'll land among the stars.

----
[프로젝트의 소스 코드는 이 링크에서 확인할 수 있습니다.]