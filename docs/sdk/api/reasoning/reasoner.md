# reasoner

---
**Module**: `prometheux_chain.reasoning.reasoner`

Functions
---------

`reason(ontology: prometheux_chain.logic.Ontology.Ontology, bind_input_table: prometheux_chain.logic.BindTable.BindTable, bind_output_table: prometheux_chain.logic.BindTable.BindTable, for_explanation=False) ‑> prometheux_chain.reasoning.ReasoningResult.ReasoningResult`
:   Reasons over an ontology, retrieving facts from the bound inputs and
    deducing over the rules.