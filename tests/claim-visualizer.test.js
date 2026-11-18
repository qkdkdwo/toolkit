// 청구항 분해 로직 회귀 테스트: node tests/claim-visualizer.test.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '../tools/claim-visualizer/index.html'), 'utf8');
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const mod = { exports: {} };
new Function('module', core)(mod);
const { analyze } = mod.exports;

const sample = name => html.match(new RegExp('const ' + name + '=`([\\s\\S]*?)`;'))[1];
const names = c => c.elements.map(e => e.name);
let passed = 0;
const test = (title, fn) => { fn(); passed++; console.log('✓ ' + title); };

test('한국어: 청구항 분리와 인용관계', () => {
  const r = analyze(sample('SAMPLE_KO'));
  assert.strictEqual(r.lang, 'ko');
  assert.deepStrictEqual(r.claims.map(c => c.deps), [[], [1], [1, 2], []]);
});

test('한국어: 장치 독립항 구조 분해', () => {
  const c = analyze(sample('SAMPLE_KO')).claims[0];
  assert.strictEqual(c.trans, '를 포함하는');
  assert.strictEqual(c.end, '스테이플러.');
  assert.deepStrictEqual(names(c), ['베이스부', '매거진부', '푸셔부', '타출부', '앤빌부']);
  assert.deepStrictEqual(c.elements[4].refs, [1, 4]);
});

test('한국어: 방법 청구항 단계 이름', () => {
  const c = analyze(sample('SAMPLE_KO')).claims[3];
  assert.deepStrictEqual(names(c), ['장전 단계', '배치 단계', '타출 단계', '절곡 단계']);
});

test('영어: 구조 분해와 범위 인용', () => {
  const r = analyze(sample('SAMPLE_EN'));
  assert.strictEqual(r.lang, 'en');
  assert.strictEqual(r.claims[0].trans, 'comprising');
  assert.deepStrictEqual(names(r.claims[0]), ['base', 'magazine', 'pusher', 'driver', 'anvil']);
  assert.deepStrictEqual(r.claims[2].deps, [1, 2]);
  assert.deepStrictEqual(analyze('1. A device comprising a part.\n5. The device of claims 1 to 3, wherein the part is metal.').claims[1].deps, [1, 2, 3]);
});

test('일본어: 연결부와 구성요소', () => {
  const r = analyze('【請求項1】\n紙束を綴じるステープラであって、\n複数のステープルを収納するマガジン部と、\n前記マガジン部の上部に配置され、押圧時に前記ステープルを下方に射出する打出部と、\nを備えることを特徴とするステープラ。\n【請求項2】\n請求項1において、前記マガジン部は前記ステープルを付勢するばねを含むことを特徴とするステープラ。');
  assert.strictEqual(r.lang, 'ja');
  assert.deepStrictEqual(names(r.claims[0]), ['マガジン部', '打出部']);
  assert.deepStrictEqual(r.claims[0].elements[1].refs, [1]);
  assert.deepStrictEqual(r.claims[1].deps, [1]);
});

test('중국어: 연결부와 구성요소', () => {
  const r = analyze('权利要求1. 一种订书机，其特征在于，包括：\n钉匣，用于容纳多个订书钉；\n推钉器，设置在所述钉匣内，用于推动所述订书钉。\n权利要求2. 根据权利要求1所述的订书机，其特征在于，所述推钉器包括弹簧。');
  assert.strictEqual(r.lang, 'zh');
  assert.deepStrictEqual(names(r.claims[0]), ['钉匣', '推钉器']);
  assert.deepStrictEqual(r.claims[1].deps, [1]);
});

test('유형 주의: 정상 청구항에는 경고 없음', () => {
  const r = analyze(sample('SAMPLE_KO'));
  assert.deepStrictEqual(r.claims.map(c => c.warning), [null, null, null, null]);
  assert.deepStrictEqual(analyze(sample('SAMPLE_EN')).claims.map(c => c.warning), [null, null, null]);
});

test('유형 주의: 방법 표제인데 단계가 없음', () => {
  const c = analyze('【청구항 1】\n스테이플을 수납하는 매거진부;\n스테이플을 타출하는 타출부를 포함하는 스테이플링 방법.').claims[0];
  assert.ok(c.warning && c.warning.includes('방법'));
});

test('유형 주의: 장치 표제인데 단계로만 구성', () => {
  const c = analyze('1. A stapler, comprising:\nloading staples into a magazine;\ndriving a staple into a stack of paper.').claims[0];
  assert.ok(c.warning && c.warning.includes('장치'));
});

test('원문 불명확: 연결부를 찾지 못한 청구항', () => {
  const c = analyze('【청구항 1】\n매거진과 타출판으로 이루어진 스테이플러').claims[0];
  assert.strictEqual(c.unclear, true);
  assert.strictEqual(analyze(sample('SAMPLE_KO')).claims[0].unclear, false);
});

test('구성요소 기호: 청구항마다 a부터 시작', () => {
  const r = analyze(sample('SAMPLE_KO'));
  assert.deepStrictEqual(r.claims[0].elements.map(e => e.sym), ['a', 'b', 'c', 'd', 'e']);
  assert.deepStrictEqual(r.claims[3].elements.map(e => e.sym), ['a', 'b', 'c', 'd']);
  const many = analyze('1. A device comprising:\n' + Array.from({ length: 28 }, (_, i) => `a part${i}`).join(';\n') + '.');
  assert.deepStrictEqual(many.claims[0].elements.slice(25, 28).map(e => e.sym), ['z', 'aa', 'ab']);
});

console.log(`\n${passed}개 테스트 통과`);
