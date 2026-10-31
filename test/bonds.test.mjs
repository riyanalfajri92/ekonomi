import test from 'node:test';import assert from 'node:assert/strict';import {bondPrice,assessBond} from '../public/bonds.js';
const v={face:10000000,price:98,coupon:6,frequency:2,periods:10,required:7,fee:0.1};
test('bond at coupon-equivalent yield prices at par',()=>assert.ok(Math.abs(bondPrice(6,6,10,2).pv-100)<1e-10));
test('discount is not automatically below required-return PV',()=>{const r=assessBond(v);assert.ok(r.fair<98);assert.ok(r.margin<0);assert.ok(r.up<r.fair&&r.down>r.fair);assert.ok(r.ytm>6&&r.ytm<7);});
test('zero yield sums cash flows; purchase fee reduces YTM',()=>{assert.equal(bondPrice(6,0,10,2).pv,130);assert.ok(assessBond(v).ytm<assessBond({...v,fee:0}).ytm);assert.throws(()=>assessBond({...v,frequency:3}));});
