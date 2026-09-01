import assert from "node:assert/strict";
import test from "node:test";
import { canAccess } from "./permissions";
import { waLink } from "./media";

test("admin can open every module", () => {
  assert.equal(canAccess("ADMIN", "/users"), true);
  assert.equal(canAccess("ADMIN", "/cash"), true);
});

test("technician cannot open accounting or users", () => {
  assert.equal(canAccess("TECHNICIAN", "/work-orders"), true);
  assert.equal(canAccess("TECHNICIAN", "/users"), false);
  assert.equal(canAccess("TECHNICIAN", "/invoices"), false);
});

test("reception cannot open purchases", () => {
  assert.equal(canAccess("RECEPTION", "/reception"), true);
  assert.equal(canAccess("RECEPTION", "/purchases"), false);
});

test("store can open inventory but not invoices", () => {
  assert.equal(canAccess("STORE", "/inventory"), true);
  assert.equal(canAccess("STORE", "/invoices"), false);
});

test("whatsapp link normalizes jordanian mobiles", () => {
  assert.equal(waLink("0790001001", "hello"), "https://wa.me/962790001001?text=hello");
});
