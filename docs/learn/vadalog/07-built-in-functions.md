# Built-in Functions Reference

Vadalog provides a comprehensive library of built-in functions organized by functional domains. These functions can be used in expressions, conditions, and assignments within your Vadalog programs.

---

## Null Management

Handle null values safely in your programs:

### `nullManagement:isnull(value: any) → boolean`

Checks if a value is null.

**Example:**
```prolog
missing_data(Name) :- 
    employee(Name, Salary), 
    IsNull = nullManagement:isnull(Salary), 
    IsNull == #T.
```

### `nullManagement:ifnull(value: any, ifNull: any, ifNotNull: any) → any`

Returns one value if the input is null, another if not null.

**Example:**
```prolog
salary_with_default(Name, Salary) :- 
    employee(Name, RawSalary), 
    Salary = nullManagement:ifnull(RawSalary, 0, RawSalary).
```

### `nullManagement:coalesce(v1: any, v2: any, …) → any`

Returns the first non-null value from the arguments.

**Example:**
```prolog
contact_info(Name, Contact) :- 
    person(Name, Email, Phone, Address), 
    Contact = nullManagement:coalesce(Email, Phone, Address).
```

---

## Mathematical Functions

Comprehensive mathematical operations:

### Basic Math

```prolog
math:mod(dividend: number, divisor: number) → number        % Modulo
math:sqrt(x: number) → double                               % Square root
math:abs(x: number) → number                                % Absolute value
math:round(x: number, scale?: int) → number                 % Round to scale
math:bround(x: number, scale?: int) → number                % Banker's rounding
```

### Min/Max Operations

```prolog
math:min(v1: comparable, v2: comparable, …) → same type     % Minimum
math:max(v1: comparable, v2: comparable, …) → same type     % Maximum
```

### Logarithmic and Exponential

```prolog
math:log(x: number) → double                                % Natural logarithm
math:log10(x: number) → double                              % Base-10 logarithm
math:pow(base: number, exponent: number) → double           % Power
math:exp(x: number) → double                                % Exponential
```

### Ceiling and Floor

```prolog
math:ceil(x: number) → number                               % Ceiling
math:floor(x: number) → number                              % Floor
```

### Trigonometric Functions

```prolog
math:sin(x: number) → double                                % Sine
math:cos(x: number) → double                                % Cosine
math:tan(x: number) → double                                % Tangent
```

### Random Numbers and Constants

```prolog
math:uniform(upperBound: number) → number                   % Random integer [0, upperBound)
math:rand() → double                                        % Random double [0, 1)
math:PI() → double                                          % π constant
math:E() → double                                           % Euler's number
```

**Examples:**
```prolog
% Calculate compound interest
compound_interest(Principal, Rate, Time, Amount) :- 
    investment(Principal, Rate, Time), 
    Amount = Principal * math:pow(1 + Rate, Time).

% Generate random customer IDs
random_customer_id(ID) :- 
    customer(Name), 
    ID = math:uniform(100000).

% Calculate distance using trigonometry
distance(Dist) :- 
    coordinates(X, Y), 
    Dist = math:sqrt(math:pow(X, 2) + math:pow(Y, 2)).
```

---

## Hash Functions

Generate hash values for data integrity and security:

```prolog
hash:hash(v1: any, v2: any, …) → int                        % 32-bit Spark hash
hash:sha1(value: any) → string                              % SHA-1 (hex)
hash:md5(value: any) → string                               % MD5 (hex)
hash:sha2(v1: any, …, bitLength: int) → string              % SHA-2 (hex)
```

**Examples:**
```prolog
% Create unique record identifiers
record_hash(Name, Hash) :- 
    person(Name, Age, Email), 
    Hash = hash:hash(Name, Age, Email).

% Generate secure password hashes
secure_user(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:sha2(Password, 256).
```

---

## Collections (Arrays & Maps)

Manipulate arrays and maps efficiently:

### Array Operations

```prolog
collections:size(arr: array<any>) → int                     % Get array size
collections:contains(arr: array<any>, value: any) → boolean % Check if contains
collections:contains_all(arr: array<any>, subset: array<any>) → boolean % Check subset
collections:add(arr: array<T>, elem: T) → array<T>          % Add element
collections:remove(arr: array<T>, elem: T) → array<T>       % Remove element
collections:get(arr: array<T>, index: int) → T              % Get by index (1-based)
```

### Set Operations on Arrays

```prolog
collections:union(a: array<T>, b: array<T>) → array<T>      % Union
collections:difference(a: array<T>, b: array<T>) → array<T> % Difference
collections:intersection(a: array<T>, b: array<T>) → array<T> % Intersection
```

### Array Transformations

```prolog
collections:sort(arr: array<T>) → array<T>                  % Sort array
collections:distinct(arr: array<T>) → array<T>              % Remove duplicates
collections:remove_nulls(arr: array<T>) → array<T>          % Remove null values
collections:shuffle(arr: array<T>) → array<T>               % Shuffle randomly
```

### Advanced Array Operations

```prolog
collections:explode(arr: array<T>) → T                      % Row-expanding
collections:transform(arr: array<T>, lambdaSql: string) → array<any> % Transform
collections:filter(arr: array<T>, lambdaSql: string) → array<T>      % Filter
```

