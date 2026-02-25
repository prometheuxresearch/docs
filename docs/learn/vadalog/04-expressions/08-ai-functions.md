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
- `selected_models=<models>` - Semicolon-separated list of models to use (e.g., `gpt-4o;gpt-4o-mini`)
- `num_partitions=<N>` - Manual partition override

**Supported Output Types:** `string`, `int`, `integer`, `long`, `double`, `float`, `number`, `boolean`, `bool`, `list<string>`, `list<int>`, `list<double>`, `set<string>`

**Prompt Templating:** Use `{arg_1}`, `{arg_2}`, etc. to reference input columns (1-based indexing).

#### Model Selection with `selected_models`

By default, `#LLM` uses all configured LLM endpoints. Use `selected_models` to filter which model types to use:

```prolog
% Use only gpt-4o endpoints (skip slower/experimental models)
answer(Q, A) :- 
    #LLM(question, "prompt=Answer: {arg_1},selected_models=gpt-4o").

% Use multiple model types
fast_analysis(Q, A) :- 
    #LLM(question, "prompt=Analyze: {arg_1},selected_models=gpt-4o;gpt-4o-mini").
```

**Supported models:** `gpt-4o`, `gpt-4o-mini`, `gpt-5-nano`, `gpt-5-mini`, `gpt-4.1-nano`, `gpt-4.1-mini`, and others configured in your environment.

**Use cases:**
- **Performance optimization:** Route simple queries to faster models (`gpt-4o-mini`)
- **Quality control:** Use only high-quality models (`gpt-4o`) for critical analysis
- **Cost optimization:** Balance speed and cost across model tiers
- **Model testing:** Test specific models without changing configuration

If `selected_models` is not specified, all configured endpoints are used for maximum parallelization.

#### Why `num_partitions` is Optional

Prometheux automatically handles optimal partitioning based on your data source, especially if it is already partitioned.
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

### Example 5: Model Selection for Optimal Performance

Choose specific models based on your quality, speed, and cost requirements:

```prolog
% High-quality analysis: Use only gpt-4o
detailed_analysis(Doc, Analysis) :- 
    #LLM(documents, 
        "prompt=Provide a detailed analysis of: {arg_1},
         output_type=string,
         selected_models=gpt-4o").

% Fast classification: Use faster models for simple tasks
quick_category(Text, Category) :- 
    #LLM(items, 
        "prompt=Classify this into one category: {arg_1},
         output_type=string,
         selected_models=gpt-4o-mini").

% Balanced approach: Use multiple model types
balanced_processing(Data, Result) :- 
    #LLM(dataset, 
        "prompt=Process: {arg_1},
         output_type=string,
         selected_models=gpt-4o;gpt-4o-mini").
```

**Why use `selected_models`:**
- Filter out slower or experimental models (e.g., exclude `gpt-5-nano` preview models)
- Route high-priority queries to premium models (`gpt-4o`)
- Route high-volume queries to cost-effective models (`gpt-4o-mini`)
- Test specific models without changing system configuration

---

### Example 6: Processing Large Datasets (Advanced)

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

Classify large volumes of text in parallel with optimized model selection:

```prolog
% Classify customer feedback at scale using fast models
classify_feedback(FeedbackID, Text, Category, IsUrgent) :- 
    #LLM(feedback, 
        "prompt_1=Classify this feedback as positive, neutral, or negative: {arg_2},
         prompt_2=Is this feedback urgent? Answer yes or no: {arg_2},
         output_type_1=string,
         output_type_2=string,
         selected_models=gpt-4o;gpt-4o-mini").

% Input data:
feedback(1, "Excellent service, very happy!").
feedback(2, "URGENT: Product stopped working immediately").
```

### Data Enrichment

Generate missing information for entire datasets with quality-focused model selection:

```prolog
% Enrich product catalog with AI-generated content using high-quality models
enrich_product(ProductID, Name, Category, Description, TargetAge, Keywords) :- 
    #LLM(product, 
        "prompt_1=Generate a marketing description for {arg_2} in {arg_3} category,
         prompt_2=What age group is {arg_2} best suited for? Answer with a number (e.g., 25),
         prompt_3=List 3 keywords for {arg_2},
         output_type_1=string,
         output_type_2=int,
         output_type_3=string,
         selected_models=gpt-4o").

% Automatically processes entire product catalog in parallel
product(101, "Smart Watch Pro", "Electronics").
product(102, "Yoga Mat Premium", "Fitness").
product(103, "Coffee Maker Deluxe", "Home Appliances").
```

### Healthcare Decision Support

Multi-faceted analysis of clinical data using high-quality models for critical healthcare decisions:

```prolog
% Analyze patient records with multiple AI insights using only gpt-4o
patient_analysis(PatientID, Notes, RiskLevel, Recommendations, FollowUpDays) :- 
    #LLM(clinical_notes, 
        "prompt_1=Assess risk level (low/medium/high) for: {arg_2},
         prompt_2=Provide 3 key recommendations for: {arg_2},
         prompt_3=How many days until follow-up? Answer with just a number for: {arg_2},
         output_type_1=string,
         output_type_2=string,
         output_type_3=int,
         projected_columns=arg_1:arg_2:llm_1:llm_2:llm_3,
         selected_models=gpt-4o").

clinical_notes(12345, "Patient presents with elevated blood pressure...").
```

**Note:** For healthcare and other critical applications, use `selected_models=gpt-4o` to ensure the highest quality and reliability.

