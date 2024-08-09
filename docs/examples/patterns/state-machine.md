# State Machine

A [state machine](https://en.wikipedia.org/wiki/Finite-state_machine) is simply
system that exists in one of a number of states. That system changes states, it
"transitions", due to some input into the system, resulting in another state.

```prolog showLineNumbers
initialState(0).
input("add", 1).
input("subtract", 3).
input("multiply", 4).

state(Value) :- initialState(Value).

state(Value) :- state(InitialValue),
                input("add", ValueToAdd),
                Value = InitialValue + ValueToAdd.

state(Value) :- state(InitialValue),
                input("subtract", ValueToSubtract),
                Value = InitialValue - ValueToSubtract.

state(Value) :- state(InitialValue),
                input("multiply", ValueToMultiply),
                Value = InitialValue * ValueToMultiply.

@output("state").
```

The expected value is:

```
state(-8) 0 => (+ 1) => 1 => (- 3) => -2 => (* 4) => -8
```

### Finite State Machines

```prolog showLineNumbers
turnstile_is_locked(#T).
input("coin").

turnstile_is_locked(NextState) :- turnstile_is_locked(CurrentState),
                                  input(Input),
                                  Input = "coin",
                                  CurrentState = #T,
                                  NextState = #F.

turnstile_is_locked(NextState) :- turnstile_is_locked(CurrentState),
                                  input(Input),
                                  Input = "push",
                                  CurrentState = #F,
                                  NextState = #T.

@output("turnstile_is_locked").
```

The expected value is:

```

```
