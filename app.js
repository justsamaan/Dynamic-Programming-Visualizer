// Configuration for Algorithms
const ALGO_CONFIG = {
    lcs: {
        title: "Longest Common Subsequence",
        desc: "Finds the longest subsequence present in both strings. A classic 2D Dynamic Programming problem.",
        inputs: `
            <div class="input-row"><label>String 1:</label><input type="text" id="lcs-s1" value="AGGTAB" /></div>
            <div class="input-row"><label>String 2:</label><input type="text" id="lcs-s2" value="GXTXAYB" /></div>
        `
    },
    knapsack: {
        title: "0/1 Knapsack Problem",
        desc: "Maximize value in a knapsack of limited capacity. Items cannot be divided.",
        inputs: `
            <div class="input-row"><label>Values (comma separated):</label><input type="text" id="ks-val" value="60,100,120" /></div>
            <div class="input-row"><label>Weights (comma separated):</label><input type="text" id="ks-wt" value="10,20,30" /></div>
            <div class="input-row"><label>Knapsack Capacity (W):</label><input type="number" id="ks-W" value="50" /></div>
        `
    },
    mcm: {
        title: "Matrix Chain Multiplication",
        desc: "Find the most efficient way to multiply a given sequence of matrices.",
        inputs: `
            <div class="input-row"><label>Dimensions Array (p0,p1...pn):</label><input type="text" id="mcm-p" value="1, 2, 3, 4" /></div>
        `
    },
    tsp: {
        title: "Travelling Salesperson Problem",
        desc: "Find the shortest possible route that visits every city exactly once and returns to the origin. (Using Bitmask DP)",
        inputs: `
            <div class="input-row" style="grid-column: 1 / -1;">
                <label>Distance Matrix (JSON 2D Array):</label>
                <input type="text" id="tsp-dist" value="[[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]" style="width: 100%;" />
            </div>
        `
    },
    bellman: {
        title: "Bellman-Ford Algorithm",
        desc: "Computes shortest paths from a single source vertex to all other vertices. Handles negative weights.",
        inputs: `
            <div class="input-row"><label>Vertices Count (N):</label><input type="number" id="bf-n" value="5" /></div>
            <div class="input-row"><label>Source Vertex (0 to N-1):</label><input type="number" id="bf-src" value="0" /></div>
            <div class="input-row" style="grid-column: 1 / -1;">
                <label>Edges (u,v,weight) separated by semicolon:</label>
                <input type="text" id="bf-edges" value="0,1,-1; 0,2,4; 1,2,3; 1,3,2; 1,4,2; 3,2,5; 3,1,1; 4,3,-3" style="width: 100%;" />
            </div>
        `
    },
    floyd: {
        title: "Floyd-Warshall Algorithm",
        desc: "Finds shortest paths in a directed weighted graph with positive or negative edge weights (All-Pairs Shortest Path).",
        inputs: `
            <div class="input-row" style="grid-column: 1 / -1;">
                <label>Adjacency Matrix (JSON 2D Array, use 999 for Infinity):</label>
                <input type="text" id="fw-dist" value="[[0, 5, 999, 10], [999, 0, 3, 999], [999, 999, 0, 1], [999, 999, 999, 0]]" style="width: 100%;" />
            </div>
        `
    },
    assembly: {
        title: "Assembly Line Scheduling",
        desc: "Finds the fastest route through two assembly lines with transfer times.",
        inputs: `
            <div class="input-row"><label>Entry Times (e1, e2):</label><input type="text" id="al-e" value="10, 12" /></div>
            <div class="input-row"><label>Exit Times (x1, x2):</label><input type="text" id="al-x" value="18, 7" /></div>
            <div class="input-row" style="grid-column: 1 / -1;"><label>Station Times Line 1 (a1):</label><input type="text" id="al-a1" value="4, 5, 3, 2" style="width: 100%;"/></div>
            <div class="input-row" style="grid-column: 1 / -1;"><label>Station Times Line 2 (a2):</label><input type="text" id="al-a2" value="2, 10, 1, 4" style="width: 100%;"/></div>
            <div class="input-row" style="grid-column: 1 / -1;"><label>Transfer Times (t1: Line 1 to 2):</label><input type="text" id="al-t1" value="0, 7, 4, 5" style="width: 100%;"/></div>
            <div class="input-row" style="grid-column: 1 / -1;"><label>Transfer Times (t2: Line 2 to 1):</label><input type="text" id="al-t2" value="0, 9, 2, 8" style="width: 100%;"/></div>
        `
    }
};

