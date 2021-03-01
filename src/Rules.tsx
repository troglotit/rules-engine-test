import * as React from "react";

import "./Rules.css";

interface Inputs {
  A: boolean;
  B: boolean;
  C: boolean;
  D: number;
  E: number;
  F: number;
  rule: RulesEnum;
}

enum RulesEnum {
  Base = "BASE",
  Custom1 = "CUSTOM_1",
  Custom2 = "CUSTOM_2",
}

export function Rules() {
  const [inputs, setInputs] = React.useState({
    A: false,
    B: false,
    C: false,
    D: 0,
    E: 0,
    F: 0,
    rule: RulesEnum.Base,
  });

  const { H, K } = calculate(inputs);

  return (
    <div className="Rules-root">
      <div>
        A:
        <Input
          value={inputs.A}
          onChange={(value) => setInputs((prev) => ({ ...prev, A: value }))}
        />
      </div>
      <div>
        B:
        <Input
          value={inputs.B}
          onChange={(value) => setInputs((prev) => ({ ...prev, B: value }))}
        />
      </div>
      <div>
        C:
        <Input
          value={inputs.C}
          onChange={(value) => setInputs((prev) => ({ ...prev, C: value }))}
        />
      </div>
      <div>
        D:
        <Input
          value={inputs.D}
          onChange={(value) => setInputs((prev) => ({ ...prev, D: value }))}
        />
        E:
        <Input
          value={inputs.E}
          onChange={(value) => setInputs((prev) => ({ ...prev, E: value }))}
        />
        F:
        <Input
          value={inputs.F}
          onChange={(value) => setInputs((prev) => ({ ...prev, F: value }))}
        />
        Rules:
        <select
          value={inputs.rule}
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              rule: e.target.value as any,
            }))
          }
        >
          <option value={RulesEnum.Base} label={RulesEnum.Base} />
          <option value={RulesEnum.Custom1} label={RulesEnum.Custom1} />
          <option value={RulesEnum.Custom2} label={RulesEnum.Custom2} />
        </select>
        <div></div>
        H: {H != null ? H : "error"}
        <br />
        K: {K != null ? K : "error"}
      </div>
    </div>
  );
}

function Input<T extends boolean | number>(props: {
  value: T;
  onChange: (a: T) => void;
}) {
  return (
    <div>
      {typeof props.value === "boolean" ? (
        <input
          type="checkbox"
          checked={props.value}
          onChange={(e) => props.onChange(e.target.checked as T)}
        />
      ) : (
        <input
          type="number"
          value={(props.value as unknown) as number}
          onChange={(e) => props.onChange(e.target.valueAsNumber as T)}
        />
      )}
    </div>
  );
}

enum H {
  M = "M",
  P = "P",
  T = "T",
}

const base: RulesTable = [
  [
    // A, B, C, H=
    [true, true, false, H.M],
    [true, true, true, H.P],
    [false, true, true, H.T],
  ],
  [
    // H, K=
    [H.M, (i: Inputs) => i.D + (i.D * i.E) / 10],
    [H.P, (i: Inputs) => i.D + (i.D * (i.E - i.F)) / 25.5],
    [H.T, (i: Inputs) => i.D + (i.D * i.D) / 30],
  ],
];

const custom1: RulesTable = [
  [
    // A, B, C, H=
  ],
  [
    // H, K=
    [H.P, (i: Inputs) => 2 * i.D + (i.D * i.E) / 100],
  ],
];

const custom2: RulesTable = [
  [
    // A, B, C, H=
    [true, true, false, H.T],
    [true, false, true, H.M],
  ],
  [
    // H, K=
    [H.M, (i: Inputs) => i.F + i.D + (i.D * i.E) / 100],
  ],
];

type RulesTable = [
  [boolean, boolean, boolean, H][],
  [H, (i: Inputs) => number][]
];

function calculate(inputs: Inputs) {
  let H: H | undefined;
  let K: number | undefined;

  let rules = base;
  if (inputs.rule !== RulesEnum.Base) {
    rules = [
      [
        ...(inputs.rule === RulesEnum.Custom1 ? custom1[0] : custom2[0]),
        ...rules[0],
      ],
      [
        ...(inputs.rule === RulesEnum.Custom1 ? custom1[1] : custom2[1]),
        ...rules[1],
      ],
    ];
  }

  for (let rule of rules[0]) {
    if (rule[0] === inputs.A && rule[1] === inputs.B && rule[2] === inputs.C) {
      H = rule[3];
      break;
    }
  }

  for (let rule of rules[1]) {
    if (H === rule[0]) {
      K = rule[1](inputs);
      break;
    }
  }

  return { H, K };
}
