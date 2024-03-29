---
title: 함수가 아닌 것을 함수로 만드는 방법  
date: 2022-04-10  
description: 모나드는 면죄부가 아닙니다. 무언가에 '모나드'라는 이름을 붙인다고 그것이 순수해지는 건 아니에요.  
somethings: 3  
keywords: 모나드, monads, 함수형 프로그래밍, functional programming, 하스켈, haskell
---

table of contents

- 함수란? (pl 함수는 진정한 함수가 아니라는 이야기 들었을 것, 그럼 무엇이 함수?)
- 프로그래밍에서의 함수 
- computational effects
- side effect / non-side effect (visibility)
- 함수를 함수로 만들기 (쉬운 버전)
- 문제: 이전같지 않다. ^ 합성의 어려움 
- 합성할 수 있게 만드는 방법 - 모나드가 되어라 / kleisli? ~ effect 표현 타입?
- 왜 이 고생? : 함수형 프로그래밍
- 읽을거리 (ae, monad 논문, 다른 내 글, 모나드의 합성성)

> "프로그래밍의 함수는 진정한 함수가 아니다."

프로그래밍의 함수는 수학적 함수가 아니라는 이야기, 한 번쯤은 들어보신 기억이 있으실 겁니다.
그럼 무엇이 진정한 함수일까요?

## 함수

어떤 집합의 각 원소를 다른 집합의 유일한 원소에 대응시키는 관계를 두고 우리는 '함수'라 부릅니다.