// State
let currentAlgo = 'lcs';
let steps = [];
let currentStepIdx = 0;
let playing = false;
let playInterval = null;

// DOM Elements
const algoList = document.getElementById('algoList');
const algoTitle = document.getElementById('algoTitle');
const algoDesc = document.getElementById('algoDesc');
const inputContainer = document.getElementById('inputContainer');
const btnVisualize = document.getElementById('btnVisualize');
const btnReset = document.getElementById('btnReset');
const canvas = document.getElementById('canvas');
const explanationBox = document.getElementById('explanationBox');
const stepExplanation = document.getElementById('stepExplanation');
const playbackControls = document.getElementById('playbackControls');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnAutoPlay = document.getElementById('btnAutoPlay');
const stepIndicator = document.getElementById('stepIndicator');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar clicks
    algoList.addEventListener('click', (e) => {
        const item = e.target.closest('.algo-item');
        if (!item) return;
        
        document.querySelectorAll('.algo-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        currentAlgo = item.dataset.algo;
        loadAlgoConfig(currentAlgo);
        resetState();
    });

    // Control buttons
    btnVisualize.addEventListener('click', generateVisualization);
    btnReset.addEventListener('click', resetState);
    btnNext.addEventListener('click', nextStep);
    btnPrev.addEventListener('click', prevStep);
    btnAutoPlay.addEventListener('click', togglePlay);
    
    // Initial Load
    loadAlgoConfig(currentAlgo);
});

function loadAlgoConfig(algo) {
    const config = ALGO_CONFIG[algo];
    algoTitle.textContent = config.title;
    algoDesc.textContent = config.desc;
    inputContainer.innerHTML = config.inputs;
}

function resetState() {
    steps = [];
    currentStepIdx = 0;
    playing = false;
    clearInterval(playInterval);
    btnAutoPlay.innerHTML = '<i class="fa-solid fa-play"></i> Auto';
    playbackControls.classList.add('hidden');
    explanationBox.classList.add('hidden');
    canvas.innerHTML = `
        <div class="canvas-placeholder">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <p>Enter inputs and click "Generate DP Table" to begin visualization.</p>
        </div>`;
    btnVisualize.disabled = false;
    inputContainer.querySelectorAll('input').forEach(i => i.disabled = false);
}

// --- Generator Entry Point ---
function generateVisualization() {
    steps = [];
    btnVisualize.disabled = true;
    inputContainer.querySelectorAll('input').forEach(i => i.disabled = true);
    
    try {
        switch(currentAlgo) {
            case 'lcs': generateLCS(); break;
            case 'knapsack': generateKnapsack(); break;
            case 'mcm': generateMCM(); break;
            case 'tsp': generateTSP(); break;
            case 'bellman': generateBellmanFord(); break;
            case 'floyd': generateFloydWarshall(); break;
            case 'assembly': generateAssemblyLine(); break;
        }
    } catch (err) {
        alert("Input Parsing Error: " + err.message);
        resetState();
        return;
    }

    if (steps.length > 0) {
        currentStepIdx = 0;
        playbackControls.classList.remove('hidden');
        explanationBox.classList.remove('hidden');
        updateUI();
    }
}

// --- Specific Algorithm Generators ---

function generateLCS() {
    const s1 = document.getElementById('lcs-s1').value;
    const s2 = document.getElementById('lcs-s2').value;
    const m = s1.length, n = s2.length;
    
    let dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Initial State Step
    steps.push({
        table: JSON.parse(JSON.stringify(dp)),
        rowHeaders: ['-', ...s1.split('')],
        colHeaders: ['-', ...s2.split('')],
        activeCell: null,
        compareCells: [],
        msg: "Initialized table with 0s. Padding with 1 extra row/col for base cases."
    });

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                steps.push({
                    table: JSON.parse(JSON.stringify(dp)),
                    rowHeaders: ['-', ...s1.split('')],
                    colHeaders: ['-', ...s2.split('')],
                    activeCell: [i, j],
                    compareCells: [[i - 1, j - 1]],
                    msg: `Characters match (${s1[i-1]}). dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`
                });
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                steps.push({
                    table: JSON.parse(JSON.stringify(dp)),
                    rowHeaders: ['-', ...s1.split('')],
                    colHeaders: ['-', ...s2.split('')],
                    activeCell: [i, j],
                    compareCells: [[i - 1, j], [i, j - 1]],
                    msg: `No match. dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`
                });
            }
        }
    }
    
    steps.push({
        table: JSON.parse(JSON.stringify(dp)),
        rowHeaders: ['-', ...s1.split('')],
        colHeaders: ['-', ...s2.split('')],
        activeCell: [m, n],
        compareCells: [],
        msg: `Done! Length of Longest Common Subsequence is ${dp[m][n]}.`
    });
}

