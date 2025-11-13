---
slug: /learn/vadalog/expressions/specialized-functions
---

# Specialized Functions

Vadalog provides a comprehensive library of specialized functions for mathematical operations, hashing, date/time manipulation, type casting, and interval checks.

---

## Null Management

Handle null values safely in your programs.

### `nullManagement:isnull()` / `is_null()`
Check if a value is null:

```prolog
nullManagement:isnull(value: any) → boolean
is_null(value: any) → boolean                   % Standalone version
```

**Examples:**
```prolog
% Using namespaced version
missing_data(IsNull) :- 
    employee(Name, Salary), 
    IsNull = nullManagement:isnull(Salary).

% Using standalone version
has_null(HasNull) :- 
    data(Value, Null), 
    HasNull = is_null(Null).
```

### `is_not_null()`
Check if a value is not null:

```prolog
is_not_null(value: any) → boolean
```

**Example:**
```prolog
valid_records(El, State) :- 
    data(El), 
    State = if(is_not_null(El), "valid", "invalid").
```

### `nullManagement:ifnull()`
Return different values based on null status:

```prolog
nullManagement:ifnull(value: any, ifNull: any, ifNotNull: any) → any
```

**Example:**
```prolog
salary_with_default(Name, Salary) :- 
    employee(Name, RawSalary), 
    Salary = nullManagement:ifnull(RawSalary, "default", RawSalary).
```

### `nullManagement:coalesce()`
Return the first non-null value:

```prolog
nullManagement:coalesce(v1: any, v2: any, …) → any
```

**Example:**
```prolog
contact_info(Name, Contact) :- 
    person(Name, Email, Phone, Address), 
    Contact = nullManagement:coalesce(Email, Phone, Address).
```

---

## Mathematical Functions

### Basic Math

#### `math:mod()`
Modulo operation:

```prolog
math:mod(dividend: number, divisor: number) → number
```

**Example:**
```prolog
is_even(N) :- 
    numbers(N), 
    Remainder = math:mod(N, 2), 
    Remainder == 0.
```

#### `math:sqrt()`
Square root:

```prolog
math:sqrt(x: number) → double
```

**Example:**
```prolog
distance(X, Y, Distance) :- 
    point(X, Y), 
    Distance = math:sqrt(X * X + Y * Y).
```

#### `math:abs()`
Absolute value:

```prolog
math:abs(x: number) → number
```

**Example:**
```prolog
price_difference(Item1, Item2, Diff) :- 
    price(Item1, P1), 
    price(Item2, P2), 
    Diff = math:abs(P1 - P2).
```

#### `math:round()`
Round to nearest integer or specified decimal places:

```prolog
math:round(x: number) → number
math:round(x: number, scale: int) → number
```

**Example:**
```prolog
rounded_price(Item, RoundedPrice) :- 
    price(Item, RawPrice), 
    RoundedPrice = math:round(RawPrice, 2).
```

#### `math:bround()`
Banker's rounding (round to nearest even):

```prolog
math:bround(x: number) → number
math:bround(x: number, scale: int) → number
```

**Example:**
```prolog
banker_rounded(Value, Rounded) :- 
    data(Value), 
    Rounded = math:bround(Value, 2).
```

### Min/Max Operations

#### `math:min()` / `math:max()`
Find minimum or maximum value:

```prolog
math:min(v1: comparable, v2: comparable, …) → same type
math:max(v1: comparable, v2: comparable, …) → same type
```

**Example:**
```prolog
price_range(Product, MinPrice, MaxPrice) :- 
    prices(Product, P1, P2, P3, P4), 
    MinPrice = math:min(P1, P2, P3, P4), 
    MaxPrice = math:max(P1, P2, P3, P4).
```

### Logarithmic and Exponential

#### `math:log()`
Natural logarithm:

```prolog
math:log(x: number) → double
```

**Example:**
```prolog
log_value(X, LogX) :- 
    data(X), 
    LogX = math:log(X).
```

#### `math:log10()`
Base-10 logarithm:

```prolog
math:log10(x: number) → double
```

