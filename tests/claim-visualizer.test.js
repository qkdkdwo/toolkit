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
  assert.strictEqual(c.end, '웨어러블 체온 측정 장치.');
  assert.deepStrictEqual(names(c), ['온도 센서부', '신호 처리부', '통신부', '전원부']);
  assert.deepStrictEqual(c.elements[3].refs, [1, 2, 3]);
});

test('한국어: 방법 청구항 단계 이름', () => {
  const c = analyze(sample('SAMPLE_KO')).claims[3];
  assert.deepStrictEqual(names(c), ['감지 단계', '변환 단계', '송신 단계']);
});

test('영어: 구조 분해와 범위 인용', () => {
  const r = analyze(sample('SAMPLE_EN'));
  assert.strictEqual(r.lang, 'en');
  assert.strictEqual(r.claims[0].trans, 'comprising');
  assert.deepStrictEqual(names(r.claims[0]), ['temperature sensor', 'signal processor', 'communication unit', 'power supply']);
  assert.deepStrictEqual(r.claims[2].deps, [1, 2]);
  assert.deepStrictEqual(analyze('1. A device comprising a part.\n5. The device of claims 1 to 3, wherein the part is metal.').claims[1].deps, [1, 2, 3]);
});

test('일본어: 연결부와 구성요소', () => {
  const r = analyze('【請求項1】\nユーザの体温を測定する装置であって、\n皮膚に接触して温度を検知する温度センサ部と、\n前記温度センサ部から受信した信号を変換する信号処理部と、\nを備えることを特徴とする体温測定装置。\n【請求項2】\n請求項1において、前記温度センサ部は複数のサーミスタを含むことを特徴とする体温測定装置。');
  assert.strictEqual(r.lang, 'ja');
  assert.deepStrictEqual(names(r.claims[0]), ['温度センサ部', '信号処理部']);
  assert.deepStrictEqual(r.claims[1].deps, [1]);
});

test('중국어: 연결부와 구성요소', () => {
  const r = analyze('权利要求1. 一种体温测量装置，其特征在于，包括：\n温度传感器，用于感测温度；\n信号处理器，与所述温度传感器连接，用于转换信号。\n权利要求2. 根据权利要求1所述的装置，其特征在于，所述温度传感器包括多个热敏电阻。');
  assert.strictEqual(r.lang, 'zh');
  assert.deepStrictEqual(names(r.claims[0]), ['温度传感器', '信号处理器']);
  assert.deepStrictEqual(r.claims[1].deps, [1]);
});

console.log(`\n${passed}개 테스트 통과`);
