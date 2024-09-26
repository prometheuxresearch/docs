# State Machine

A [state machine](https://en.wikipedia.org/wiki/Finite-state_machine) is simply
system that exists in one of a number of states. That system changes states, it
"transitions", due to some input into the system, resulting in another state.

In order to model a state machine's transitions, you'll need to keep track of 
the time (or order) of the events, otherwise Prometheux will not know how
to apply the events in which order.

```prolog showLineNumbers
initialState(0, 42).
event(1, "add", 1).
event(2,"subtract", 3).
event(3, "multiply", 4).
event(4, "add", 6).

% As always, recursive rules always need a base case that's grounded in facts.
state(Time, Value) :- initialState(Time,Value).

state(Time, Value) :- state(InitialTime, InitialValue),
                      event(EventTime, "add", ValueToAdd),
                      Value = InitialValue + ValueToAdd,
                      EventTime = InitialTime + 1,
                      Time = EventTime.

state(Time, Value) :- state(InitialTime, InitialValue),
                      event(EventTime,"subtract", ValueToSubtract),
                      Value = InitialValue - ValueToSubtract,    
                      EventTime = InitialTime + 1
                      Time = EventTime.

state(Time, Value) :- state(InitialTime, InitialValue),
                      event(EventTime,"multiply", ValueToMultiply),
                      Value = InitialValue * ValueToMultiply,    
                      EventTime = InitialTime + 1
                      Time = EventTime.
@output("state").
```

The expected output set of facts is:

```
% state(Time, Value).
state(0, 42).
state(1, 43).
state(2, 40).
state(3, 160).
state(4, 166).
```
Note that the order of output states is not guaranteed.

:::warning
You may have noticed the addition of a variable alias `Time = EventTime`. This
is currently necessary because using a variable that exists in a body predicate
(`EventTime` on line 3) as both a filter (line 5) and as a variable in the head
(line 2) has unintended consequences.

To fix this, we simply add an alias to the head predicate (line 8), and assign
it the same value (line 12).
```prolog showLineNumbers {2,3,5,8,12}
% This does not work yet
state(EventTime,Value) :- state(InitialTime, InitialValue),
                          event(EventTime, "add", ValueToAdd),
                          Value = InitialValue + ValueToAdd,
                          EventTime == InitialTime + 1.

% Adding an alias on line 12 fixes this problem.
state(NextTime,Value) :- state(InitialTime, InitialValue),
                         input(EventTime, "add", ValueToAdd),
                         Value = InitialValue + ValueToAdd,
                         EventTime = InitialTime + 1,
                         NextTime = EventTime.
```
:::
