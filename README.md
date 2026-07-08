# VectorShift Frontend Technical Assessment

A node-based pipeline builder built with React and FastAPI as part of the VectorShift frontend technical assessment.

This project focuses on building a reusable node system, improving UI consistency, adding smarter text node behavior, and integrating the frontend with a backend pipeline parser.

## Features

- Reusable node abstraction to reduce duplication across node components
- Five additional custom nodes to demonstrate extensibility
- Improved and consistent styling across the app
- Auto-resizing text node based on content
- Dynamic variable detection in text nodes using `{{variableName}}`
- Automatic handle generation for detected variables
- Frontend submission of nodes and edges to the backend
- Backend pipeline parsing with:
  - node count
  - edge count
  - DAG validation
- User-friendly alert showing pipeline analysis results

## Tech Stack

### Frontend
- React
- JavaScript
- React Flow

### Backend
- Python
- FastAPI

## Project Structure

```bash
frontend/
  src/
    nodes/
    submit.js
backend/
  main.py
```

## What I implemented

### 1. Node abstraction
Instead of creating every node by copying and editing an existing one, I introduced a reusable abstraction that makes it easier to define:
- node title
- content
- input/output handles
- custom styles
- node-specific configuration

This makes adding future node types much faster and keeps the codebase easier to maintain.

### 2. UI styling
I redesigned the provided frontend into a more polished and unified interface, aiming for:
- cleaner layout
- better visual hierarchy
- more consistent spacing and colors
- improved overall usability

### 3. Text node improvements
The text node was enhanced in two ways:
- it grows in width and height as the user types more content
- it detects variables written in the format `{{variableName}}`

For every valid variable found, a new input handle is created on the left side of the node.

Example:

```txt
Hello {{userName}}, your order {{orderId}} is ready.
```

This creates handles for:
- `userName`
- `orderId`

### 4. Backend integration
The submit flow was connected to the FastAPI backend.

When the user clicks submit:
- the frontend sends the current nodes and edges to `/pipelines/parse`
- the backend calculates:
  - `num_nodes`
  - `num_edges`
  - `is_dag`
- the frontend displays the result in an alert

## How to run locally

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
uvicorn main:app --reload
```

## Demo

Add your demo video link here once uploaded.

Example:
- LinkedIn demo post: [Add link]
- Video walkthrough: [Add link]

## Why this project matters

This project was a good exercise in:
- frontend component abstraction
- scalable UI architecture
- graph-based interaction design
- regex/state-driven UX logic
- frontend-backend integration
- validating graph structure as a DAG

## Notes

This repository is based on the assessment brief provided by VectorShift, with my own implementation and design decisions.

## Author

Priyanshu Sinha
[LinkedIn]((https://www.linkedin.com/in/priyanshu-sinhaa))  
[GitHub](your-github-url)