**Example:**
```prolog
magnitude(Value, Magnitude) :- 
    measurement(Value), 
    Magnitude = math:log10(Value).
```

#### `math:pow()`
Power (exponentiation):

```prolog
math:pow(base: number, exponent: number) → double
```

**Example:**
```prolog
compound_interest(Principal, Rate, Time, Amount) :- 
    investment(Principal, Rate, Time), 
    Amount = Principal * math:pow(1 + Rate, Time).
```

#### `math:exp()`
Exponential (e^x):

```prolog
math:exp(x: number) → double
```

**Example:**
```prolog
exponential_growth(Rate, Time, Growth) :- 
    parameters(Rate, Time), 
    Growth = math:exp(Rate * Time).
```

### Ceiling and Floor

#### `math:ceil()` / `math:floor()`
Round up or down to nearest integer:

```prolog
math:ceil(x: number) → number
math:floor(x: number) → number
```

**Example:**
```prolog
quantity_boxes(Items, Boxes) :- 
    order(Items), 
    Boxes = math:ceil(Items / 24).  % 24 items per box
```

### Trigonometric Functions

#### `math:sin()` / `math:cos()` / `math:tan()`
Trigonometric functions:

```prolog
math:sin(x: number) → double
math:cos(x: number) → double
math:tan(x: number) → double
```

**Example:**
```prolog
wave_value(Angle, SineWave) :- 
    angles(Angle), 
    SineWave = math:sin(Angle).
```

### Random Numbers and Constants

#### `math:uniform()` / `math:rand()`
Generate random numbers:

```prolog
math:uniform(upperBound: number) → number       % Random integer [0, upperBound)
math:rand() → double                            % Random double [0, 1)
```

**Example:**
```prolog
random_customer_id(ID) :- 
    customer(Name), 
    ID = math:uniform(100000).
```

#### `math:PI()` / `math:E()`
Mathematical constants:

```prolog
math:PI() → double
math:E() → double
```

**Example:**
```prolog
circle_area(Radius, Area) :- 
    circle(Radius), 
    Area = math:PI() * math:pow(Radius, 2).
```

---

## Hash Functions

Generate hash values for data integrity and security.

### `hash:hash()`
Generate 32-bit Spark hash:

```prolog
hash:hash(v1: any, v2: any, …) → int
```

**Example:**
```prolog
record_hash(Name, Hash) :- 
    person(Name, Age, Email), 
    Hash = hash:hash(Name, Age, Email).
```

### `hash:sha1()`
Generate SHA-1 hash:

```prolog
hash:sha1(value: any) → string
```

**Example:**
```prolog
secure_user_sha1(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:sha1(Password).
```

### `hash:md5()`
Generate MD5 hash:

```prolog
hash:md5(value: any) → string
```

**Example:**
```prolog
secure_user_md5(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:md5(Password).
```

### `hash:sha2()`
Generate SHA-2 hash with specified bit length:

```prolog
hash:sha2(v1: any, …, bitLength: int) → string
```

**Examples:**
```prolog
% SHA-256 hash
secure_user_sha256(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:sha2(Password, 256).

% SHA-2 with multiple values (composite keys)
composite_hash(User, Pass, Hash) :- 
    credentials(User, Pass), 
    Hash = hash:sha2(User, Pass, 256).
```

---

## Date and Time Functions

### Current Date/Time

#### `date:current_date()` / `date:current_timestamp()`
Get current date or timestamp:

```prolog
date:current_date() → date
date:current_timestamp() → timestamp
```

**Example:**
```prolog
record_created(ID, CreatedAt) :- 
    new_record(ID), 
    CreatedAt = date:current_timestamp().
```

### Date Arithmetic

#### `date:next_day()` / `date:prev_day()`
Add or subtract one day:

```prolog
date:next_day(date: date) → date
date:prev_day(date: date) → date
```

**Example:**
```prolog
due_date(Task, DueDate) :- 
    task(Task, StartDate), 
    DueDate = date:next_day(StartDate).
```

#### `date:add()` / `date:sub()`
Add or subtract days:

