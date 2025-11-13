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
collections:transform(arr: array<T>, lambdaSql: string) → array<any> % Transform
collections:filter(arr: array<T>, lambdaSql: string) → array<T>      % Filter
```

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

