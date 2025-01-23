# reasoner

The `reasoner` module provides functions to perform reasoning tasks. It takes one or more `.vada` file paths to files with `Vadalog` rules and applies logical reasoning, optionally including `time` mesuring, `explanations` and `persist` the results flags.

---

## Functions

```python
def reason(vada_file_paths, params=None, measure_time=False, to_explain=False, to_persist=False)
```

**Parameters:**

- `vada_file_paths` _(str or list)_: The path(s) to the `.vada` file(s) to be used for reasoning. This can be a single string for one file or a list of strings for multiple files.
- `params` _(dict, optional)_: A dictionary of additional parameters to customize the reasoning process.

- `measure_time` _(bool, optional)_: Whether to measure the time taken for the reasoning process.

- `to_explain` _(bool, optional)_: Whether perform a reasoning task whith results to be explained.
- `to_persist` _(bool, optional)_: Whether to persist the virtual kg or let it be ephemeral.

**Returns:**

- A dictionary representing the virtual knowledge graph resulting from the reasoning process.

**Raises:**
Exception in the following cases:
1. duplicate .vada filenames are found in the provided file paths.
2. there is an error while opening a .vada file.

**Example**
```python
import prometheux_chain as pmtx
import os

# Define the path to the .vada file to be used for reasoning
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'

# Perform reasoning on the .vada file
virtual_kg = pmtx.reason(
    vada_file_paths="min_distance_from_city.vada",
    params={"filter": "New York", "min_distance": 100.0},
    to_explain=True,
    to_persist=True
)
```

A possible set of `Vadalog` rules in the `min_distance_from_city.vada` file is as follows:

```prolog
% Define the input predicate, marking the entry point for reasoning.
@input("distance"). 

% Bind the predicate `distance` to a CSV file containing city distances.
% - `csv multiline=true`: Allows multi-line CSV files.
% - `useHeaders=true`: Indicates the CSV file includes column headers.
% - `"disk/data"`: Directory location of the CSV file.
% - `"city_distance.csv"`: The CSV file containing distances between cities.
@bind("distance", "csv multiline=true, useHeaders=true", "disk/data", "city_distance.csv"). 

% Define a rule to calculate the minimum distance:
% - `From`: Starting city.
% - `To`: Destination city.
% - `D`: Distance between `From` and `To`.
% - `${filter}`: Placeholder for the starting city (to be replaced dynamically).
% - `${min_distance}`: Placeholder for the minimum distance constraint.
min_distance(From, To) :- distance(From, To, D), From == ${filter}, D > ${min_distance}.

% Define the schema for the `distance` predicate:
% - `From`: City of origin (string).
% - `To`: Destination city (string).
% - `D`: Distance between the two cities (double).
@model("distance", "['From:string','To:string','D:double']", "The city [From] is distant [D] miles from the city [To]"). 

% Define the schema for the `min_distance` predicate:
% - `From`: Starting city (string).
% - `To`: Destination city (string).
@model("min_distance", "['From:string','To:string']", "The constraint of minimum distance is respected between the two cities [From] and [To]"). 

% Specify `min_distance` as the output predicate of the reasoning process.
@output("min_distance").
```