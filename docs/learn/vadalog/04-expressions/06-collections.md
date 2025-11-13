---
slug: /learn/vadalog/expressions/collections
---

# Collections

Manipulate arrays and maps efficiently in Vadalog programs.

## Array Operations

```prolog
collections:size(arr: array<any>) → int                     % Get array size
collections:contains(arr: array<any>, value: any) → boolean % Check if contains
collections:contains_all(arr: array<any>, subset: array<any>) → boolean % Check subset
collections:add(arr: array<T>, elem: T) → array<T>          % Add element
collections:remove(arr: array<T>, elem: T) → array<T>       % Remove element
collections:get(arr: array<T>, index: int) → T              % Get by index (1-based)
```

## Set Operations on Arrays

```prolog
collections:union(a: array<T>, b: array<T>) → array<T>      % Union
collections:difference(a: array<T>, b: array<T>) → array<T> % Difference
collections:intersection(a: array<T>, b: array<T>) → array<T> % Intersection
```

## Array Transformations

```prolog
collections:sort(arr: array<T>) → array<T>                  % Sort array
collections:distinct(arr: array<T>) → array<T>              % Remove duplicates
collections:remove_nulls(arr: array<T>) → array<T>          % Remove null values
collections:shuffle(arr: array<T>) → array<T>               % Shuffle randomly
```

## Advanced Array Operations

```prolog
collections:explode(arr: array<T>) → T                      % Row-expanding
collections:slice(arr: array<T>, start: int, length: int) → array<T> % Extract slice
collections:sub_array(arr: array<T>, length: int) → array<T>         % First N elements
collections:transform(arr: array<T>, lambdaSql: string) → array<any> % Transform
collections:filter(arr: array<T>, lambdaSql: string) → array<T>      % Filter
```

**Note:** `transform` and `filter` can also be used without the `collections:` prefix.

## Map Operations

```prolog
collections:map(k1: K, v1: V, k2: K, v2: V, …) → map<K,V>   % Create map
```

## Examples

**Process employee skills arrays:**
```prolog
skilled_employees(Name, SkillCount) :- 
    employee(Name, Skills), 
    SkillCount = collections:size(Skills), 
    SkillCount > 3.
```

**Find employees with specific skills:**
```prolog
java_developers(Name) :- 
    employee(Name, Skills), 
    HasJava = collections:contains(Skills, "Java"), 
    HasJava == #T.
```

**Merge department skill sets:**
```prolog
combined_skills(Dept, AllSkills) :- 
    dept_skills(Dept, Skills1), 
    other_dept_skills(Dept, Skills2), 
    AllSkills = collections:union(Skills1, Skills2).
```

**Extract array slice:**
```prolog
% Get elements from position 1 to 3 (inclusive)
slice_example(Result) :- 
    data([1, 2, 3, 4, 5]), 
    Result = collections:slice([1, 2, 3, 4, 5], 1, 3).
% Result: [1, 2, 3]
```

**Get sub-array (first N elements):**
```prolog
% Get first 3 elements
top_three(List, TopThree) :- 
    ranked_items(List), 
    TopThree = collections:sub_array(List, 3).
```

**Transform array elements:**
```prolog
% Add 1 to each element
increment_all(Transformed) :- 
    input([1, 2, 3]), 
    Transformed = collections:transform([1, 2, 3], "x -> x + 1").
% Result: [2, 3, 4]

% Transform with index (element + index)
with_index(Transformed) :- 
    input([1, 2, 3]), 
    Transformed = transform([1, 2, 3], "(x, i) -> x + i").
% Result: [1, 3, 5]
```

**Filter array elements:**
```prolog
% Filter elements greater than 2
filter_large(Filtered) :- 
    input([1, 2, 3, 4]), 
    Filtered = filter([1, 2, 3, 4], "x -> x > 2").
% Result: [3, 4]

% Filter with index (keep elements at odd indices)
filter_odd_indices(Filtered) :- 
    input([10, 20, 30, 40]), 
    Filtered = collections:filter([10, 20, 30, 40], "(x, i) -> i % 2 != 0").
% Result: [20, 40]
```

**Explode array (create one row per element):**
```prolog
% Expand array into multiple rows
exploded(Element) :- 
    fruits(["apple", "banana", "cherry"]), 
    Element = collections:explode(["apple", "banana", "cherry"]).
% Results in 3 rows: "apple", "banana", "cherry"
```