function generateKnapsack() {
    const vals = document.getElementById('ks-val').value.split(',').map(Number);
    const wts = document.getElementById('ks-wt').value.split(',').map(Number);
    const W = parseInt(document.getElementById('ks-W').value);
    const n = vals.length;
    
    let dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
    let rHeaders = ['Base'];
    for(let i=0; i<n; i++) rHeaders.push(`Item ${i+1}`);
    let cHeaders = [];
    for(let w=0; w<=W; w++) cHeaders.push(w);

    steps.push({
        table: JSON.parse(JSON.stringify(dp)),
        rowHeaders: rHeaders,
        colHeaders: cHeaders,
        activeCell: null,
        compareCells: [],
        msg: "Table initialized. Rows represent items, columns represent knapsack capacity."
    });

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (wts[i - 1] <= w) {
                let include = vals[i - 1] + dp[i - 1][w - wts[i - 1]];
                let exclude = dp[i - 1][w];
                dp[i][w] = Math.max(include, exclude);
                steps.push({
                    table: JSON.parse(JSON.stringify(dp)),
                    rowHeaders: rHeaders,
                    colHeaders: cHeaders,
                    activeCell: [i, w],
                    compareCells: [[i - 1, w], [i - 1, w - wts[i - 1]]],
                    msg: `Item ${i} (W:${wts[i-1]}, V:${vals[i-1]}) fits in Cap ${w}. max(Include: ${include}, Exclude: ${exclude}) = ${dp[i][w]}`
                });
            } else {
                dp[i][w] = dp[i - 1][w];
                steps.push({
                    table: JSON.parse(JSON.stringify(dp)),
                    rowHeaders: rHeaders,
                    colHeaders: cHeaders,
                    activeCell: [i, w],
                    compareCells: [[i - 1, w]],
                    msg: `Item ${i} (W:${wts[i-1]}) > Cap ${w}. Must exclude. Value = ${dp[i][w]}`
                });
            }
        }
    }
    steps.push({
        table: JSON.parse(JSON.stringify(dp)),
        rowHeaders: rHeaders,
        colHeaders: cHeaders,
        activeCell: [n, W],
        msg: `Done! Maximum value possible is ${dp[n][W]}.`
    });
}

function generateMCM() {
    const p = document.getElementById('mcm-p').value.split(',').map(Number);
    const n = p.length - 1;
    let m = Array(n + 1).fill().map(() => Array(n + 1).fill('-'));
    let rHeaders = [''];
    let cHeaders = [''];
    for(let i=1; i<=n; i++) {
        rHeaders.push(`M${i}`);
        cHeaders.push(`M${i}`);
        m[i][i] = 0;
    }

    steps.push({
        table: JSON.parse(JSON.stringify(m)),
        rowHeaders: rHeaders,
        colHeaders: cHeaders,
        msg: "Cost matrix. Base cases (chain length 1) cost 0."
    });

    for (let L = 2; L <= n; L++) {
        for (let i = 1; i <= n - L + 1; i++) {
            let j = i + L - 1;
            m[i][j] = 999999;
            for (let k = i; k <= j - 1; k++) {
                let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j]) {
                    m[i][j] = q;
                }
                steps.push({
                    table: JSON.parse(JSON.stringify(m)),
                    rowHeaders: rHeaders,
                    colHeaders: cHeaders,
                    activeCell: [i, j],
                    compareCells: [[i, k], [k + 1, j]],
                    msg: `Evaluating M${i}..M${j} splitting at k=${k}. Cost = m[${i}][${k}] + m[${k+1}][${j}] + cost = ${q}`
                });
            }
        }
    }
}

