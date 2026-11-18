# Patent Analysis Toolkit

[![tests](https://github.com/qkdkdwo/toolkit/actions/workflows/test.yml/badge.svg)](https://github.com/qkdkdwo/toolkit/actions/workflows/test.yml)

특허 조사·분석 실무에서 반복해서 쓰는 도구, 프롬프트, 방법론을 모아 두는 저장소입니다.
모든 예시 데이터는 직접 만든 가상 청구항이거나 공개 특허를 바탕으로 하며, 고객사 정보나 상용 DB 원데이터는 포함하지 않습니다.

첫 화면: https://qkdkdwo.github.io/toolkit/

> **English summary** — A toolkit of browser-based tools, prompts and methodology notes for patent search and analysis work (claim decomposition, classification, landscape analysis). All sample data is synthetic or from public patents.

## 구성

| 폴더 | 내용 | 상태 |
|---|---|---|
| `tools/claim-visualizer/` | 청구항 분해·시각화 도구 (HTML 한 파일, 설치 불필요) | 공개 |
| `tests/` | 도구의 분해 결과를 확인하는 회귀 테스트 | 공개 |
| `prompts/claim-component-analyzer/` | 청구항 구성요소 분석기 프롬프트 (Claude·ChatGPT 공용) | 공개 |
| `prompts/core-patent-claim-analyzer/` | 핵심특허 청구항 분석기 프롬프트 + HTML 템플릿 | 공개 |
| `prompts/` (그 외) | 테크트리, 검색식, 노이즈 제거, 등급분류, 선행기술조사 프롬프트 | 준비 중 |
| `docs/claim-analysis-standard.md` | 청구항 분석 공통 기준 (도구와 프롬프트가 함께 따름) | 공개 |
| `docs/analysis-principles.md` | 특허 분석 공통 원칙 (사실과 근거, IPC/CPC·검색 키워드, 선행기술 대비, Excel 요약, 검증) | 공개 |

## 청구항 분해·시각화 도구

- 온라인 데모: https://qkdkdwo.github.io/toolkit/tools/claim-visualizer/
- 로컬 사용: `tools/claim-visualizer/index.html` 파일을 내려받아 브라우저로 열면 됩니다.
- 입력한 청구항은 브라우저 안에서만 처리되며 외부로 전송되지 않습니다.

자세한 기능은 [도구 README](tools/claim-visualizer/README.md)를 참고하세요.

## 테스트

```bash
node tests/claim-visualizer.test.js
```

`main` 브랜치에 올리거나 Pull Request를 만들 때마다 GitHub Actions가 이 테스트를 자동으로 실행합니다.

## 라이선스

[MIT License](LICENSE)
