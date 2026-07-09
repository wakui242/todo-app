# Draft tasks.md

## High Priority

### T001: Set up project structure and virtual environment

- **Priority:** High
- **Estimated effort:** 0.5 hours
- **Dependencies:** None
- **Description:** Create the directory structure (app.py, data/, templates/, static/css/, static/js/) and set up Python virtual environment with Flask.

### T002: Create requirements.txt

- **Priority:** High
- **Estimated effort:** 0.25 hours
- **Dependencies:** None
- **Description:** Create requirements.txt with Flask as the only dependency.

### T003: Implement data loading and saving functions

- **Priority:** High
- **Estimated effort:** 0.5 hours
- **Dependencies:** T001
- **Description:** Implement load_todos() and save_todos() functions in app.py with proper error handling for file I/O.

### T004: Implement GET / endpoint

- **Priority:** High
- **Estimated effort:** 0.25 hours
- **Dependencies:** T001
- **Description:** Create the root route to render and return the index.html template.

### T005: Implement GET /api/todos endpoint

- **Priority:** High
- **Estimated effort:** 0.5 hours
- **Dependencies:** T003
- **Description:** Create the API endpoint to return all tasks from todos.json as JSON.

### T006: Implement POST /api/todos endpoint

- **Priority:** High
- **Estimated effort:** 0.75 hours
- **Dependencies:** T003
- **Description:** Create the API endpoint to add new tasks with validation for empty/whitespace-only titles.

### T007: Implement PUT /api/todos/<id> endpoint

- **Priority:** High
- **Estimated effort:** 0.5 hours
- **Dependencies:** T003
- **Description:** Create the API endpoint to toggle task completion status with 404 error handling for non-existent IDs.

### T008: Implement DELETE /api/todos/<id> endpoint

- **Priority:** High
- **Estimated effort:** 0.5 hours
- **Dependencies:** T003
- **Description:** Create the API endpoint to delete tasks with 404 error handling for non-existent IDs.

### T009: Create index.html template

- **Priority:** High
- **Estimated effort:** 0.75 hours
- **Dependencies:** T001
- **Description:** Create the HTML template with input field, add button, and separate areas for incomplete and completed task lists.

## Medium Priority

### T010: Implement main.js - load and display tasks

- **Priority:** Medium
- **Estimated effort:** 0.75 hours
- **Dependencies:** T005, T009
- **Description:** Implement JavaScript to fetch tasks on page load and display them in separate sections for incomplete and completed.

### T011: Implement main.js - add task functionality

- **Priority:** Medium
- **Estimated effort:** 0.5 hours
- **Dependencies:** T006, T010
- **Description:** Implement JavaScript to handle form submission and add new tasks via the API.

### T012: Implement main.js - toggle completion functionality

- **Priority:** Medium
- **Estimated effort:** 0.5 hours
- **Dependencies:** T007, T010
- **Description:** Implement JavaScript to handle click events for toggling task completion status.

### T013: Implement main.js - delete task functionality

- **Priority:** Medium
- **Estimated effort:** 0.5 hours
- **Dependencies:** T008, T010
- **Description:** Implement JavaScript to handle click events for deleting tasks.

### T014: Create style.css

- **Priority:** Medium
- **Estimated effort:** 0.5 hours
- **Dependencies:** T009
- **Description:** Create CSS styles to visually distinguish completed tasks (strikethrough, gray color) and basic layout.

### T015: Manual testing and verification

- **Priority:** Medium
- **Estimated effort:** 0.5 hours
- **Dependencies:** T010, T011, T012, T013, T014
- **Description:** Test all features in browser: add, toggle, delete, persistence, and error handling.

## Low Priority

### T016: Create README.md

- **Priority:** Low
- **Estimated effort:** 0.5 hours
- **Dependencies:** All above
- **Description:** Create project documentation explaining how to set up and run the application.
