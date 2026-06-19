const PUZZLES = {
    beginner: [
        // B1: Simple 2x3 rectangle
        {
            id: "b1",
            gridSize: { rows: 2, cols: 3 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 5, label: "= 5" } },
                { id: 1, color: "#d4f0d4", cells: [[0,2],[1,2]], condition: { type: "equal", label: "==" } },
                { id: 2, color: "#fdf3d0", cells: [[1,0],[1,1]], condition: { type: "lessThan", label: "<" } }
            ],
            dominoes: [[2,3],[4,4],[1,5]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:2,half:0}, 4:{domino:2,half:1}, 5:{domino:1,half:1} }
        },
        // B2: L-shape (3x2 with corner missing)
        {
            id: "b2",
            gridSize: { rows: 3, cols: 2 },
            regions: [
                { id: 0, color: "#f9d4e6", cells: [[0,0],[0,1]], condition: { type: "sum", value: 7, label: "= 7" } },
                { id: 1, color: "#d4e6f9", cells: [[1,0],[1,1]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#e4d4f9", cells: [[2,0]], condition: { type: "odd", label: "Odd" } }
            ],
            dominoes: [[3,4],[5,2],[3]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 4:{domino:2,half:0} }
        },
        // B3: 2x3 rectangle
        {
            id: "b3",
            gridSize: { rows: 2, cols: 3 },
            regions: [
                { id: 0, color: "#d4f0ef", cells: [[0,0],[0,1],[0,2]], condition: { type: "sum", value: 9, label: "= 9" } },
                { id: 1, color: "#fdf3d0", cells: [[1,0],[1,1],[1,2]], condition: { type: "lessThan", label: "<" } }
            ],
            dominoes: [[4,2],[1,3],[5,6]],
            solution: { 0:{domino:0,half:0}, 1:{domino:2,half:0}, 2:{domino:1,half:1}, 3:{domino:0,half:1}, 4:{domino:2,half:1}, 5:{domino:1,half:0} }
        },
        // B4: T-shape (top row 3, bottom row center only)
        {
            id: "b4",
            gridSize: { rows: 3, cols: 3 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 6, label: "= 6" } },
                { id: 1, color: "#d4f0d4", cells: [[0,2],[1,2]], condition: { type: "even", label: "Even" } },
                { id: 2, color: "#fdf3d0", cells: [[1,1],[2,1]], condition: { type: "notEqual", label: "≠" } }
            ],
            dominoes: [[2,4],[6,0],[3,1]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 4:{domino:2,half:0}, 5:{domino:1,half:1}, 7:{domino:2,half:1} }
        },
        // B5: Small cross shape
        {
            id: "b5",
            gridSize: { rows: 3, cols: 3 },
            regions: [
                { id: 0, color: "#e4d4f9", cells: [[0,1],[1,1]], condition: { type: "sum", value: 8, label: "= 8" } },
                { id: 1, color: "#f9d4e6", cells: [[1,0],[2,0]], condition: { type: "lessThan", label: "<" } },
                { id: 2, color: "#d4f0ef", cells: [[1,2],[2,2]], condition: { type: "greaterThan", label: ">" } }
            ],
            dominoes: [[3,5],[1,4],[6,2]],
            solution: { 1:{domino:0,half:0}, 3:{domino:1,half:0}, 4:{domino:0,half:1}, 5:{domino:2,half:0}, 6:{domino:1,half:1}, 8:{domino:2,half:1} }
        }
    ],
    easy: [
        // E1: 2x4 rectangle
        {
            id: "e1",
            gridSize: { rows: 2, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 6, label: "= 6" } },
                { id: 1, color: "#d4f0d4", cells: [[0,2],[0,3]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#fdf3d0", cells: [[1,0],[1,1]], condition: { type: "equal", label: "==" } },
                { id: 3, color: "#f9d4e6", cells: [[1,2],[1,3]], condition: { type: "lessThan", label: "<" } }
            ],
            dominoes: [[1,5],[4,2],[3,3],[0,6]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 4:{domino:2,half:0}, 5:{domino:2,half:1}, 6:{domino:3,half:0}, 7:{domino:3,half:1} }
        },
        // E2: L-shape (big)
        {
            id: "e2",
            gridSize: { rows: 3, cols: 3 },
            regions: [
                { id: 0, color: "#e4d4f9", cells: [[0,0],[0,1],[0,2]], condition: { type: "sum", value: 10, label: "= 10" } },
                { id: 1, color: "#d4f0ef", cells: [[1,0],[2,0]], condition: { type: "equal", label: "==" } },
                { id: 2, color: "#f9e0d4", cells: [[2,1],[2,2]], condition: { type: "sum", value: 7, label: "= 7" } }
            ],
            dominoes: [[3,4],[5,5],[3,4]],
            solution: { 0:{domino:1,half:0}, 1:{domino:0,half:0}, 2:{domino:0,half:1}, 3:{domino:1,half:1}, 7:{domino:2,half:0}, 8:{domino:2,half:1} }
        },
        // E3: Z/S shape
        {
            id: "e3",
            gridSize: { rows: 3, cols: 3 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "odd", label: "Odd" } },
                { id: 1, color: "#fdf3d0", cells: [[1,1],[1,2]], condition: { type: "sum", value: 9, label: "= 9" } },
                { id: 2, color: "#d4f0d4", cells: [[2,1],[2,2]], condition: { type: "even", label: "Even" } }
            ],
            dominoes: [[3,5],[6,3],[4,2]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 4:{domino:1,half:0}, 5:{domino:1,half:1}, 7:{domino:2,half:0}, 8:{domino:2,half:1} }
        },
        // E4: Plus/cross shape
        {
            id: "e4",
            gridSize: { rows: 3, cols: 3 },
            regions: [
                { id: 0, color: "#f9d4e6", cells: [[0,1],[1,1]], condition: { type: "sum", value: 10, label: "= 10" } },
                { id: 1, color: "#d4e6f9", cells: [[1,0],[2,0]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#fdf3d0", cells: [[1,2],[2,2]], condition: { type: "lessThan", label: "<" } },
                { id: 3, color: "#e4d4f9", cells: [[2,1]], condition: { type: "even", label: "Even" } }
            ],
            dominoes: [[4,6],[5,1],[2,4],[6]],
            solution: { 1:{domino:0,half:0}, 3:{domino:1,half:0}, 4:{domino:0,half:1}, 5:{domino:2,half:0}, 6:{domino:1,half:1}, 7:{domino:3,half:0}, 8:{domino:2,half:1} }
        },
        // E5: Wide T-shape
        {
            id: "e5",
            gridSize: { rows: 3, cols: 4 },
            regions: [
                { id: 0, color: "#d4f0ef", cells: [[0,0],[0,1],[0,2],[0,3]], condition: { type: "sum", value: 12, label: "= 12" } },
                { id: 1, color: "#fdf3d0", cells: [[1,1],[1,2]], condition: { type: "notEqual", label: "≠" } },
                { id: 2, color: "#f9d4e6", cells: [[2,1],[2,2]], condition: { type: "equal", label: "==" } }
            ],
            dominoes: [[2,4],[6,0],[5,5],[1,3]],
            solution: { 0:{domino:3,half:0}, 1:{domino:0,half:0}, 2:{domino:0,half:1}, 3:{domino:3,half:1}, 5:{domino:1,half:0}, 6:{domino:1,half:1}, 9:{domino:2,half:0}, 10:{domino:2,half:1} }
        }
    ],
    medium: [
        // M1: Diamond shape
        {
            id: "m1",
            gridSize: { rows: 5, cols: 3 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,1],[1,1]], condition: { type: "sum", value: 7, label: "= 7" } },
                { id: 1, color: "#d4f0d4", cells: [[1,0],[2,0]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#fdf3d0", cells: [[1,2],[2,2]], condition: { type: "lessThan", label: "<" } },
                { id: 3, color: "#f9d4e6", cells: [[2,1],[3,1]], condition: { type: "equal", label: "==" } },
                { id: 4, color: "#e4d4f9", cells: [[3,0],[4,1]], condition: { type: "odd", label: "Odd" } },
                { id: 5, color: "#d4f0ef", cells: [[3,2]], condition: { type: "even", label: "Even" } }
            ],
            dominoes: [[3,4],[6,1],[2,5],[3,3],[5],[4]],
            solution: { 1:{domino:0,half:0}, 3:{domino:1,half:0}, 4:{domino:0,half:1}, 5:{domino:2,half:0}, 6:{domino:1,half:1}, 7:{domino:3,half:0}, 8:{domino:2,half:1}, 9:{domino:4,half:0}, 10:{domino:3,half:1}, 11:{domino:5,half:0}, 13:{domino:4,half:1} }
        },
        // M2: U-shape
        {
            id: "m2",
            gridSize: { rows: 3, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 7, label: "= 7" } },
                { id: 1, color: "#d4f0d4", cells: [[0,2],[0,3]], condition: { type: "lessThan", label: "<" } },
                { id: 2, color: "#fdf3d0", cells: [[1,0],[2,0]], condition: { type: "equal", label: "==" } },
                { id: 3, color: "#f9d4e6", cells: [[1,3],[2,3]], condition: { type: "greaterThan", label: ">" } },
                { id: 4, color: "#e4d4f9", cells: [[2,1],[2,2]], condition: { type: "sum", value: 9, label: "= 9" } }
            ],
            dominoes: [[3,4],[2,5],[4,4],[6,1],[3,6]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 4:{domino:2,half:0}, 7:{domino:3,half:0}, 8:{domino:2,half:1}, 9:{domino:4,half:0}, 10:{domino:4,half:1}, 11:{domino:3,half:1} }
        },
        // M3: Big L-shape
        {
            id: "m3",
            gridSize: { rows: 4, cols: 3 },
            regions: [
                { id: 0, color: "#f9e0d4", cells: [[0,0],[0,1]], condition: { type: "sum", value: 8, label: "= 8" } },
                { id: 1, color: "#d4f0d4", cells: [[1,0],[1,1]], condition: { type: "notEqual", label: "≠" } },
                { id: 2, color: "#d4e6f9", cells: [[2,0],[2,1],[2,2]], condition: { type: "sum", value: 12, label: "= 12" } },
                { id: 3, color: "#f9d4e6", cells: [[3,0],[3,1],[3,2]], condition: { type: "greaterThan", label: ">" } }
            ],
            dominoes: [[3,5],[4,2],[6,5],[1,4],[3,0]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 3:{domino:1,half:0}, 4:{domino:1,half:1}, 6:{domino:2,half:0}, 7:{domino:3,half:0}, 8:{domino:3,half:1}, 9:{domino:2,half:1}, 10:{domino:4,half:0}, 11:{domino:4,half:1} }
        },
        // M4: Cross shape (large)
        {
            id: "m4",
            gridSize: { rows: 5, cols: 5 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,2],[1,2]], condition: { type: "sum", value: 9, label: "= 9" } },
                { id: 1, color: "#d4f0d4", cells: [[1,1],[2,1]], condition: { type: "even", label: "Even" } },
                { id: 2, color: "#fdf3d0", cells: [[2,0],[2,1]], condition: { type: "sum", value: 6, label: "= 6" } },
                { id: 3, color: "#f9d4e6", cells: [[2,2],[2,3]], condition: { type: "greaterThan", label: ">" } },
                { id: 4, color: "#e4d4f9", cells: [[2,3],[2,4]], condition: { type: "lessThan", label: "<" } },
                { id: 5, color: "#d4f0ef", cells: [[3,2],[4,2]], condition: { type: "odd", label: "Odd" } },
                { id: 6, color: "#f9e0d4", cells: [[1,3],[1,2]], condition: { type: "notEqual", label: "≠" } }
            ],
            dominoes: [[4,5],[2,4],[6,0],[5,3],[1,6]],
            solution: { 2:{domino:0,half:0}, 7:{domino:0,half:1}, 6:{domino:1,half:0}, 11:{domino:1,half:1}, 10:{domino:2,half:0}, 12:{domino:3,half:0}, 13:{domino:3,half:1}, 14:{domino:4,half:0}, 17:{domino:4,half:1}, 22:{domino:2,half:1} }
        },
        // M5: Staircase shape
        {
            id: "m5",
            gridSize: { rows: 4, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 5, label: "= 5" } },
                { id: 1, color: "#d4f0d4", cells: [[1,1],[1,2]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#fdf3d0", cells: [[2,2],[2,3]], condition: { type: "equal", label: "==" } },
                { id: 3, color: "#f9d4e6", cells: [[3,3]], condition: { type: "even", label: "Even" } },
                { id: 4, color: "#e4d4f9", cells: [[1,0],[2,0]], condition: { type: "odd", label: "Odd" } }
            ],
            dominoes: [[2,3],[6,4],[5,5],[4],[1,3]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 4:{domino:4,half:0}, 5:{domino:1,half:0}, 6:{domino:1,half:1}, 8:{domino:4,half:1}, 10:{domino:2,half:0}, 11:{domino:2,half:1}, 15:{domino:3,half:0} }
        }
    ],
    hard: [
        // H1: Arrow shape pointing right
        {
            id: "h1",
            gridSize: { rows: 5, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,1],[0,2]], condition: { type: "sum", value: 8, label: "= 8" } },
                { id: 1, color: "#d4f0d4", cells: [[1,0],[1,1]], condition: { type: "lessThan", label: "<" } },
                { id: 2, color: "#fdf3d0", cells: [[1,2],[1,3]], condition: { type: "greaterThan", label: ">" } },
                { id: 3, color: "#f9d4e6", cells: [[2,0],[2,1],[2,2],[2,3]], condition: { type: "sum", value: 16, label: "= 16" } },
                { id: 4, color: "#e4d4f9", cells: [[3,0],[3,1]], condition: { type: "equal", label: "==" } },
                { id: 5, color: "#d4f0ef", cells: [[3,2],[3,3]], condition: { type: "odd", label: "Odd" } },
                { id: 6, color: "#f9e0d4", cells: [[4,1],[4,2]], condition: { type: "notEqual", label: "≠" } }
            ],
            dominoes: [[3,5],[2,4],[6,5],[3,3],[5,1],[4,2],[1,6]],
            solution: { 1:{domino:0,half:0}, 2:{domino:0,half:1}, 4:{domino:1,half:0}, 5:{domino:1,half:1}, 6:{domino:6,half:0}, 7:{domino:6,half:1}, 8:{domino:2,half:0}, 9:{domino:2,half:1}, 10:{domino:3,half:0}, 11:{domino:3,half:1}, 12:{domino:4,half:0}, 13:{domino:4,half:1}, 14:{domino:5,half:0}, 15:{domino:5,half:1}, 17:{domino:6,half:0}, 18:{domino:6,half:1} }
        },
        // H2: Donut / ring shape (4x4 with center empty)
        {
            id: "h2",
            gridSize: { rows: 4, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1],[0,2],[0,3]], condition: { type: "sum", value: 14, label: "= 14" } },
                { id: 1, color: "#d4f0d4", cells: [[1,0],[2,0]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#fdf3d0", cells: [[1,3],[2,3]], condition: { type: "lessThan", label: "<" } },
                { id: 3, color: "#f9d4e6", cells: [[3,0],[3,1],[3,2],[3,3]], condition: { type: "sum", value: 10, label: "= 10" } }
            ],
            dominoes: [[4,2],[6,5],[3,1],[5,0],[2,3],[4,1]],
            solution: { 0:{domino:1,half:0}, 1:{domino:1,half:1}, 2:{domino:0,half:0}, 3:{domino:0,half:1}, 4:{domino:2,half:0}, 7:{domino:4,half:0}, 8:{domino:2,half:1}, 11:{domino:4,half:1}, 12:{domino:3,half:0}, 13:{domino:3,half:1}, 14:{domino:5,half:0}, 15:{domino:5,half:1} }
        },
        // H3: H-shape
        {
            id: "h3",
            gridSize: { rows: 3, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[1,0]], condition: { type: "sum", value: 9, label: "= 9" } },
                { id: 1, color: "#d4f0d4", cells: [[0,3],[1,3]], condition: { type: "notEqual", label: "≠" } },
                { id: 2, color: "#fdf3d0", cells: [[1,1],[1,2]], condition: { type: "even", label: "Even" } },
                { id: 3, color: "#f9d4e6", cells: [[2,0],[2,1]], condition: { type: "greaterThan", label: ">" } },
                { id: 4, color: "#e4d4f9", cells: [[2,2],[2,3]], condition: { type: "sum", value: 7, label: "= 7" } }
            ],
            dominoes: [[3,6],[4,5],[2,4],[6,2],[1,3]],
            solution: { 0:{domino:0,half:0}, 3:{domino:1,half:0}, 4:{domino:0,half:1}, 5:{domino:2,half:0}, 6:{domino:2,half:1}, 7:{domino:1,half:1}, 8:{domino:3,half:0}, 9:{domino:3,half:1}, 10:{domino:4,half:0}, 11:{domino:4,half:1} }
        },
        // H4: Zigzag shape
        {
            id: "h4",
            gridSize: { rows: 4, cols: 3 },
            regions: [
                { id: 0, color: "#d4f0ef", cells: [[0,0],[0,1]], condition: { type: "odd", label: "Odd" } },
                { id: 1, color: "#d4e6f9", cells: [[1,1],[1,2]], condition: { type: "sum", value: 8, label: "= 8" } },
                { id: 2, color: "#fdf3d0", cells: [[2,0],[2,1]], condition: { type: "lessThan", label: "<" } },
                { id: 3, color: "#f9d4e6", cells: [[3,1],[3,2]], condition: { type: "greaterThan", label: ">" } }
            ],
            dominoes: [[3,5],[2,6],[0,4],[5,1]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 4:{domino:1,half:0}, 5:{domino:1,half:1}, 6:{domino:2,half:0}, 7:{domino:2,half:1}, 10:{domino:3,half:0}, 11:{domino:3,half:1} }
        },
        // H5: T-shape (wide)
        {
            id: "h5",
            gridSize: { rows: 4, cols: 5 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 6, label: "= 6" } },
                { id: 1, color: "#d4f0d4", cells: [[0,2],[0,3]], condition: { type: "equal", label: "==" } },
                { id: 2, color: "#fdf3d0", cells: [[0,4],[1,4]], condition: { type: "notEqual", label: "≠" } },
                { id: 3, color: "#f9d4e6", cells: [[1,2],[2,2]], condition: { type: "sum", value: 11, label: "= 11" } },
                { id: 4, color: "#e4d4f9", cells: [[3,2],[3,3]], condition: { type: "odd", label: "Odd" } }
            ],
            dominoes: [[1,5],[4,4],[3,2],[5,6],[3,1]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 4:{domino:2,half:0}, 7:{domino:3,half:0}, 9:{domino:2,half:1}, 12:{domino:3,half:1}, 17:{domino:4,half:0}, 18:{domino:4,half:1} }
        }
    ],
    expert: [
        // X1: Large diamond
        {
            id: "x1",
            gridSize: { rows: 5, cols: 5 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,2],[1,2]], condition: { type: "sum", value: 10, label: "= 10" } },
                { id: 1, color: "#d4f0d4", cells: [[1,1],[2,1]], condition: { type: "greaterThan", label: ">" } },
                { id: 2, color: "#fdf3d0", cells: [[1,3],[2,3]], condition: { type: "lessThan", label: "<" } },
                { id: 3, color: "#f9d4e6", cells: [[2,0],[3,0]], condition: { type: "odd", label: "Odd" } },
                { id: 4, color: "#e4d4f9", cells: [[2,2],[3,2]], condition: { type: "equal", label: "==" } },
                { id: 5, color: "#d4f0ef", cells: [[2,4],[3,4]], condition: { type: "even", label: "Even" } },
                { id: 6, color: "#f9e0d4", cells: [[3,1],[3,3]], condition: { type: "sum", value: 7, label: "= 7" } },
                { id: 7, color: "#d4e6f9", cells: [[4,2]], condition: { type: "odd", label: "Odd" } }
            ],
            dominoes: [[4,6],[5,2],[3,4],[1,5],[6,6],[3],[5]],
            solution: { 2:{domino:0,half:0}, 7:{domino:0,half:1}, 6:{domino:1,half:0}, 8:{domino:2,half:0}, 10:{domino:3,half:0}, 11:{domino:1,half:1}, 12:{domino:4,half:0}, 13:{domino:2,half:1}, 14:{domino:3,half:1}, 15:{domino:5,half:0}, 16:{domino:4,half:1}, 17:{domino:5,half:1}, 18:{domino:6,half:0}, 22:{domino:6,half:1} }
        },
        // X2: 4x4 full grid
        {
            id: "x2",
            gridSize: { rows: 4, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1],[0,2],[0,3]], condition: { type: "sum", value: 20, label: "= 20" } },
                { id: 1, color: "#fdf3d0", cells: [[1,0],[1,1]], condition: { type: "lessThan", label: "<" } },
                { id: 2, color: "#d4f0d4", cells: [[1,2],[1,3]], condition: { type: "sum", value: 7, label: "= 7" } },
                { id: 3, color: "#f9d4e6", cells: [[2,0],[2,1],[3,0],[3,1]], condition: { type: "sum", value: 8, label: "= 8" } },
                { id: 4, color: "#e4d4f9", cells: [[2,2],[2,3],[3,2],[3,3]], condition: { type: "sum", value: 15, label: "= 15" } }
            ],
            dominoes: [[6,5],[4,6],[3,4],[1,5],[0,3],[2,4],[5,1],[2,6]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 4:{domino:3,half:0}, 5:{domino:3,half:1}, 6:{domino:2,half:0}, 7:{domino:2,half:1}, 8:{domino:4,half:0}, 9:{domino:4,half:1}, 10:{domino:5,half:0}, 11:{domino:5,half:1}, 12:{domino:6,half:0}, 13:{domino:6,half:1}, 14:{domino:7,half:0}, 15:{domino:7,half:1} }
        },
        // X3: C-shape
        {
            id: "x3",
            gridSize: { rows: 4, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1],[0,2],[0,3]], condition: { type: "sum", value: 14, label: "= 14" } },
                { id: 1, color: "#d4f0d4", cells: [[1,0],[2,0]], condition: { type: "equal", label: "==" } },
                { id: 2, color: "#fdf3d0", cells: [[3,0],[3,1],[3,2],[3,3]], condition: { type: "sum", value: 18, label: "= 18" } }
            ],
            dominoes: [[2,4],[6,3],[5,5],[4,6],[5,3]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 4:{domino:2,half:0}, 8:{domino:2,half:1}, 12:{domino:3,half:0}, 13:{domino:3,half:1}, 14:{domino:4,half:0}, 15:{domino:4,half:1} }
        },
        // X4: Irregular blob
        {
            id: "x4",
            gridSize: { rows: 4, cols: 5 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,1],[0,2],[0,3]], condition: { type: "sum", value: 12, label: "= 12" } },
                { id: 1, color: "#d4f0d4", cells: [[1,0],[1,1]], condition: { type: "notEqual", label: "≠" } },
                { id: 2, color: "#fdf3d0", cells: [[1,2],[1,3],[1,4]], condition: { type: "greaterThan", label: ">" } },
                { id: 3, color: "#f9d4e6", cells: [[2,0],[2,1]], condition: { type: "sum", value: 5, label: "= 5" } },
                { id: 4, color: "#e4d4f9", cells: [[2,3],[2,4]], condition: { type: "odd", label: "Odd" } },
                { id: 5, color: "#d4f0ef", cells: [[3,1],[3,2],[3,3]], condition: { type: "sum", value: 11, label: "= 11" } }
            ],
            dominoes: [[3,5],[4,6],[2,3],[5,3],[1,3],[6,4],[5,1]],
            solution: { 1:{domino:0,half:0}, 2:{domino:1,half:0}, 3:{domino:0,half:1}, 5:{domino:4,half:0}, 6:{domino:4,half:1}, 7:{domino:2,half:0}, 8:{domino:1,half:1}, 9:{domino:2,half:1}, 10:{domino:3,half:0}, 11:{domino:3,half:1}, 13:{domino:5,half:0}, 14:{domino:5,half:1}, 16:{domino:6,half:0}, 17:{domino:6,half:1}, 18:{domino:6,half:0} }
        },
        // X5: Tetris S-piece (large)
        {
            id: "x5",
            gridSize: { rows: 4, cols: 4 },
            regions: [
                { id: 0, color: "#d4e6f9", cells: [[0,0],[0,1]], condition: { type: "sum", value: 9, label: "= 9" } },
                { id: 1, color: "#d4f0d4", cells: [[0,2],[0,3]], condition: { type: "even", label: "Even" } },
                { id: 2, color: "#fdf3d0", cells: [[1,2],[1,3]], condition: { type: "sum", value: 5, label: "= 5" } },
                { id: 3, color: "#f9d4e6", cells: [[2,0],[2,1]], condition: { type: "greaterThan", label: ">" } },
                { id: 4, color: "#e4d4f9", cells: [[2,2],[3,2]], condition: { type: "notEqual", label: "≠" } },
                { id: 5, color: "#d4f0ef", cells: [[3,0],[3,1]], condition: { type: "odd", label: "Odd" } }
            ],
            dominoes: [[3,6],[4,2],[1,4],[5,1],[3,2],[5,3]],
            solution: { 0:{domino:0,half:0}, 1:{domino:0,half:1}, 2:{domino:1,half:0}, 3:{domino:1,half:1}, 6:{domino:2,half:0}, 7:{domino:2,half:1}, 8:{domino:3,half:0}, 9:{domino:3,half:1}, 10:{domino:4,half:0}, 12:{domino:5,half:0}, 13:{domino:5,half:1}, 14:{domino:4,half:1} }
        }
    ]
};