```prolog
date:add(date: date, days: int) → date
date:sub(date: date, days: int) → date
```

**Example:**
```prolog
expiry_date(Product, ExpiryDate) :- 
    product(Product, ManufactureDate, ShelfLife), 
    ExpiryDate = date:add(ManufactureDate, ShelfLife).
```

#### `date:diff()`
Calculate difference in days:

```prolog
date:diff(end: date, start: date) → int
```

**Example:**
```prolog
employee_tenure(Name, Years) :- 
    employee(Name, HireDate), 
    Today = date:current_date(), 
    Days = date:diff(Today, HireDate), 
    Years = Days / 365.
```

### Date Formatting and Parsing

#### `date:spec_day()`
Parse date with specific format:

```prolog
date:spec_day(text: string "MMM-yyyy") → string
```

**Example:**
```prolog
formatted_date(InvestmentDate, FormattedDate) :- 
    investment(InvestmentDate), 
    FormattedDate = date:spec_day(InvestmentDate).
```

#### `date:to_timestamp()`
Parse string to timestamp:

```prolog
date:to_timestamp(text: string, format: string) → timestamp
```

**Example:**
```prolog
parsed_timestamp(Raw, Ts) :- 
    raw_date(Raw), 
    Ts = date:to_timestamp(Raw, "yy-M-dd HH:mm:ss,SSS Z").
```

#### `date:format()`
Format date or timestamp to string:

```prolog
date:format(dateOrTs: date|timestamp, pattern: string) → string
```

**Example:**
```prolog
formatted_report(Name, FormattedDate) :- 
    event(Name, EventDate), 
    FormattedDate = date:format(EventDate, "yyyy-MM-dd").
```

---

## Type Casting Functions

Convert values between different data types.

### Basic Type Casting

#### `as_string()`
Cast to string:

```prolog
as_string(value: any) → string
```

**Example:**
```prolog
formatted_id(ID) :- 
    customer(NumericID), 
    ID = concat("CUST-", as_string(NumericID)).
```

#### `as_int()` / `as_long()`
Cast to integer or long:

```prolog
as_int(value: any) → int
as_long(value: any) → long
```

**Example:**
```prolog
numeric_value(Value) :- 
    raw_data(StringValue), 
    Value = as_int(StringValue).
```

#### `as_double()` / `as_float()`
Cast to double or float:

```prolog
as_double(value: any) → double
as_float(value: any) → float
```

**Example:**
```prolog
precise_value(Value) :- 
    raw_data(StringValue), 
    Value = as_double(StringValue).
```

#### `as_boolean()`
Cast to boolean:

```prolog
as_boolean(value: any) → boolean
```

**Example:**
```prolog
is_active(Name, Active) :- 
    user(Name, StatusString), 
    Active = as_boolean(StatusString).
```

#### `as_date()` / `as_timestamp()`
Cast to date or timestamp:

```prolog
as_date(value: string|timestamp) → date
as_timestamp(value: string) → timestamp
```

**Example:**
```prolog
event_date(EventName, ParsedDate) :- 
    event(EventName, DateString), 
    Timestamp = date:to_timestamp(DateString, "dd/MM/yyyy"),
    ParsedDate = as_date(Timestamp).
```

#### `as_json()`
Cast to JSON string:

```prolog
as_json(value: any) → string
```

**Example:**
```prolog
json_output(Data, JsonString) :- 
    structured_data(Data), 
    JsonString = as_json(Data).
```

### Collection Type Casting

#### `as_list()` / `as_set()` / `as_map()`
Cast to collection types:

```prolog
as_list(value: any, elementType: type) → list
as_set(value: any, elementType: type) → set
as_map(keys: any, values: any, types: any) → map
```

---

## Interval Operators

Check if values fall within specified ranges.

### `between()`
Exclusive on both ends:

```prolog
between(value, lower, upper) → boolean
```

**Example:**
```prolog
strict_range(X) :- 
    data(X), 
    InRange = between(X, 5, 10), 
    InRange == #T.
% Returns true for 6, 7, 8, 9 (not 5 or 10)
```

