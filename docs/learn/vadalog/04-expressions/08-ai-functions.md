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

Generate dynamic content using large language models. Prometheux provides two approaches:

1. **`llm:generate`** - approach for simple use cases
2. **`#LLM`** - approach for large-scale processing

---

### Approach 1: `llm:generate`

Traditional generation for straightforward use cases:

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

### Approach 2: `#LLM`

For large-scale processing across LLM endpoints:

```prolog
#LLM(input_relation, parameters)
```

The `#LLM` function processes all rows from the input relation in parallel, distributing work across multiple LLM endpoints for optimal performance.

#### Parameters

All parameters are specified as a comma-separated string:

**Required:**
- `prompt=<text>` - Single prompt template
- OR `prompt_1=<text1>,prompt_2=<text2>,...` - Multiple numbered prompts
- OR `prompts=prompt_1:<text1>;prompt_2:<text2>;...` - Compact format for multiple prompts

**Optional:**
- `output_type=<type>` - Output type for all prompts (default: `string`)
- `output_type_1=<type1>,output_type_2=<type2>,...` - Per-prompt output types (overrides `output_type`)
- `projected_columns=<spec>` - Custom output column ordering (e.g., `arg_1:llm_2:llm_1:arg_3`)
- `num_partitions=<N>` - Manual partition override

**Supported Output Types:** `string`, `int`, `integer`, `long`, `double`, `float`, `number`, `boolean`, `bool`, `list<string>`, `list<int>`, `list<double>`, `set<string>`

**Prompt Templating:** Use `{arg_1}`, `{arg_2}`, etc. to reference input columns (1-based indexing).

#### Why `num_partitions` is Optional

Prometheux automatically handles optimal partitioning based on your data source, expecially if it already partitioned
**Only specify** `num_partitions` if you need to override the automatic behavior for specific performance requirements.

---

## `#LLM` Function Examples

### Example 1: Single Prompt with Default Output

Process customer feedback with automatic output type (defaults to `string`):

```prolog
% Classify customer sentiment
sentiment_analysis(FeedbackID, Text, Sentiment) :- 
    #LLM(feedback, "prompt=Classify the sentiment of this feedback as positive, neutral, or negative: {arg_2}").

% Usage with input data:
feedback(1, "Great product, very satisfied!").
feedback(2, "Terrible experience, would not recommend.").
```

**Output:**
- Input columns: `feedback_0` (FeedbackID), `feedback_1` (Text)
- Output columns: `feedback_0`, `feedback_1`, `feedback_2` (Sentiment result)

---

### Example 2: Multiple Prompts with Different Output Types

Generate multiple insights with type-specific outputs:

```prolog
% Analyze product reviews with multiple outputs
review_analysis(ProductID, Review, Sentiment, Rating, Keywords) :- 
    #LLM(reviews, 
        "prompt_1=What is the sentiment: {arg_2}?,
         prompt_2=Rate this review from 1-10 (just the number): {arg_2},
         prompt_3=Extract key topics from: {arg_2},
         output_type_1=string,
         output_type_2=int,
         output_type_3=string").

% Input data:
reviews(101, "Amazing quality but expensive").
```

**Output:**
- `reviews_0`: ProductID (101)
- `reviews_1`: Review text
- `reviews_2`: Sentiment (string) from `prompt_1`
- `reviews_3`: Rating (integer) from `prompt_2`
- `reviews_4`: Keywords (string) from `prompt_3`

---

### Example 3: Custom Column Ordering with `projected_columns`

Reorder output columns to match your head predicate:

```prolog
% Place LLM results before input columns
enriched_data(Summary, OriginalText, WordCount) :- 
    #LLM(documents, 
        "prompt_1=Summarize in one sentence: {arg_1},
         prompt_2=Count words in: {arg_1} (answer with just the number),
         output_type_1=string,
         output_type_2=int,
         projected_columns=llm_1:arg_1:llm_2").

% Input:
documents("Artificial intelligence is transforming healthcare.").
```

**Output column order:**
- `enriched_0`: Summary (`llm_1`)
- `enriched_1`: Original text (`arg_1`)
- `enriched_2`: Word count (`llm_2`)

