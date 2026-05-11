'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const { parseAuthorizationHeader, requireBearerToken } = require('../src/auth')

describe('parseAuthorizationHeader', () => {
  it('accepts a valid Bearer token', () => {
    const result = parseAuthorizationHeader('Bearer abc123')
    assert.deepEqual(result, { ok: true, token: 'abc123' }, 'should return ok with token')
  })

  it('rejects a missing header (null)', () => {
    const result = parseAuthorizationHeader(null)
    assert.deepEqual(result, { ok: false, error: 'Missing authorization header' }, 'should reject null')
  })

  it('rejects a missing header (undefined)', () => {
    const result = parseAuthorizationHeader(undefined)
    assert.deepEqual(result, { ok: false, error: 'Missing authorization header' }, 'should reject undefined')
  })

  it('rejects an empty string', () => {
    const result = parseAuthorizationHeader('')
    assert.deepEqual(result, { ok: false, error: 'Missing authorization header' }, 'should reject empty string')
  })

  it('rejects a non-Bearer scheme', () => {
    const result = parseAuthorizationHeader('Basic abc123')
    assert.deepEqual(result, { ok: false, error: 'Malformed authorization header' }, 'should reject Basic scheme')
  })

  it('rejects a header with only the Bearer keyword and no token', () => {
    const result = parseAuthorizationHeader('Bearer ')
    assert.deepEqual(result, { ok: false, error: 'Missing bearer token' }, 'should reject missing token after Bearer')
  })

  it('accepts case-insensitive Bearer keyword', () => {
    const result = parseAuthorizationHeader('bearer abc123')
    assert.deepEqual(result, { ok: true, token: 'abc123' }, 'should accept lowercase bearer')
  })

  it('accepts BEARER in all caps', () => {
    const result = parseAuthorizationHeader('BEARER abc123')
    assert.deepEqual(result, { ok: true, token: 'abc123' }, 'should accept BEARER uppercase')
  })

  it('accepts Bearer with a tab separator', () => {
    const result = parseAuthorizationHeader('Bearer\tabc123')
    assert.deepEqual(result, { ok: true, token: 'abc123' }, 'should accept tab between Bearer and token')
  })

  it('accepts Bearer with double-space separator', () => {
    const result = parseAuthorizationHeader('Bearer  abc123')
    assert.deepEqual(result, { ok: true, token: 'abc123' }, 'should accept double space between Bearer and token')
  })

  it('preserves token casing exactly', () => {
    const result = parseAuthorizationHeader('Bearer MyToken_ABC123')
    assert.deepEqual(result, { ok: true, token: 'MyToken_ABC123' }, 'token casing must be preserved exactly')
  })
})

describe('requireBearerToken', () => {
  it('returns the token on valid header', () => {
    const token = requireBearerToken('Bearer abc123')
    assert.equal(token, 'abc123', 'should return the token string')
  })

  it('throws on missing header', () => {
    assert.throws(
      () => requireBearerToken(null),
      { message: 'Missing authorization header' },
      'should throw with missing header message'
    )
  })

  it('throws on malformed header', () => {
    assert.throws(
      () => requireBearerToken('Basic abc123'),
      { message: 'Malformed authorization header' },
      'should throw with malformed header message'
    )
  })

  it('throws on missing token', () => {
    assert.throws(
      () => requireBearerToken('Bearer '),
      { message: 'Missing bearer token' },
      'should throw with missing token message'
    )
  })
})