function generateTSP() {
    const dist = JSON.parse(document.getElementById('tsp-dist').value);
    const n = dist.length;
    let dp = Array(1 << n).fill().map(() => Array(n).fill('-'));
    dp[1][0] = 0;

    let cHeaders = [];
    for(let i=0; i<n; i++) cHeaders.push(`C${i}`);
    let rHeaders = [];
    for(let i=0; i<(1<<n); i++) rHeaders.push(i.toString(2).padStart(n, '0'));

    steps.push({
        table: JSON.parse(JSON.stringify(dp)),
        rowHeaders: rHeaders,
        colHeaders: cHeaders,
        msg: "Rows: bitmask of visited cities. Cols: ending city. Set dp[1(city 0)][0] = 0."
    });

    for (let mask = 1; mask < (1 << n); mask++) {
        for (let u = 0; u < n; u++) {
            if ((mask & (1 << u)) !== 0 && dp[mask][u] !== '-') {
                for (let v = 0; v < n; v++) {
                    if ((mask & (1 << v)) === 0) {
                        let nextMask = mask | (1 << v);
                        if(dp[nextMask][v] === '-' || dp[mask][u] + dist[u][v] < dp[nextMask][v]) {
                            dp[nextMask][v] = dp[mask][u] + dist[u][v];
                            steps.push({
                                table: JSON.parse(JSON.stringify(dp)),
                                rowHeaders: rHeaders,
                                colHeaders: cHeaders,
                                activeCell: [nextMask, v],
                                compareCells: [[mask, u]],
                                msg: `From state ${mask.toString(2)} at C${u}, moving to C${v}. New mask = ${nextMask.toString(2)}. Dist = ${dp[nextMask][v]}`
                            });
                        }
                    }
                }
            }
        }
    }
}

function generateBellmanFord() {
    const n = parseInt(document.getElementById('bf-n').value);
    const src = parseInt(document.getElementById('bf-src').value);
    const edgeStrings = document.getElementById('bf-edges').value.split(';');
    const edges = [];
    for(let e of edgeStrings) {
        if(!e.trim()) continue;
        const pts = e.split(',').map(Number);
        edges.push({u: pts[0], v: pts[1], w: pts[2]});
    }

    let dist = Array(n).fill('INF');
    dist[src] = 0;

    steps.push({
        table: [JSON.parse(JSON.stringify(dist))],
        rowHeaders: ['Dist'],
        colHeaders: Array.from({length:n}, (_, i)=>`V${i}`),
        msg: `Initialized distances. Source V${src} = 0, others = INF.`
    });

    for (let i = 1; i <= n - 1; i++) {
        for (let edge of edges) {
            let u = edge.u, v = edge.v, w = edge.w;
            if (dist[u] !== 'INF' && dist[u] + w < (dist[v] === 'INF' ? 999999 : dist[v])) {
                dist[v] = dist[u] + w;
                steps.push({
                    table: [JSON.parse(JSON.stringify(dist))],
                    rowHeaders: ['Dist'],
                    colHeaders: Array.from({length:n}, (_, i)=>"V"+i),
                    activeCell: [0, v],
                    compareCells: [[0, u]],
                    msg: `Iter ${i}: Relaxed edge (${u}->${v}, w:${w}). New dist to V${v} = ${dist[v]}`
                });
            }
        }
    }
}

function generateFloydWarshall() {
    const dist = JSON.parse(document.getElementById('fw-dist').value);
    const n = dist.length;
    
    steps.push({
        table: JSON.parse(JSON.stringify(dist)),
        rowHeaders: Array.from({length:n}, (_,i)=>"V"+i),
        colHeaders: Array.from({length:n}, (_,i)=>"V"+i),
        msg: "Initial adjacency matrix."
    });

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    steps.push({
                        table: JSON.parse(JSON.stringify(dist)),
                        rowHeaders: Array.from({length:n}, (_,i)=>"V"+i),
                        colHeaders: Array.from({length:n}, (_,i)=>"V"+i),
                        activeCell: [i, j],
                        compareCells: [[i, k], [k, j]],
                        msg: `Using V${k} as intermediate: Path ${i}->${j} improved to ${dist[i][j]}`
                    });
                }
            }
        }
    }
}

