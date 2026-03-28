# AGENT GUIDELINES (MANDATORY)

## Core Rule

After ANY code change, you MUST update all relevant documentation and system files.

---

## Required Updates (NON-OPTIONAL)

### 1. Architecture

* File: /docs/architecture.md
* Update when:

  * changing system design
  * adding/removing components
  * modifying APIs or data flow

---

### 2. Features

* File: /docs/features.md
* Update when:

  * adding/modifying user-facing behavior
  * changing business logic

---

### 3. Database

* File: /docs/database.md
* Update when:

  * schema changes
  * new fields or models
  * data flow changes

---

### 4. Config

* File: /config/config.json
* Rules:

  * ALL configs must live here
  * NO hardcoding in code

---

### 5. Logging

* Add logging for:

  * key actions
  * errors
  * debugging flows

* Logs must be written to:
  /logs/

---

### 6. Progress Tracking

* Folder: /z_progress/

* Rule:

  * Create or update ONE file per day
  * Format: YYYYMMDD_description.md

* Must include:

  * what was changed
  * why it was changed
  * any assumptions

---

## Enforcement Behavior

If you modify code but do NOT update the above:
→ The task is considered INCOMPLETE

---

## Implementation Notes

* Prefer simple, readable solutions
* Do not over-engineer
* Keep consistency with existing architecture

---

## Priority Order

1. Correctness
2. Maintainability
3. Documentation completeness
4. Performance

---

## Final Step (MANDATORY)

Before finishing ANY task:
✔ Verify all required files are updated
✔ Ensure no missing documentation
✔ Ensure logs/configs follow rules
