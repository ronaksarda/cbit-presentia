// TDD Automated Test Suite for Praesentia Domain Modules
import assert from 'node:assert'
import {
  calculateACT,
  calculateAAss,
  calculateAST,
  calculateTemplateATotal,
  validateFieldA,
} from './js/domain/templateA.js'
import {
  calculateWeeklyTotal,
  calculateLabCIEAggregate,
  validateFieldC,
} from './js/domain/templateC.js'

console.log('--- RUNNING PRAESENTIA TDD MODULE TESTS ---')

// 1. Template A Tests
assert.strictEqual(calculateACT(9.0, 3.0), 6.0, 'ACT of 9 and 3 must be 6')
assert.strictEqual(calculateACT(18.5, 19.0), 19.0, 'ACT of 18.5 and 19 must round to 19')
assert.strictEqual(calculateACT(5.5, null), 3.0, 'ACT with AB should treat AB as 0: 5.5/2 = 2.75 -> 3')

assert.strictEqual(calculateAAss(10, 10), 10, 'AAss of 10 and 10 must be 10')
assert.strictEqual(calculateAAss(8, 9), 8.5, 'AAss of 8 and 9 must be 8.5')

assert.strictEqual(calculateAST(null, 5.0, 4.5), 5.0, 'AST best 2 (5, 4.5) -> avg 4.75 -> 5')
assert.strictEqual(calculateAST(3.5, null, 4.5), 4.0, 'AST best 2 (4.5, 3.5) -> avg 4.0')
assert.strictEqual(calculateAST(4.5, 5.0, 4.5), 5.0, 'AST best 2 (5.0, 4.5) -> avg 4.75 -> 5')
assert.strictEqual(calculateAST(null, null, 4.5), 2, 'AST with 2 AB -> best 2 are (4.5, 0) -> 2.25 -> 2')

const row = { ct1: 9.0, ct2: 3.0, ass1: 10.0, ass2: 10.0, st1: null, st2: 5.0, st3: 4.5, att: 1.0 }
const totalA = calculateTemplateATotal(row)
assert.strictEqual(totalA.act, 6.0)
assert.strictEqual(totalA.aass, 10.0)
assert.strictEqual(totalA.ast, 5.0)
assert.strictEqual(totalA.att, 1.0)
assert.strictEqual(totalA.total, 22)

assert.strictEqual(validateFieldA('ct1', 25), 'Max 20')
assert.strictEqual(validateFieldA('ct1', 15), null)

// 2. Template C Tests
const labWeek = { pep: 4, exp: 8, pea: 3, rec: 5, cond: 5 }
assert.strictEqual(calculateWeeklyTotal(labWeek), 25, 'Lab week total should be 25')

const labIncomplete = { pep: 4, exp: null, pea: 3, rec: 5, cond: 5 }
assert.strictEqual(calculateWeeklyTotal(labIncomplete), null, 'Incomplete week must be null')

const allWeeks = [
  { pep: 4, exp: 8, pea: 3, rec: 5, cond: 5 }, // 25
  { pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 }, // 27
  { pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 }, // 27
  { pep: 4, exp: 8, pea: 5, rec: 5, cond: 5 }, // 27
]
assert.strictEqual(calculateLabCIEAggregate(allWeeks), 26.5)

assert.strictEqual(validateFieldC('pep', 7), 'Max 5')
assert.strictEqual(validateFieldC('exp', 12), 'Max 10')

console.log('✓ ALL PRAESENTIA TDD MODULE TESTS PASSED!')
