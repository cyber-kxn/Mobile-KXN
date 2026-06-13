import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashAnswer, checkAnswer } from './content.js';

test('hashAnswer is salted, deterministic, and not reversible plaintext', () => {
  const h = hashAnswer('NETHEX{demo}');
  assert.match(h, /^sha256:[0-9a-f]{64}$/);
  assert.equal(h, hashAnswer('  nethex{demo}  '), 'normalizes case + whitespace');
  assert.notEqual(h, hashAnswer('NETHEX{other}'));
});

test('checkAnswer falls back to mock acceptance for unseeded flags', () => {
  const res = checkAnswer('r-unknown', 'q1', 'something');
  assert.equal(res.known, false);
  assert.equal(res.correct, true);
  assert.equal(checkAnswer('r-unknown', 'q1', 'x').correct, false, 'rejects trivial input');
});