### Map Operations

```prolog
collections:map(k1: K, v1: V, k2: K, v2: V, …) → map<K,V>   % Create map
```

**Examples:**
```prolog
% Process employee skills arrays
skilled_employees(Name, SkillCount) :- 
    employee(Name, Skills), 
    SkillCount = collections:size(Skills), 
    SkillCount > 3.

% Find employees with specific skills
java_developers(Name) :- 
    employee(Name, Skills), 
    HasJava = collections:contains(Skills, "Java"), 
    HasJava == #T.

% Merge department skill sets
combined_skills(Dept, AllSkills) :- 
    dept_skills(Dept, Skills1), 
    other_dept_skills(Dept, Skills2), 
    AllSkills = collections:union(Skills1, Skills2).
```

---

## Date and Time Functions

Comprehensive date/time manipulation:

### Current Date/Time

```prolog
date:current_date() → date                                  % Current date
date:current_timestamp() → timestamp                       % Current timestamp
```

### Date Arithmetic

```prolog
date:next_day(date: date) → date                           % Add 1 day
date:add(date: date, days: int) → date                     % Add days
date:prev_day(date: date) → date                           % Subtract 1 day
date:sub(date: date, days: int) → date                     % Subtract days
date:diff(end: date, start: date) → int                    % Difference in days
```

### Date Formatting and Parsing

```prolog
date:spec_day(text: string "MMM-yyyy") → string            % Specific day format
date:to_timestamp(text: string, format: string) → timestamp % Parse timestamp
date:format(dateOrTs: date|timestamp, pattern: string) → string % Format date
```

**Examples:**
```prolog
% Calculate employee tenure
employee_tenure(Name, Years) :- 
    employee(Name, HireDate), 
    Today = date:current_date(), 
    Days = date:diff(Today, HireDate), 
    Years = Days / 365.

% Format dates for reporting
formatted_report(Name, FormattedDate) :- 
    event(Name, EventDate), 
    FormattedDate = date:format(EventDate, "yyyy-MM-dd").
```

---

## Anonymization Functions

Privacy-preserving data operations:

```prolog
anonymization:risk(sampleFrequency: number, weights: array<number>, nIterations: int) → double
anonymization:msu(attributes: array<any>, m: int, k: int) → int
```

**Example:**
```prolog
% Calculate privacy risk
privacy_assessment(Dataset, RiskScore) :- 
    sensitive_data(Dataset, Attributes), 
    RiskScore = anonymization:risk(0.1, [1.0, 0.8, 0.6], 1000).
```

---

## Kalman Filter Functions

Advanced signal processing and fault detection:

```prolog
kalmanFilter:fault(A: any, B: any, C: any, R: any, Q: any, X: any, U: any, nu: any) → string
kalmanFilter:extractor(input1: any, input2: any, inputNumber: int) → int
```

---

## Embeddings and LLM Functions

AI-powered text processing:

### Vector Embeddings

```prolog
embeddings:vectorize(arg1: string, arg2: string, …) → array<double>
embeddings:cosine_sim_udf(left: array<double>, right: array<double>) → double
embeddings:cosine_sim(left: array<double>, right: array<double>) → double
```

### LLM Generation

```prolog
llm:generate(prompt: string, outputType: string) → typed
```

**Supported output types**: `string`, `int`, `double`, `boolean`, `list<string>`, `list<int>`, `list<double>`, `list<boolean>`

**Examples:**
```prolog
% Generate embeddings for similarity analysis
customer_similarity(Name1, Name2, Similarity) :- 
    customer(Name1, Info1), 
    customer(Name2, Info2), 
    Vec1 = embeddings:vectorize(Name1, Info1), 
    Vec2 = embeddings:vectorize(Name2, Info2), 
    Similarity = embeddings:cosine_sim(Vec1, Vec2).

% Generate dynamic content
product_description(Product, Description) :- 
    product(Product, Features, Price), 
    Description = llm:generate(
        "Create a marketing description for ${Product} with features ${Features} priced at ${Price}", 
        "string"
    ).
```

---

## Utility Functions

General-purpose utility functions:

```prolog
utils:phone_number(phone: string, region?: string) → string % Format phone numbers
```

**Example:**
```prolog
formatted_contact(Name, FormattedPhone) :- 
    contact(Name, Phone, Country), 
    FormattedPhone = utils:phone_number(Phone, Country).
```

---

## Function Usage Patterns

### Chaining Functions

```prolog
processed_data(Result) :- 
    raw_data(Text), 
    Lower = to_lower(Text), 
    Trimmed = replace(Lower, " ", ""), 
    Result = math:abs(as_int(Trimmed)).
```

### Conditional Function Calls

```prolog
safe_division(X, Y, Result) :- 
    numbers(X, Y), 
    Result = nullManagement:ifnull(
        math:round(X / Y, 2), 
        0, 
        math:round(X / Y, 2)
    ).
```

### Function Composition

```prolog
complex_calculation(Input, Output) :- 
    data(Input), 
    Squared = math:pow(Input, 2), 
    Rooted = math:sqrt(Squared + 1), 
    Output = math:round(Rooted, 3).
```

This comprehensive function reference enables powerful data processing and analysis capabilities in Vadalog programs. 