---

### Example 4: Compact Format with Single Output Type

Use compact `prompts` format when all outputs share the same type:

```prolog
% Multiple text analyses with single output_type
text_processing(Text, Translation, Paraphrase, Summary) :- 
    #LLM(sentences, 
        "prompts=prompt_1:Translate to French: {arg_1};
                 prompt_2:Paraphrase this: {arg_1};
                 prompt_3:Summarize this: {arg_1},
         output_type=string").

% Input:
sentences("Machine learning enables computers to learn from data.").
```

**Output:**
- All three LLM results are strings
- `output_type=string` applies to all prompts (`prompt_1`, `prompt_2`, `prompt_3`)

---

### Example 5: Processing Large Datasets (Advanced)

For specific performance tuning on very large datasets, you can override automatic partitioning:

```prolog
% Process millions of records with explicit partition control
batch_classification(DocID, Text, Category) :- 
    #LLM(documents, 
        "prompt=Categorize this document: {arg_2},
         output_type=string,
         num_partitions=32").

% Note: Prometheux automatically optimizes partitioning
% Only specify num_partitions for advanced performance tuning
```

**When to use `num_partitions`:**
- Very large datasets where you need explicit control over parallelism
- Performance tuning and optimization scenarios
- **Default automatic partitioning is optimal for most use cases**

---

## Use Cases

### Semantic Search

Combine embeddings with LLM for intelligent document retrieval:

```prolog
% Find and summarize similar documents
similar_documents(Doc1, Doc2, Score, Summary) :- 
    document(Doc1, Content1), 
    document(Doc2, Content2), 
    Vec1 = embeddings:vectorize(Content1), 
    Vec2 = embeddings:vectorize(Content2), 
    Score = embeddings:cosine_sim(Vec1, Vec2), 
    Score > 0.8,
    result(_, _, Summary) :- #LLM(document, "prompt=Summarize the key similarities between these documents: {arg_2},output_type=string").
```

### Content Classification

Classify large volumes of text in parallel:

```prolog
% Classify customer feedback at scale
classify_feedback(FeedbackID, Text, Category, IsUrgent) :- 
    #LLM(feedback, 
        "prompt_1=Classify this feedback as positive, neutral, or negative: {arg_2},
         prompt_2=Is this feedback urgent? Answer yes or no: {arg_2},
         output_type_1=string,
         output_type_2=string").

% Input data:
feedback(1, "Excellent service, very happy!").
feedback(2, "URGENT: Product stopped working immediately").
```

### Data Enrichment

Generate missing information for entire datasets:

```prolog
% Enrich product catalog with AI-generated content
enrich_product(ProductID, Name, Category, Description, TargetAge, Keywords) :- 
    #LLM(product, 
        "prompt_1=Generate a marketing description for {arg_2} in {arg_3} category,
         prompt_2=What age group is {arg_2} best suited for? Answer with a number (e.g., 25),
         prompt_3=List 3 keywords for {arg_2},
         output_type_1=string,
         output_type_2=int,
         output_type_3=string").

% Automatically processes entire product catalog in parallel
product(101, "Smart Watch Pro", "Electronics").
product(102, "Yoga Mat Premium", "Fitness").
product(103, "Coffee Maker Deluxe", "Home Appliances").
```

### Healthcare Decision Support

Multi-faceted analysis of clinical data:

```prolog
% Analyze patient records with multiple AI insights
patient_analysis(PatientID, Notes, RiskLevel, Recommendations, FollowUpDays) :- 
    #LLM(clinical_notes, 
        "prompt_1=Assess risk level (low/medium/high) for: {arg_2},
         prompt_2=Provide 3 key recommendations for: {arg_2},
         prompt_3=How many days until follow-up? Answer with just a number for: {arg_2},
         output_type_1=string,
         output_type_2=string,
         output_type_3=int,
         projected_columns=arg_1:arg_2:llm_1:llm_2:llm_3").

clinical_notes(12345, "Patient presents with elevated blood pressure...").
```

