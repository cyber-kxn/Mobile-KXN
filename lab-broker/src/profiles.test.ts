import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROFILES, getProfile } from './profiles.js';

test('every lab profile enforces egress isolation', () => {
  for (const [id, p] of Object.entries(PROFILES)) {
    assert.ok(['none', 'internal'].includes(p.egress), `${id} must drop egress`);
    assert.ok(p.ttlSeconds > 0 && p.ttlSeconds <= 7200, `${id} TTL must be bounded`);
    assert.ok(p.maxPerUser >= 1, `${id} must define a quota`);
    assert.ok(p.nodes.length >= 1, `${id} must have nodes`);
  }
});

test('multi-node labs use the internal (internet-less) bridge', () => {
  for (const p of Object.values(PROFILES)) {
    if (p.nodes.length > 1) {
      assert.equal(p.egress, 'internal', `${p.id}: multi-node must use internal bridge`);
    }
  }
});

test('getProfile returns undefined for unknown ids', () => {
  assert.equal(getProfile('nope'), undefined);
  assert.ok(getProfile('lp-linux-single'));
});
