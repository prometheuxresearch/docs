<!-- # LLM Validation

The **LLM Validation** use case enables validating outputs from Large Language Models against predefined guardrail programs. This ensures generated content aligns with domain-specific rules and constraints.

---

## Function

```python
def validate(text, guardrail)
```
**Parameters**
- `text` _(str)_:
The input text to be validated against the guardrail program.
- `guardrail` _(str)_:
The file path to the guardrail `Vadalog` program, which defines the validation rules and constraints.

**Returns**

A dictionary containing:
- **Validation Outcome**: Whether the text passed or failed the validation.
- **Results**: Specific details about the validation process.
- **Summary**: A high-level overview of the validation result.

**Example**

The following example demonstrates how to validate an LLM's output:

```python
import prometheux_chain as px

# An output from an LLM to validate
llm_response = "Yes, there is a refund of category Electronics that occurred 10 days ago, for a MacBook Pro, with a price of 999 dollars" 

# Specify the path to the guardrail program file
guardrail_file = "policies"

# Perform validation
validation = px.validate(llm_response, guardrail_file)

# Print the validation results
print(validation['validation_outcome'])
print(validation['validation_summary'])
```

A possible set of `Vadalog` rules in the `policies` file is as follows:

```prolog
% The @model directive defines the schema for the "refund" predicate and provides a description:
% - "ProductName" (string): The name of the refunded product.
% - "Category" (string): The category of the refunded product (e.g., Electronics, Home Appliances).
% - "ElapsedDays" (int): The number of days since the refund occurred.
% - "Value" (double): The monetary value of the refund.
@model("refund", "['ProductName:string', 'Category:string', 'ElapsedDays:int', 'Value:double']", "there is a refund for product [ProductName] of category [Category], that occurred [ElapsedDays] days ago having value [Value]").

% Policy:
% - A policy for refunds that match the specified conditions.
% - `refund(ProductName, Category, ElapsedDays, Value)`:
%   Matches records where the refund details are provided for the specified parameters.
% - `Contains = collections:contains({"Electronics", "Home Appliances"}, Category)`:
%   Uses a collection check to determine if the product's "Category" belongs to the set {"Electronics", "Home Appliances"}.
%   The result of this operation is assigned to "Contains".
% - `Contains == #T`:
%   Ensures that the category check is true, i.e., the "Category" must belong to the allowed set.
% - `ElapsedDays <= 14`:
%   Filters refunds that occurred within the last 14 days.
% - `Value < 1000`
?- refund(ProductName, Category, ElapsedDays, Value), Contains = collections:contains({"Electronics","Home Appliances"}, Category), Contains == #T, ElapsedDays <= 14, Value < 1000.
``` -->