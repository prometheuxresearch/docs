---
slug: /learn/vadalog/expressions/specialized-functions
---

# Specialized Functions

Vadalog provides a comprehensive library of specialized functions for mathematical operations, hashing, date/time manipulation, type casting, and interval checks.

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

% Generate secure password hashes with SHA-1
secure_user_sha1(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:sha1(Password).

% Generate secure password hashes with MD5
secure_user_md5(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:md5(Password).

% Generate secure password hashes with SHA-2 (256-bit)
secure_user_sha256(Username, PasswordHash) :- 
    user(Username, Password), 
    PasswordHash = hash:sha2(Password, 256).

% SHA-2 with multiple values (e.g., for composite keys)
composite_hash(User, Pass, Hash) :- 
    credentials(User, Pass), 
    Hash = hash:sha2(User, Pass, 256).
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

% Parse timestamp with custom format
parse_custom_date(Raw, Formatted) :- 
    myDates(Raw), 
    Ts = date:to_timestamp(Raw, "yy-M-dd HH:mm:ss,SSS Z"), 
    Formatted = date:format(Ts, "yyyy-MM-dd'T'HH:mm:ssZ").

% Convert date formats using to_timestamp and format
date_conversion(Original, ConvertedDate) :- 
    raw_date(Original), 
    Timestamp = date:to_timestamp(Original, "dd/MM/yyyy"), 
    ConvertedDate = dataTypes:as_date(Timestamp).
```

---

## Type Casting Functions

Convert values between different data types:

```prolog
dataTypes:as_string(value: any) → string                   % Cast to string
dataTypes:as_int(value: any) → int                         % Cast to integer
dataTypes:as_double(value: any) → double                   % Cast to double
dataTypes:as_long(value: any) → long                       % Cast to long
dataTypes:as_date(value: string|timestamp) → date          % Cast to date
```

**Examples:**
```prolog
% Cast string to integer for calculations
numeric_value(Value) :- 
    raw_data(StringValue), 
    Value = dataTypes:as_int(StringValue).

% Cast and parse date from string
event_date(EventName, ParsedDate) :- 
    event(EventName, DateString), 
    Timestamp = date:to_timestamp(DateString, "dd/MM/yyyy"),
    ParsedDate = dataTypes:as_date(Timestamp).

% Cast to string for concatenation
formatted_id(ID) :- 
    customer(NumericID), 
    ID = concat("CUST-", dataTypes:as_string(NumericID)).
```

---

## Interval Operators

Check if values fall within specified ranges with different inclusivity options:

```prolog
between(value, lower, upper) → boolean                     % Exclusive on both ends
_between(value, lower, upper) → boolean                    % Inclusive left, exclusive right
between_(value, lower, upper) → boolean                    % Exclusive left, inclusive right
_between_(value, lower, upper) → boolean                   % Inclusive on both ends
```

**Examples:**
```prolog
% Check if value is strictly between 5 and 10 (excludes boundaries)
strict_range(X) :- 
    data(X), 
    InRange = between(X, 5, 10), 
    InRange == #T.

% Check if value is between 5 and 10 (includes 5, excludes 10)
left_inclusive(X) :- 
    data(X), 
    InRange = _between(X, 5, 10), 
    InRange == #T.

% Check if value is between 5 and 10 (excludes 5, includes 10)
right_inclusive(X) :- 
    data(X), 
    InRange = between_(X, 5, 10), 
    InRange == #T.

% Check if value is between 5 and 10 (includes both 5 and 10)
fully_inclusive(X) :- 
    data(X), 
    InRange = _between_(X, 5, 10), 
    InRange == #T.

% Practical example: filter customers by age range
adult_customers(Name, Age) :- 
    customer(Name, Age), 
    IsAdult = _between_(Age, 18, 65), 
    IsAdult == #T.
```

---

## Utility Functions

General-purpose utility functions for common operations.

### `struct()`
Create structured data by pairing keys with values:

```prolog
struct(key1: string, value1: any, key2: string, value2: any, ...) → struct
```

**Example:**
```prolog
% Create structured record
record_with_metadata(X, S) :- 
    data(X), 
    S = struct(X, "originalValue", X + 1, "incrementedValue").
```

### `uuid()`
Generate universally unique identifiers (UUIDs). Can be used with or without parameters:

```prolog
uuid() → string                                             % Random UUID
uuid(arg1: any, arg2: any, ...) → string                   % Deterministic UUID from args
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
Generate monotonically increasing IDs (useful for assigning unique identifiers):

```prolog
monotonically_increasing_id() → long
```

**Example:**
```prolog
% Assign unique IDs to records
numbered_records(Name, ID) :- 
    records(Name), 
    ID = monotonically_increasing_id().
```

### `is_not_null()`
Check if a value is not null (opposite of `nullManagement:isnull`):

```prolog
is_not_null(value: any) → boolean
```

**Example:**
```prolog
% Filter non-null values
valid_records(El, State) :- 
    data(El), 
    State = if(is_not_null(El), "valid", "invalid").
```

### `utils:phone_number()`
Format phone numbers with optional regional context:

```prolog
utils:phone_number(phone: string) → string                 % Default formatting
utils:phone_number(phone: string, region: string) → string % Region-specific formatting
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

