# Data sources

## Relational database source

Vadalog Parallel can read and write to the following relational databases: PostgreSQL and SQLite. Please refer to the [configuration](../on-prem/configuring-prometheux-engine) section for connecting to your database. Then, refer to the [Bind and Mappings](./annotations#bind-mappings-and-qbind) section for instructions on how to read, update and delete data from these data sources.

## CSV data source

Vadalog supports CSV files as data source, both for reading and writing.

The default CSV binding (`"csv"`) is thus suitable for processing big CSV files.
It does not make a guess about the input schema. Therefore, if no schema ([@mapping](./annotations#mapping)) is provided,
all fields are treated as strings.
Values `\N` are treated as `null` values and interpreted as [Marked Nulls](./language-primitives#marked-nulls) while reading the CSV file.

### Configuration (Bind Command)

The bind command allows for the configuration of reading and writing cvs files. The syntax is as follows:

```
@bind("relation",
      "csv option_1 = 'value_1', option_2 = 'value_2', …, option_n = 'value_n'",
      "filepath",
      "filename").
```

The options that are available are

- `useHeaders`: Values can be `true` or `false`, depending on whether a header is available/output.
- `delimiter`: Specifies the character that is used to seperate single entries
- `recordSeparator`: Specifies how the record are seperated
- `quoteMode`: Defines quoting behavior. Possible values are:
  - `ALL`: Quotes all fields.
  - `MINIMAL`: Quotes fields which contain special characters such as a the field delimiter, quote character or any of the characters in the line separator string.
  - `NON_NUMERIC`: Quotes all non-numeric fields.
  - `NONE`: Never quotes fields.
- `nullString`: Value can be any string, which replaces null values in the csv file.
- `selectedColumns`: Value is a list of the form `[c1;…;cn]` to select only the columns `c1, …,cn` from the csv file.
  - Each value in the list is either a column name (enclosed with single quotes 'column name') which is present in the csv's header, or is an integer starting from 0 denoting the column index.
  - It is also possible to specify ranges; e.g. `selectedColumns=[0:4]` reads only the five columns `0,1,2,3,4`.
  - It is allowed to mix the values in the list, e.g. `selectedColumns=[0:3; 'Column_5']` would select columns `0,1,2,3` and the column with the name `Column_5`.
  - Note that in order to select columns by name, a header line in the csv must be present.

When specifying a configuaration, any subset of these options can be set at the same time.
Each value has be surrounded by single quotation marks `'value'`.
An example for a csv bind command with configuration would be the following:

```
@bind("relation",
      "csv useHeaders=false, delimiter='\t', recordSeparator='\n'",
      "filepath",
      "filename").
```

### Examples

In the examples below we use a sample CSV file with the following content:

```csv title="File: /path_to_csv/folder/csv_name.csv"
a,b,c
d,e,f
```

Simply reading a csv file into a relation:

```prolog showLineNumbers
@input("myCsv").
@bind("myCsv", "csv", "/path_to_csv/folder", "csv_name.csv").
myAtom(X,Y,Z) :- myCsv(X,Y,Z).
@output("myAtom").
```

We can also map the columns:

```prolog showLineNumbers
@input("myCsv").
@bind("myCsv", "csv useHeaders=true", "/path_to_csv/folder", "csv_name.csv").
@mapping("myCsv", 0, "var1", "string").
@mapping("myCsv", 1, "var2", "string").
@mapping("myCsv", 2, "var3", "string").

myAtom(X,Y,Z) :- myCsv(X,Y,Z).
@output("myAtom").
```

**Example for `selectedColumns`**

The following reads only the the four columns with indices `0,1,2,4` from the CSV file, excluding the column `3`.

```prolog showLineNumbers
@input("myCsv").
@bind("myCsv", "csv selectedColumns=[0:2; 4]", "/path_to_csv/folder", "csv_name.csv").

withoutThree(W, X,Y,Z) :- myCsv(W, X,Y,Z).
@output("withoutThree").
```

<!-- TODO: what does it mean to "use Evaluate"? -->

To store results into another CSV file, you must use Evaluate and bind the entry point.
In this example, we read a CSV file without mapping annotations and write the output into another CSV file:

```prolog showLineNumbers
outFile(X,Y,Z) :- inFile(X,Y,Z).
@input("inFile").
@bind("inFile", "csv", "/path_to_csv/folder", "csv_name.csv").

@output("outFile").
@bind("outFile","csv","/another_csv_path/folder","result.csv").
```

Furthermore, Vadalog support the CSV file data source via http GET.

In this example we read a CSV file via HTTP:

```
out(X,Y) :- headOf(X,Y).

@input("headOf").
@bind("headOf","http_csv","https://raw.githubusercontent.com/dbunibas/chasebench/master/scenarios/LUBM/data/001","src_headOf.csv").
@output("out").
```

We can then write the result into a local CSV file (Evaluate and store entry point).

```
localFile(X,Y) :- headOf(X,Y).

@input("headOf").
@bind("headOf","http_csv","https://raw.githubusercontent.com/dbunibas/chasebench/master/scenarios/LUBM/data/001","src_headOf.csv").
@output("localFile").
@bind("localFile", "csv","/path_to_csv/folder","result.csv").
```
