# PittGPACalc

A simple command-line GPA calculator for University of Pittsburgh students. Got tired of using online calculators, so I made my own.

## Usage
```bash
python3 pittGPA.py exampleGrades.txt
```

## Formula
```
GPA = Total Quality Points ÷ Total Credits
Quality Points = Grade Value × Credits
```

## File Format
```
"Course Name" CREDITS GRADE
```

**Example:**
```
"Big Ideas in Computing" 4 A+
"Discrete Structures" 3 A
"Calculus 2" 4 B-
```

## Pitt Grade Scale

| Grade | Value | Grade | Value | Grade | Value |
|-------|-------|-------|-------|-------|-------|
| A+/A  | 4.00  | B     | 3.00  | C     | 2.00  |
| A-    | 3.75  | B-    | 2.75  | C-    | 1.75  |
| B+    | 3.25  | C+    | 2.25  | D-F   | ≤1.00 |

> **Note:** Exclude Transfer credits, S/NC grades, and In Progress courses.
