(function() {
    'use strict';

    const $ = id => document.getElementById(id);
    const DIFFICULTIES = ['beginner','easy','medium','hard','expert'];

    let state = {
        currentDifficulty: null,
        currentStage: null,
        puzzle: null,
        grid: [],
        placedDominoes: {},
        selectedDomino: null,
        selectedOrientation: 'horizontal',
        hintsLeft: 3,
        timerInterval: null,
        seconds: 0,
        progress: loadProgress(),
        dragging: null
    };

    function loadProgress() {
        try {
            return JSON.parse(localStorage.getItem('pips_progress')) || {};
        } catch { return {}; }
    }

    function saveProgress() {
        localStorage.setItem('pips_progress', JSON.stringify(state.progress));
    }

    function getStageKey(diff, idx) { return `${diff}_${idx}`; }

    function init() {
        setupEventListeners();
        updateHomeScreen();
    }

    function setupEventListeners() {
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => selectDifficultyCard(card.dataset.difficulty));
        });
        $('backToHome').addEventListener('click', showHome);
        $('backToStages').addEventListener('click', () => showStages(state.currentDifficulty));
        $('helpBtn').addEventListener('click', () => $('helpModal').classList.add('active'));
        $('closeHelp').addEventListener('click', () => $('helpModal').classList.remove('active'));
        $('statsBtn').addEventListener('click', showStats);
        $('closeStats').addEventListener('click', () => $('statsModal').classList.remove('active'));
        $('checkBtn').addEventListener('click', checkSolution);
        $('clearBtn').addEventListener('click', clearGrid);
        $('resetBtn').addEventListener('click', clearGrid);
        $('hintBtn').addEventListener('click', useHint);
        $('nextPuzzleBtn').addEventListener('click', nextPuzzle);
        $('replayBtn').addEventListener('click', replayPuzzle);
        $('backHomeBtn').addEventListener('click', () => { $('winModal').classList.remove('active'); showHome(); });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        });

        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
        document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    // ─── Drag System ───

    function startDrag(dominoIndex, orientation, startX, startY, fromGrid) {
        if (state.placedDominoes[dominoIndex] !== undefined && !fromGrid) return;

        const domino = state.puzzle.dominoes[dominoIndex];
        const isVertical = orientation === 'vertical';

        const ghost = document.createElement('div');
        ghost.className = `domino-ghost ${isVertical ? 'vertical' : 'horizontal'}`;
        if (domino.length === 1) {
            ghost.innerHTML = `<div class="ghost-half">${renderPipsDom(domino[0])}</div>`;
            ghost.classList.add('single-tile');
        } else {
            ghost.innerHTML = `
                <div class="ghost-half">${renderPipsDom(domino[0])}</div>
                <div class="ghost-half">${renderPipsDom(domino[1])}</div>
            `;
        }
        document.body.appendChild(ghost);

        state.dragging = {
            dominoIndex,
            orientation,
            ghost,
            fromGrid
        };

        positionGhost(ghost, startX, startY, isVertical);

        if (fromGrid) {
            removeDominoFromGrid(dominoIndex);
            updateGridDisplay();
            updateTrayDisplay();
            updateConditions();
        }
    }

    function positionGhost(ghost, x, y, isVertical) {
        const halfW = isVertical ? 35 : 55;
        const halfH = isVertical ? 55 : 35;
        ghost.style.left = (x - halfW) + 'px';
        ghost.style.top = (y - halfH) + 'px';
    }

    function handleGlobalMouseMove(e) {
        if (!state.dragging) return;
        const { ghost, orientation } = state.dragging;
        positionGhost(ghost, e.clientX, e.clientY, orientation === 'vertical');
        highlightDropTarget(e.clientX, e.clientY);
    }

    function handleGlobalTouchMove(e) {
        if (!state.dragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const { ghost, orientation } = state.dragging;
        positionGhost(ghost, touch.clientX, touch.clientY, orientation === 'vertical');
        highlightDropTarget(touch.clientX, touch.clientY);
    }

    function handleGlobalMouseUp(e) {
        if (!state.dragging) return;
        finishDrag(e.clientX, e.clientY);
    }

    function handleGlobalTouchEnd(e) {
        if (!state.dragging) return;
        const touch = e.changedTouches[0];
        finishDrag(touch.clientX, touch.clientY);
    }

    function finishDrag(x, y) {
        const { dominoIndex, orientation, ghost, fromGrid } = state.dragging;
        ghost.remove();
        clearHighlights();

        const cell = getCellAtPoint(x, y);
        if (cell) {
            const placed = tryPlaceDomino(dominoIndex, orientation, cell);
            if (!placed && fromGrid) {
                // failed to place, domino goes back to tray
            }
        }

        state.dragging = null;
        updateGridDisplay();
        updateTrayDisplay();
        updateConditions();
    }

    function getCellAtPoint(x, y) {
        const cells = document.querySelectorAll('.grid-cell:not(.blocked)');
        for (const cell of cells) {
            const rect = cell.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return cell;
            }
        }
        return null;
    }

    function tryPlaceDomino(dominoIndex, orientation, cell) {
        if (cell.classList.contains('blocked')) return false;
        const domino = state.puzzle.dominoes[dominoIndex];
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const { rows, cols } = state.puzzle.gridSize;
        const idx1 = parseInt(cell.dataset.index);

        if (state.grid[idx1] !== null) return false;

        if (domino.length === 1) {
            state.grid[idx1] = { dominoIndex, half: 0 };
            state.placedDominoes[dominoIndex] = { idx1, idx2: null, isVertical: false, single: true };
            return true;
        }

        const isVertical = orientation === 'vertical';
        let r2 = isVertical ? row + 1 : row;
        let c2 = isVertical ? col : col + 1;
        if (r2 >= rows || c2 >= cols) return false;
        if (!isActiveCell(r2, c2)) return false;

        let idx2 = r2 * cols + c2;
        if (state.grid[idx2] !== null) return false;

        state.grid[idx1] = { dominoIndex, half: 0 };
        state.grid[idx2] = { dominoIndex, half: 1 };
        state.placedDominoes[dominoIndex] = { idx1, idx2, isVertical };
        return true;
    }

    function highlightDropTarget(x, y) {
        clearHighlights();
        if (!state.dragging) return;
        const cell = getCellAtPoint(x, y);
        if (!cell) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const { rows, cols } = state.puzzle.gridSize;
        const isVertical = state.dragging.orientation === 'vertical';
        const idx1 = parseInt(cell.dataset.index);

        let r2 = isVertical ? row + 1 : row;
        let c2 = isVertical ? col : col + 1;
        if (r2 >= rows || c2 >= cols) return;
        if (!isActiveCell(r2, c2)) return;

        let idx2 = r2 * cols + c2;

        if (state.grid[idx1] !== null || state.grid[idx2] !== null) return;

        cell.classList.add('drop-highlight');
        const cell2 = document.querySelector(`.grid-cell[data-index="${idx2}"]`);
        if (cell2) cell2.classList.add('drop-highlight');
    }

    function clearHighlights() {
        document.querySelectorAll('.grid-cell.drop-highlight').forEach(c => c.classList.remove('drop-highlight'));
    }

    // ─── Screens ───

    function updateHomeScreen() {
        DIFFICULTIES.forEach(diff => {
            const puzzles = PUZZLES[diff];
            const solved = puzzles.filter((_, i) => {
                const key = getStageKey(diff, i);
                return state.progress[key] && state.progress[key].solved;
            }).length;
            const total = puzzles.length;
            const progEl = $(`prog-${diff}`);
            if (progEl) progEl.style.width = `${(solved/total)*100}%`;
            const countEl = $(`count-${diff}`);
            if (countEl) countEl.textContent = `${solved}/${total}`;
        });
    }

    function showHome() {
        stopTimer();
        state.selectedDomino = null;
        $('homeScreen').classList.add('active');
        $('gameScreen').classList.remove('active');
        $('stagesPanel').classList.remove('active');
        document.querySelector('.difficulty-selector').style.display = '';
        document.querySelector('.home-hero').style.display = '';
        updateHomeScreen();
    }

    function selectDifficultyCard(diff) {
        state.currentDifficulty = diff;
        showStages(diff);
    }

    function showStages(diff) {
        stopTimer();
        $('gameScreen').classList.remove('active');
        $('homeScreen').classList.add('active');
        document.querySelector('.difficulty-selector').style.display = 'none';
        document.querySelector('.home-hero').style.display = 'none';
        $('stagesPanel').classList.add('active');
        $('stagesTitle').textContent = `${capitalize(diff)} Stages`;

        const grid = $('stagesGrid');
        grid.innerHTML = '';
        const puzzles = PUZZLES[diff];

        puzzles.forEach((puzzle, i) => {
            const key = getStageKey(diff, i);
            const data = state.progress[key];
            const solved = data && data.solved;
            const stars = data ? data.stars : 0;
            const locked = i > 0 && !state.progress[getStageKey(diff, i-1)]?.solved;

            const card = document.createElement('button');
            card.className = `stage-card${solved ? ' completed' : ''}${locked ? ' locked' : ''}`;
            card.innerHTML = `
                <div class="stage-num">${i + 1}</div>
                <div class="stage-stars">
                    ${[1,2,3].map(s => `<span class="${s <= stars ? 'earned' : ''}">★</span>`).join('')}
                </div>
            `;
            if (!locked) {
                card.addEventListener('click', () => startPuzzle(diff, i));
            }
            grid.appendChild(card);
        });
    }

    function startPuzzle(diff, idx) {
        state.currentDifficulty = diff;
        state.currentStage = idx;
        state.puzzle = PUZZLES[diff][idx];
        state.grid = new Array(state.puzzle.gridSize.rows * state.puzzle.gridSize.cols).fill(null);
        state.placedDominoes = {};
        state.selectedDomino = null;
        state.hintsLeft = 3;
        state.seconds = 0;

        $('homeScreen').classList.remove('active');
        $('gameScreen').classList.add('active');
        $('levelBadge').textContent = capitalize(diff);
        $('stageLabel').textContent = `Stage ${idx + 1}`;
        $('hintCount').textContent = state.hintsLeft;
        $('timer').textContent = '0:00';

        renderGrid();
        renderDominoes();
        renderConditions();
        startTimer();
    }

    // ─── Grid ───

    function isActiveCell(r, c) {
        return state.puzzle.regions.some(reg => reg.cells.some(([cr,cc]) => cr === r && cc === c));
    }

    function renderGrid() {
        const { rows, cols } = state.puzzle.gridSize;
        const grid = $('grid');
        grid.style.gridTemplateColumns = `repeat(${cols}, 70px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 70px)`;
        grid.innerHTML = '';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.index = idx;
                cell.dataset.row = r;
                cell.dataset.col = c;

                const region = state.puzzle.regions.find(reg => reg.cells.some(([cr,cc]) => cr === r && cc === c));
                if (region) {
                    cell.style.backgroundColor = region.color;
                    cell.dataset.regionId = region.id;
                    addRegionBorders(cell, r, c, region);

                    const isFirstCell = region.cells[0][0] === r && region.cells[0][1] === c;
                    if (isFirstCell) {
                        const label = document.createElement('div');
                        label.className = 'region-label';
                        label.textContent = region.condition.label;
                        cell.appendChild(label);
                    }
                } else {
                    cell.classList.add('blocked');
                }

                if (region) {
                    cell.addEventListener('click', handleCellClick);

                    cell.addEventListener('mousedown', (e) => {
                        const placed = state.grid[idx];
                        if (placed) {
                            e.preventDefault();
                            const placement = state.placedDominoes[placed.dominoIndex];
                            startDrag(placed.dominoIndex, placement.isVertical ? 'vertical' : 'horizontal', e.clientX, e.clientY, true);
                        }
                    });

                    cell.addEventListener('touchstart', (e) => {
                        const placed = state.grid[idx];
                        if (placed) {
                            e.preventDefault();
                            const touch = e.touches[0];
                            const placement = state.placedDominoes[placed.dominoIndex];
                            startDrag(placed.dominoIndex, placement.isVertical ? 'vertical' : 'horizontal', touch.clientX, touch.clientY, true);
                        }
                    }, { passive: false });
                }

                grid.appendChild(cell);
            }
        }
        updateGridDisplay();
    }

    function addRegionBorders(cell, r, c, region) {
        const cells = region.cells;
        const has = (dr, dc) => cells.some(([cr,cc]) => cr === dr && cc === dc);
        if (!has(r-1, c)) cell.classList.add('border-top');
        if (!has(r+1, c)) cell.classList.add('border-bottom');
        if (!has(r, c-1)) cell.classList.add('border-left');
        if (!has(r, c+1)) cell.classList.add('border-right');
    }

    // ─── Dominoes Tray ───

    function renderDominoes() {
        const tray = $('trayItems');
        tray.innerHTML = '';

        state.puzzle.dominoes.forEach((domino, i) => {
            const el = document.createElement('div');
            el.className = 'domino horizontal';
            el.dataset.dominoIndex = i;

            if (domino.length === 1) {
                el.innerHTML = `<div class="domino-half single">${renderPipsDom(domino[0])}</div>`;
                el.classList.add('single-tile');
            } else {
                el.innerHTML = `
                    <div class="domino-half">${renderPipsDom(domino[0])}</div>
                    <div class="domino-half">${renderPipsDom(domino[1])}</div>
                `;
            }

            // Right-click to rotate
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (state.placedDominoes[i] !== undefined) return;
                toggleOrientation(el);
            });

            // Click to select, click again to rotate
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDominoTrayClick(i, el);
            });

            // Mouse drag
            el.addEventListener('mousedown', (e) => {
                if (state.placedDominoes[i] !== undefined) return;
                e.preventDefault();
                const orient = el.classList.contains('vertical') ? 'vertical' : 'horizontal';
                startDrag(i, orient, e.clientX, e.clientY, false);
            });

            // Touch drag
            el.addEventListener('touchstart', (e) => {
                if (state.placedDominoes[i] !== undefined) return;
                e.preventDefault();
                const touch = e.touches[0];
                const orient = el.classList.contains('vertical') ? 'vertical' : 'horizontal';
                startDrag(i, orient, touch.clientX, touch.clientY, false);
            }, { passive: false });

            if (state.placedDominoes[i] !== undefined) {
                el.classList.add('placed');
            }

            tray.appendChild(el);
        });
    }

    function handleDominoTrayClick(index, el) {
        if (state.placedDominoes[index] !== undefined) return;

        if (state.selectedDomino === index) {
            toggleOrientation(el);
            state.selectedOrientation = el.classList.contains('vertical') ? 'vertical' : 'horizontal';
            return;
        }

        deselectDomino();
        state.selectedDomino = index;
        state.selectedOrientation = el.classList.contains('vertical') ? 'vertical' : 'horizontal';
        el.classList.add('selected');
    }

    function toggleOrientation(el) {
        el.classList.toggle('horizontal');
        el.classList.toggle('vertical');
    }

    function deselectDomino() {
        state.selectedDomino = null;
        document.querySelectorAll('.domino.selected').forEach(d => d.classList.remove('selected'));
    }

    // ─── Cell click (fallback for click-to-place) ───

    function handleCellClick(e) {
        if (state.dragging) return;

        const cell = e.currentTarget;
        const idx = parseInt(cell.dataset.index);
        const placed = state.grid[idx];

        if (placed) {
            removeDominoFromGrid(placed.dominoIndex);
            updateGridDisplay();
            updateTrayDisplay();
            updateConditions();
            return;
        }

        if (state.selectedDomino === null) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const { rows, cols } = state.puzzle.gridSize;
        const dominoIndex = state.selectedDomino;
        const isVertical = state.selectedOrientation === 'vertical';

        const domino = state.puzzle.dominoes[dominoIndex];
        let idx1 = idx;

        if (state.grid[idx1] !== null) { shakeElement(cell); return; }

        if (domino.length === 1) {
            state.grid[idx1] = { dominoIndex, half: 0 };
            state.placedDominoes[dominoIndex] = { idx1, idx2: null, isVertical: false, single: true };
        } else {
            let r2 = isVertical ? row + 1 : row;
            let c2 = isVertical ? col : col + 1;
            if (r2 >= rows || c2 >= cols || !isActiveCell(r2, c2)) { shakeElement(cell); return; }
            let idx2 = r2 * cols + c2;
            if (state.grid[idx2] !== null) { shakeElement(cell); return; }

            state.grid[idx1] = { dominoIndex, half: 0 };
            state.grid[idx2] = { dominoIndex, half: 1 };
            state.placedDominoes[dominoIndex] = { idx1, idx2, isVertical };
        }

        deselectDomino();
        updateGridDisplay();
        updateTrayDisplay();
        updateConditions();
    }

    // ─── Rendering ───

    function renderPipsDom(count) {
        if (count === 0) return '<div class="pip-container pips-0"></div>';
        let dots = '';
        for (let i = 0; i < count; i++) dots += '<span class="pip-dot"></span>';
        return `<div class="pip-container pips-${count}">${dots}</div>`;
    }

    function conditionDescription(cond) {
        switch (cond.type) {
            case 'sum':        return `Sum = ${cond.value}`;
            case 'equal':      return 'All equal';
            case 'notEqual':   return 'All different';
            case 'lessThan':   return 'Increasing  ↗';
            case 'greaterThan':return 'Decreasing  ↘';
            case 'even':       return 'All even';
            case 'odd':        return 'All odd';
            default:           return cond.label;
        }
    }

    function renderConditions() {
        const panel = $('conditionsPanel');
        panel.innerHTML = '';

        state.puzzle.regions.forEach(region => {
            const tag = document.createElement('div');
            tag.className = 'condition-tag';
            tag.dataset.regionId = region.id;
            tag.innerHTML = `
                <span class="color-dot" style="background:${region.color}"></span>
                <span class="cond-label">${region.condition.label}</span>
                <span class="cond-desc">${conditionDescription(region.condition)}</span>
            `;
            panel.appendChild(tag);
        });
        updateConditions();
    }

    function removeDominoFromGrid(dominoIndex) {
        const placement = state.placedDominoes[dominoIndex];
        if (!placement) return;
        state.grid[placement.idx1] = null;
        if (placement.idx2 !== null) state.grid[placement.idx2] = null;
        delete state.placedDominoes[dominoIndex];
    }

    function updateGridDisplay() {
        const { cols } = state.puzzle.gridSize;
        const cells = document.querySelectorAll('.grid-cell');

        cells.forEach(cell => {
            const idx = parseInt(cell.dataset.index);
            const data = state.grid[idx];
            cell.classList.remove('has-domino', 'domino-left', 'domino-right', 'domino-top', 'domino-bottom', 'domino-single');

            const existing = cell.querySelector('.cell-pip-display');
            if (existing) existing.remove();

            if (data) {
                const domino = state.puzzle.dominoes[data.dominoIndex];
                const pipValue = domino[data.half];
                const display = document.createElement('div');
                display.className = 'cell-pip-display';
                display.innerHTML = renderPipsDom(pipValue);
                cell.appendChild(display);
                cell.classList.add('has-domino');

                const placement = state.placedDominoes[data.dominoIndex];
                if (placement) {
                    if (placement.single) {
                        cell.classList.add('domino-single');
                    } else if (placement.isVertical) {
                        cell.classList.add(data.half === 0 ? 'domino-top' : 'domino-bottom');
                    } else {
                        cell.classList.add(data.half === 0 ? 'domino-left' : 'domino-right');
                    }
                }
            }
        });
    }

    function updateTrayDisplay() {
        document.querySelectorAll('.domino').forEach(el => {
            const idx = parseInt(el.dataset.dominoIndex);
            if (state.placedDominoes[idx] !== undefined) {
                el.classList.add('placed');
                el.classList.remove('selected');
            } else {
                el.classList.remove('placed');
            }
        });
    }

    function updateConditions() {
        const { cols } = state.puzzle.gridSize;
        state.puzzle.regions.forEach(region => {
            const tag = document.querySelector(`.condition-tag[data-region-id="${region.id}"]`);
            if (!tag) return;

            const cellValues = [];
            region.cells.forEach(([r, c]) => {
                const idx = r * cols + c;
                const data = state.grid[idx];
                if (data) {
                    const domino = state.puzzle.dominoes[data.dominoIndex];
                    cellValues.push(domino[data.half]);
                }
            });

            tag.classList.remove('satisfied', 'violated');
            if (cellValues.length === 0) return;
            if (cellValues.length < region.cells.length) return;

            const satisfied = checkCondition(region.condition, cellValues);
            tag.classList.add(satisfied ? 'satisfied' : 'violated');
        });
    }

    function checkCondition(condition, values) {
        switch (condition.type) {
            case 'sum':   return values.reduce((a,b) => a+b, 0) === condition.value;
            case 'equal': return values.every(v => v === values[0]);
            case 'notEqual': return new Set(values).size === values.length;
            case 'lessThan': return values.every((v, i) => i === 0 || values[i-1] < v);
            case 'greaterThan': return values.every((v, i) => i === 0 || values[i-1] > v);
            case 'even':  return values.every(v => v % 2 === 0);
            case 'odd':   return values.every(v => v % 2 === 1);
            default: return true;
        }
    }

    // ─── Game Logic ───

    function checkSolution() {
        const allPlaced = Object.keys(state.placedDominoes).length === state.puzzle.dominoes.length;
        if (!allPlaced) { shakeElement($('checkBtn')); return; }

        const { cols } = state.puzzle.gridSize;
        let allSatisfied = true;

        state.puzzle.regions.forEach(region => {
            const cellValues = [];
            region.cells.forEach(([r, c]) => {
                const idx = r * cols + c;
                const data = state.grid[idx];
                if (data) {
                    const domino = state.puzzle.dominoes[data.dominoIndex];
                    cellValues.push(domino[data.half]);
                }
            });
            if (!checkCondition(region.condition, cellValues)) allSatisfied = false;
        });

        if (allSatisfied) {
            handleWin();
        } else {
            shakeElement($('grid'));
            document.querySelectorAll('.condition-tag.violated').forEach(tag => shakeElement(tag));
        }
    }

    function handleWin() {
        stopTimer();
        const time = state.seconds;
        const hints = 3 - state.hintsLeft;

        let stars = 3;
        if (hints >= 2) stars = 1;
        else if (hints >= 1) stars = 2;
        if (state.currentDifficulty === 'beginner' || state.currentDifficulty === 'easy') {
            if (time > 120) stars = Math.max(1, stars - 1);
        } else {
            if (time > 180) stars = Math.max(1, stars - 1);
        }

        const key = getStageKey(state.currentDifficulty, state.currentStage);
        const prev = state.progress[key];
        if (!prev || !prev.solved || prev.stars < stars) {
            state.progress[key] = { solved: true, stars, time, hints };
            saveProgress();
        }

        showConfetti();
        setTimeout(() => {
            $('winTime').textContent = `Time: ${formatTime(time)}`;
            $('winHints').textContent = `Hints used: ${hints}`;
            [1,2,3].forEach(s => {
                $(`star${s}`).classList.toggle('active', s <= stars);
            });
            const hasNext = state.currentStage < PUZZLES[state.currentDifficulty].length - 1;
            $('nextPuzzleBtn').style.display = hasNext ? '' : 'none';
            $('winModal').classList.add('active');
        }, 800);
    }

    function nextPuzzle() {
        $('winModal').classList.remove('active');
        if (state.currentStage < PUZZLES[state.currentDifficulty].length - 1) {
            startPuzzle(state.currentDifficulty, state.currentStage + 1);
        }
    }

    function replayPuzzle() {
        $('winModal').classList.remove('active');
        startPuzzle(state.currentDifficulty, state.currentStage);
    }

    function clearGrid() {
        Object.keys(state.placedDominoes).forEach(idx => removeDominoFromGrid(parseInt(idx)));
        deselectDomino();
        updateGridDisplay();
        updateTrayDisplay();
        updateConditions();
    }

    function useHint() {
        if (state.hintsLeft <= 0) return;
        const solution = state.puzzle.solution;
        const { cols } = state.puzzle.gridSize;
        const totalCells = state.puzzle.gridSize.rows * cols;

        for (let cellIdx = 0; cellIdx < totalCells; cellIdx++) {
            const sol = solution[cellIdx];
            if (!sol) continue;
            const current = state.grid[cellIdx];
            if (!current || current.dominoIndex !== sol.domino || current.half !== sol.half) {
                const cell = document.querySelector(`.grid-cell[data-index="${cellIdx}"]`);
                if (cell) {
                    cell.classList.add('hint-cell');
                    setTimeout(() => cell.classList.remove('hint-cell'), 4500);
                }
                state.hintsLeft--;
                $('hintCount').textContent = state.hintsLeft;
                break;
            }
        }
    }

    // ─── Timer ───

    function startTimer() {
        stopTimer();
        state.timerInterval = setInterval(() => {
            state.seconds++;
            $('timer').textContent = formatTime(state.seconds);
        }, 1000);
    }

    function stopTimer() {
        if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
    }

    function formatTime(s) {
        return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
    }

    // ─── Stats ───

    function showStats() {
        let totalSolved = 0, totalStars = 0, bestTime = Infinity, streak = 0;

        DIFFICULTIES.forEach(diff => {
            PUZZLES[diff].forEach((_, i) => {
                const data = state.progress[getStageKey(diff, i)];
                if (data && data.solved) {
                    totalSolved++;
                    totalStars += data.stars;
                    if (data.time < bestTime) bestTime = data.time;
                }
            });
        });

        outerLoop:
        for (const diff of DIFFICULTIES) {
            for (let i = 0; i < PUZZLES[diff].length; i++) {
                if (state.progress[getStageKey(diff, i)]?.solved) streak++;
                else break outerLoop;
            }
        }

        $('statSolved').textContent = totalSolved;
        $('statStreak').textContent = streak;
        $('statBest').textContent = bestTime === Infinity ? '-' : formatTime(bestTime);
        $('statStars').textContent = totalStars;

        const levelsDiv = $('statsLevels');
        levelsDiv.innerHTML = '';
        DIFFICULTIES.forEach(diff => {
            const puzzles = PUZZLES[diff];
            const solved = puzzles.filter((_, i) => state.progress[getStageKey(diff, i)]?.solved).length;
            levelsDiv.innerHTML += `
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee">
                    <span style="font-weight:600">${capitalize(diff)}</span>
                    <span style="color:#6b6b6b">${solved}/${puzzles.length} solved</span>
                </div>
            `;
        });
        $('statsModal').classList.add('active');
    }

    // ─── Effects ───

    function showConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        const colors = ['#f0c040','#4a90d9','#4caf50','#e74c3c','#9b59b6','#f39c12'];
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 1 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            piece.style.borderRadius = ['50%','0','4px'][Math.floor(Math.random()*3)];
            piece.style.transform = `rotate(${Math.random()*360}deg)`;
            container.appendChild(piece);
        }
        setTimeout(() => container.remove(), 4000);
    }

    function shakeElement(el) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 600);
    }

    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    document.addEventListener('DOMContentLoaded', init);
})();
