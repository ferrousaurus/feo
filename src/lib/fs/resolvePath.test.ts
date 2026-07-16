import { describe, expect, it } from "bun:test";

import resolvePath from "./resolvePath";

describe("resolvePath", () => {
  it("returns a plain absolute path unchanged", () => {
    expect(resolvePath("/usr/local/bin")).toBe("/usr/local/bin");
  });

  it("expands ~ to $HOME", () => {
    process.env.HOME = "/home/user";
    expect(resolvePath("~/documents")).toBe("/home/user/documents");
  });

  it("expands ${VAR}", () => {
    process.env.PROJECT_ROOT = "/projects/feo";
    expect(resolvePath("${PROJECT_ROOT}/src")).toBe("/projects/feo/src");
  });

  it("replaces unset ${VAR} with empty string", () => {
    delete process.env.UNDEFINED_VAR;
    expect(resolvePath("${UNDEFINED_VAR}/fallback")).toBe("/fallback");
  });

  it("expands ${VAR-fallback} when VAR is unset", () => {
    delete process.env.MY_VAR;
    expect(resolvePath("${MY_VAR-/default}")).toBe("/default");
  });

  it("uses VAR when set even if empty with - syntax", () => {
    process.env.MY_VAR = "";
    expect(resolvePath("${MY_VAR-/default}")).toBe("");
  });

  it("expands ${VAR:-fallback} when VAR is unset", () => {
    delete process.env.MY_VAR;
    expect(resolvePath("${MY_VAR:-/default}")).toBe("/default");
  });

  it("uses fallback with :- syntax when VAR is empty", () => {
    process.env.MY_VAR = "";
    expect(resolvePath("${MY_VAR:-/default}")).toBe("/default");
  });

  it("uses VAR with :- syntax when VAR is non-empty", () => {
    process.env.MY_VAR = "/value";
    expect(resolvePath("${MY_VAR:-/default}")).toBe("/value");
  });

  it("expands ~ before interpolating other variables", () => {
    process.env.HOME = "/home/user";
    process.env.DIR = "projects";
    expect(resolvePath("~/${DIR}")).toBe("/home/user/projects");
  });

  it("handles multiple variable references", () => {
    process.env.BASE = "/base";
    process.env.SUB = "sub";
    expect(resolvePath("${BASE}/${SUB}/file")).toBe("/base/sub/file");
  });

  it("does not expand ~ in the middle of a path", () => {
    expect(resolvePath("/path/~test/file")).toBe("/path/~test/file");
  });
});