function generateAssemblyLine() {
    const eVals = document.getElementById('al-e').value.split(',').map(Number);
    const xVals = document.getElementById('al-x').value.split(',').map(Number);
    const a1 = document.getElementById('al-a1').value.split(',').map(Number);
    const a2 = document.getElementById('al-a2').value.split(',').map(Number);
    const t1 = document.getElementById('al-t1').value.split(',').map(Number);
    const t2 = document.getElementById('al-t2').value.split(',').map(Number);
    const n = a1.length;

    let f1 = Array(n).fill('-');
    let f2 = Array(n).fill('-');

    f1[0] = eVals[0] + a1[0];
    f2[0] = eVals[1] + a2[0];

    steps.push({
        table: [JSON.parse(JSON.stringify(f1)), JSON.parse(JSON.stringify(f2))],
        rowHeaders: ['Line 1', 'Line 2'],
        colHeaders: Array.from({length:n}, (_,i)=>"S"+(i+1)),
        activeCell: [0, 0],
        compareCells: [[1, 0]],
        msg: `Initial Station 1 times including entry constraints.`
    });

    for (let j = 1; j < n; j++) {
        f1[j] = Math.min(f1[j - 1] + a1[j], f2[j - 1] + t2[j] + a1[j]);
        steps.push({
            table: [JSON.parse(JSON.stringify(f1)), JSON.parse(JSON.stringify(f2))],
            rowHeaders: ['Line 1', 'Line 2'],
            colHeaders: Array.from({length:n}, (_,i)=>"S"+(i+1)),
            activeCell: [0, j],
            compareCells: [[0, j-1], [1, j-1]],
            msg: `S${j+1} Line 1: min(stay on line 1, switch from line 2) = ${f1[j]}`
        });

        f2[j] = Math.min(f2[j - 1] + a2[j], f1[j - 1] + t1[j] + a2[j]);
        steps.push({
            table: [JSON.parse(JSON.stringify(f1)), JSON.parse(JSON.stringify(f2))],
            rowHeaders: ['Line 1', 'Line 2'],
            colHeaders: Array.from({length:n}, (_,i)=>"S"+(i+1)),
            activeCell: [1, j],
            compareCells: [[1, j-1], [0, j-1]],
            msg: `S${j+1} Line 2: min(stay on line 2, switch from line 1) = ${f2[j]}`
        });
    }

    let finalCost = Math.min(f1[n - 1] + xVals[0], f2[n - 1] + xVals[1]);
    steps.push({
        table: [JSON.parse(JSON.stringify(f1)), JSON.parse(JSON.stringify(f2))],
        rowHeaders: ['Line 1', 'Line 2'],
        colHeaders: Array.from({length:n}, (_,i)=>"S"+(i+1)),
        msg: `Done! Adding exit times. Final minimum cost = ${finalCost}`
    });
}

// --- Playback and Rendering UI ---

function renderTable(step) {
    if (!step) return;
    
    let html = '<table class="dp-table">';
    html += '<thead><tr><th></th>';
    for (let ch of step.colHeaders) {
        html += `<th>${ch}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let r = 0; r < step.table.length; r++) {
        html += `<tr><th>${step.rowHeaders[r] || r}</th>`;
        for (let c = 0; c < step.table[0].length; c++) {
            let isFilled = step.table[r][c] !== '-' && step.table[r][c] !== 0;
            let isActive = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
            let isCompare = step.compareCells && step.compareCells.some(cell => cell[0] === r && cell[1] === c);
            
            let classes = [];
            if (isFilled || (typeof step.table[r][c] === 'number')) classes.push('filled');
            if (isActive) classes.push('active');
            if (isCompare) classes.push('compare');

            html += `<td class="${classes.join(' ')}">${step.table[r][c] === 999 ? 'INF' : step.table[r][c]}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    canvas.innerHTML = html;
    stepExplanation.innerHTML = step.msg;
}

function updateUI() {
    stepIndicator.textContent = `Step ${currentStepIdx + 1} / ${steps.length}`;
    btnPrev.disabled = currentStepIdx === 0;
    btnNext.disabled = currentStepIdx === steps.length - 1;
    renderTable(steps[currentStepIdx]);
}

function nextStep() {
    if (currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        updateUI();
    } else {
        pausePlay();
    }
}

function prevStep() {
    if (currentStepIdx > 0) {
        currentStepIdx--;
        updateUI();
    }
}

function togglePlay() {
    if (playing) {
        pausePlay();
    } else {
        if (currentStepIdx === steps.length - 1) currentStepIdx = 0;
        playing = true;
        btnAutoPlay.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        playInterval = setInterval(nextStep, 800);
    }
}

function pausePlay() {
    playing = false;
    btnAutoPlay.innerHTML = '<i class="fa-solid fa-play"></i> Auto';
    clearInterval(playInterval);
}
