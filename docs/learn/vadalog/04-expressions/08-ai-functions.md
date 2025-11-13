---
slug: /learn/vadalog/expressions/ai-functions
---

# AI Functions

AI-powered text processing using embeddings and large language models.

---

## Vector Embeddings

Generate and compare vector embeddings for semantic similarity:

```prolog
embeddings:vectorize(arg1: string, arg2: string, …) → array<double>
embeddings:cosine_sim_udf(left: array<double>, right: array<double>) → double
embeddings:cosine_sim(left: array<double>, right: array<double>) → double
```

**Example:**
```prolog
% Generate embeddings for similarity analysis
customer_similarity(Name1, Name2, Similarity) :- 
    customer(Name1, Info1), 
    customer(Name2, Info2), 
    Vec1 = embeddings:vectorize(Name1, Info1), 
    Vec2 = embeddings:vectorize(Name2, Info2), 
    Similarity = embeddings:cosine_sim(Vec1, Vec2).
```

---

## LLM Generation

Generate dynamic content using large language models:

```prolog
llm:generate(prompt: string, outputType: string) → typed
llm:generate(prompt: string, outputType: string, arg1: any, arg2: any, ...) → typed
```

**Supported output types**: `string`, `int`, `double`, `boolean`, `list<string>`, `list<int>`, `list<double>`, `list<boolean>`

**Prompt Templating**: Use `${Variable}` for direct variable interpolation or `${arg_1}`, `${arg_2}`, etc. for positional arguments.

**Examples:**

**Direct variable interpolation:**
```prolog
% Generate boolean classification
diagnose_patient(PatientID, HasDiagnosis) :- 
    clinical_notes(PatientID, Notes), 
    HasDiagnosis = llm:generate(
        "Review the clinical notes for patient ${PatientID}: ${Notes}. Determine if there is a specific diagnosis.",
        "boolean"
    ).
```

**Using positional arguments:**
```prolog
% Generate with arg_1, arg_2 placeholders
diagnose_with_args(PatientID, HasDiagnosis, Explanation) :- 
    clinical_notes(PatientID, Notes), 
    HasDiagnosis = llm:generate(
        "Review the clinical notes for patient ${arg_1}: ${arg_2}. Determine if there is a diagnosis.",
        "boolean",
        PatientID,
        Notes
    ),
    Explanation = llm:generate(
        "Analyze the notes for patient ${arg_1}: ${arg_2}. Provide a brief rationale.",
        "string",
        PatientID,
        Notes
    ).
```

**Multiple output types:**
```prolog
% String output for descriptions
product_description(Product, Description) :- 
    product(Product, Features, Price), 
    Description = llm:generate(
        "Create a marketing description for ${Product} with features ${Features} priced at ${Price}", 
        "string"
    ).

% Boolean output for classification
is_positive_feedback(FeedbackID, IsPositive) :- 
    feedback(FeedbackID, Text), 
    IsPositive = llm:generate(
        "Is this feedback positive? ${Text}",
        "boolean"
    ).
```

---

## Use Cases

### Semantic Search

```prolog
% Find similar documents based on content
similar_documents(Doc1, Doc2, Score) :- 
    document(Doc1, Content1), 
    document(Doc2, Content2), 
    Vec1 = embeddings:vectorize(Content1), 
    Vec2 = embeddings:vectorize(Content2), 
    Score = embeddings:cosine_sim(Vec1, Vec2), 
    Score > 0.8.
```

### Content Classification

```prolog
% Classify text using LLM
classify_feedback(FeedbackID, Category) :- 
    feedback(FeedbackID, Text), 
    Category = llm:generate(
        "Classify this customer feedback as 'positive', 'neutral', or 'negative': ${Text}", 
        "string"
    ).
```

### Data Enrichment

```prolog
% Generate missing product information
enrich_product(ProductID, GeneratedInfo) :- 
    product(ProductID, Name, Category), 
    GeneratedInfo = llm:generate(
        "Generate a brief technical specification for ${Name} in the ${Category} category", 
        "string"
    ).
```

