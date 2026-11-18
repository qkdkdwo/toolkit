# Patent Analysis Toolkit

특허 조사·분석 실무에서 반복해서 쓰는 도구, 프롬프트, 방법론을 모아 두는 저장소입니다.
모든 예시 데이터는 직접 만든 가상 청구항이거나 공개 특허를 바탕으로 하며, 고객사 정보나 상용 DB 원데이터는 포함하지 않습니다.

> **English summary** — A toolkit of browser-based tools, prompts and methodology notes for patent search and analysis work (claim decomposition, classification, landscape analysis). All sample data is synthetic or from public patents.

## 구성

| 폴더 | 내용 | 상태 |
|---|---|---|
| `tools/claim-visualizer/` | 청구항 분해·시각화 도구 (HTML 한 파일, 설치 불필요) | 공개 |
| `tests/` | 도구의 분해 결과를 확인하는 회귀 테스트 | 공개 |
| `prompts/` | 특허 분석 단계별 프롬프트 (테크트리, 검색식, 노이즈 제거, 등급분류, 청구항 분석, 선행기술조사) | 준비 중 |
| `docs/` | 분석 원칙, IPC/CPC·검색 키워드 설계, 선행기술 대비표 작성 기준 | 준비 중 |

## 청구항 분해·시각화 도구

- 온라인 데모: https://qkdkdwo.github.io/toolkit/tools/claim-visualizer/
- 로컬 사용: `tools/claim-visualizer/index.html` 파일을 내려받아 브라우저로 열면 됩니다.
- 입력한 청구항은 브라우저 안에서만 처리되며 외부로 전송되지 않습니다.

자세한 기능은 [도구 README](tools/claim-visualizer/README.md)를 참고하세요.

## 테스트

```bash
node tests/claim-visualizer.test.js
```

## 라이선스

[MIT License](LICENSE)
