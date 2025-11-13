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
```

**Supported output types**: `string`, `int`, `double`, `boolean`, `list<string>`, `list<int>`, `list<double>`, `list<boolean>`

**Example:**
```prolog
% Generate dynamic content
product_description(Product, Description) :- 
    product(Product, Features, Price), 
    Description = llm:generate(
        "Create a marketing description for ${Product} with features ${Features} priced at ${Price}", 
        "string"
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

