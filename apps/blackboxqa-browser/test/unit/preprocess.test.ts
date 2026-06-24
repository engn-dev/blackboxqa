import { describe, expect, it } from "vitest";
import { preprocessArgs } from "../../src/commands/preprocess.js";

describe("preprocessArgs (--connect optional value)", () => {
  it("passes through when no flags present", () => {
    expect(
      preprocessArgs(["node", "blackboxqa-browser", "run", "x.js"])
    ).toEqual(["node", "blackboxqa-browser", "run", "x.js"]);
  });

  it("leaves bare --connect alone at end of argv", () => {
    expect(preprocessArgs(["node", "blackboxqa-browser", "--connect"])).toEqual(
      ["node", "blackboxqa-browser", "--connect"]
    );
  });

  it("splices --connect URL into --connect=URL", () => {
    expect(
      preprocessArgs([
        "node",
        "blackboxqa-browser",
        "--connect",
        "http://localhost:9222",
      ])
    ).toEqual([
      "node",
      "blackboxqa-browser",
      "--connect=http://localhost:9222",
    ]);
  });

  it("leaves bare --connect alone when next arg starts with -", () => {
    expect(
      preprocessArgs(["node", "blackboxqa-browser", "--connect", "--headless"])
    ).toEqual(["node", "blackboxqa-browser", "--connect", "--headless"]);
  });

  it("consumes a following subcommand name as the value (lexical-only rule)", () => {
    expect(
      preprocessArgs(["node", "blackboxqa-browser", "--connect", "run", "x.js"])
    ).toEqual(["node", "blackboxqa-browser", "--connect=run", "x.js"]);
  });

  it("only splices the first --connect", () => {
    expect(
      preprocessArgs([
        "node",
        "blackboxqa-browser",
        "--connect",
        "first",
        "--connect",
        "second",
      ])
    ).toEqual([
      "node",
      "blackboxqa-browser",
      "--connect=first",
      "--connect=second",
    ]);
  });

  it("returns shorter slices unchanged", () => {
    expect(preprocessArgs([])).toEqual([]);
    expect(preprocessArgs(["node"])).toEqual(["node"]);
  });
});