### `_between()`
Inclusive left, exclusive right:

```prolog
_between(value, lower, upper) → boolean
```

**Example:**
```prolog
left_inclusive(X) :- 
    data(X), 
    InRange = _between(X, 5, 10), 
    InRange == #T.
% Returns true for 5, 6, 7, 8, 9 (not 10)
```

### `between_()`
Exclusive left, inclusive right:

```prolog
between_(value, lower, upper) → boolean
```

**Example:**
```prolog
right_inclusive(X) :- 
    data(X), 
    InRange = between_(X, 5, 10), 
    InRange == #T.
% Returns true for 6, 7, 8, 9, 10 (not 5)
```

### `_between_()`
Inclusive on both ends:

```prolog
_between_(value, lower, upper) → boolean
```

**Example:**
```prolog
fully_inclusive(X) :- 
    data(X), 
    InRange = _between_(X, 5, 10), 
    InRange == #T.
% Returns true for 5, 6, 7, 8, 9, 10

% Practical example: filter customers by age range
adult_customers(Name, Age) :- 
    customer(Name, Age), 
    IsAdult = _between_(Age, 18, 65), 
    IsAdult == #T.
```

---

## Utility Functions

### `struct()`
Create structured data by pairing keys with values:

```prolog
struct(key1: string, value1: any, key2: string, value2: any, ...) → struct
```

**Example:**
```prolog
record_with_metadata(X, S) :- 
    data(X), 
    S = struct(X, "originalValue", X + 1, "incrementedValue").
```

### `uuid()`
Generate universally unique identifiers:

```prolog
uuid() → string                                 % Random UUID
uuid(arg1: any, arg2: any, ...) → string       % Deterministic UUID
```

**Examples:**
```prolog
% Generate random UUIDs
random_id(A, U) :- 
    input(A), 
    U = uuid().

% Generate deterministic UUIDs for consistent identification
patient_id(Clinic, Patient, UniqueID) :- 
    patient_data(Clinic, Patient), 
    UniqueID = uuid(Clinic, Patient).
```

### `monotonically_increasing_id()`
Generate monotonically increasing IDs:

```prolog
monotonically_increasing_id() → long
```

**Example:**
```prolog
numbered_records(Name, ID) :- 
    records(Name), 
    ID = monotonically_increasing_id().
```

### `utils:phone_number()`
Format phone numbers with optional regional context:

```prolog
utils:phone_number(phone: string) → string
utils:phone_number(phone: string, region: string) → string
```

**Examples:**
```prolog
% Format phone number with default region
formatted_phone(Ph, Fmt) :- 
    phone_data(Ph), 
    Fmt = utils:phone_number(Ph).

% Format with specific region
formatted_phone_uk(Ph, Fmt) :- 
    phone_data(Ph), 
    Fmt = utils:phone_number(Ph, "GB").
```

---

## Anonymization Functions

Privacy-preserving data operations.

### `anonymization:risk()`
Calculate privacy risk score:

```prolog
anonymization:risk(sampleFrequency: number, weights: array<number>, nIterations: int) → double
```

**Example:**
```prolog
privacy_assessment(Dataset, RiskScore) :- 
    sensitive_data(Dataset, Attributes), 
    RiskScore = anonymization:risk(0.1, [1.0, 0.8, 0.6], 1000).
```

### `anonymization:msu()`
Calculate MSU score:

```prolog
anonymization:msu(attributes: any, m: int, k: int) → int
```

**Example:**
```prolog
msu_score(Data, Score) :- 
    dataset(Data, Attrs), 
    Score = anonymization:msu(Attrs, 5, 3).
```

---

## Kalman Filter Functions

Advanced signal processing and fault detection.

### `kalmanFilter:fault()`
Detect faults using Kalman filter:

```prolog
kalmanFilter:fault(A: any, B: any, C: any, R: any, Q: any, X: any, U: any, nu: any) → string
```

### `kalmanFilter:extractor()`
Extract values from Kalman filter input:

```prolog
kalmanFilter:extractor(input1: any, input2: any, inputNumber: int) → int
```
