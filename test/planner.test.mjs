import test from 'node:test';
import assert from 'node:assert/strict';
import {plannerFields,assessPlan} from '../public/planner.js';
const base=Object.fromEntries(plannerFields.map(([k,,,v])=>[k,v]));
test('planner reconciles cash flow and separates goals from reserves',()=>{const r=assessPlan(base);assert.equal(r.surplus,2500000);assert.equal(r.reserveGap,24000000);assert.equal(r.netWorth,75000000);assert.equal(r.debtRatio,15);assert.equal(r.goalGap,r.surplus-r.goalMonthly-r.retireMonthly);});
test('income shock changes available capacity and reserve runway',()=>{const r=assessPlan({...base,incomeShock:60});assert.ok(r.stress<0);assert.equal(r.stressRunway,base.liquid/-r.stress);assert.ok(assessPlan({...base,income:3000000}).surplus<0);});
test('zero return retirement and goal formulas handle limiting case',()=>{const r=assessPlan({...base,inflation:0,return:0});assert.equal(r.retireToday,4000000*25*12);assert.equal(r.goalMonthly,90000000/60);});
test('planner rejects double-counted funds, missing values and invalid horizons',()=>{assert.throws(()=>assessPlan({...base,assets:1}),/overlap/);assert.throws(()=>assessPlan({...base,income:NaN}));assert.throws(()=>assessPlan({...base,retireAge:20}));});
