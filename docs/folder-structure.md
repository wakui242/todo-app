# Folder Structure

This repository is the Git-managed Todo app project.

Local path:

```text
/Users/local/Documents/todo-app
```

GitHub repository:

```text
https://github.com/wakui242/todo-app
```

## Main Files

```text
todo-app/
├── app.py
├── requirements.txt
├── README.md
├── data/
│   └── todos.json
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── docs/
│   ├── folder-structure.md
│   └── review-log-2026-06-12.md
└── .kiro/
    ├── specs/
    │   └── todo-app/
    │       ├── requirements.md
    │       ├── design.md
    │       ├── tasks.md
    │       └── tasks_cline.md
    └── steering/
        └── scope.md
```

## What Each Area Is For

- `app.py`: Flask backend and API endpoints.
- `templates/index.html`: Browser UI template.
- `static/css/style.css`: Page styling.
- `static/js/main.js`: Browser-side Todo behavior.
- `data/todos.json`: Saved Todo data.
- `.kiro/specs/todo-app/requirements.md`: Kiro requirements.
- `.kiro/specs/todo-app/design.md`: Kiro design.
- `.kiro/specs/todo-app/tasks.md`: Kiro task plan.
- `.kiro/specs/todo-app/tasks_cline.md`: Cline-generated task plan for comparison.
- `docs/`: Notes and review/report files for this repository.

## Local Backup Folder

The old non-Git working folder was kept as a backup:

```text
/Users/local/Documents/todo-app-original-nongit-20260709
```

Use `/Users/local/Documents/todo-app` for future Git work.
