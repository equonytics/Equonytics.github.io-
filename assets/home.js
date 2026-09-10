// ---------- FORM HANDLING (AJAX + redirect) ----------
        const form = document.getElementById('assessment-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        window.location.href = 'thank-you.html';
                    } else {
                        alert('There was a problem submitting your request. Please email us directly at hello@equonytics.com');
                    }
                } catch (error) {
                    alert('Network error. Please email us directly at hello@equonytics.com');
                }
            });
        }

// ---------- MATURITY CURVE CHART ----------
function safeRenderMaturityChart() {
    if (typeof Plotly === 'undefined') {
        console.warn('Plotly failed to load. The maturity chart will not be displayed, but the rest of the page remains functional.');
        return;
    }
    try {
        renderMaturityCurve();
    } catch (error) {
        console.error('Error rendering maturity chart:', error);
    }
}

function renderMaturityCurve() {
            const mu = 0.88, sigmaLeft = 0.32, sigmaRight = 0.78;
            const xs = [], ys = [];
            for (let x = 0; x <= 4; x += 0.05) {
                const sigma = x < mu ? sigmaLeft : sigmaRight;
                xs.push(x);
                ys.push(Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma)));
            }
            const curve = {
                x: xs, y: ys, mode: 'lines', type: 'scatter',
                line: { color: 'rgba(237,232,222,0.75)', width: 2, shape: 'spline' },
                fill: 'tozeroy', fillcolor: 'rgba(199,154,78,0.16)',
                hovertemplate: 'Maturity ~%{x:.1f}<extra></extra>', showlegend: false
            };
            const stageX = [0, 1, 2, 3, 4];
            const stageY = stageX.map(x => {
                const sigma = x < mu ? sigmaLeft : sigmaRight;
                return Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
            });
            const stagePoints = {
                x: stageX, y: stageY, mode: 'markers', type: 'scatter',
                marker: { color: '#C79A4E', size: 10, line: { width: 1, color: '#0E1512' } },
                customdata: [
                    { title: 'Pre‑Analytics', desc: 'Unstructured', blurb: 'Messy data, conflicting KPI definitions, or missing fundamentals often hold organizations back.' },
                    { title: 'Analytics 1.0', desc: 'Descriptive', blurb: 'What happened? Dashboards and reports are used to understand the past.' },
                    { title: 'Analytics 2.0', desc: 'Predictive', blurb: 'What will happen? Models forecast future trends and identify risks.' },
                    { title: 'Analytics 3.0', desc: 'Prescriptive', blurb: 'What should we do? Recommendations are generated to optimize decisions.' },
                    { title: 'Analytics 4.0', desc: 'Autonomous', blurb: 'Let the system decide. Self‑learning systems take action automatically.' }
                ],
                hovertemplate: '<b>%{customdata.title}</b> — %{customdata.desc}<br>%{customdata.blurb}<extra></extra>',
                showlegend: false
            };
            const layout = {
                paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                font: { family: 'Inter', color: 'rgba(237,232,222,0.75)', size: 10 },
                margin: { l: 16, r: 16, t: 24, b: 34 },
                xaxis: { range: [0, 4], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false,
                    tickvals: [1,2,3,4], ticktext: ['Stage 1','Stage 2','Stage 3','Stage 4'],
                    tickfont: { family: 'IBM Plex Mono', size: 9 } },
                yaxis: { showticklabels: false, showgrid: false, zeroline: false, range: [0, 1.15] },
                shapes: [{ type: 'line', x0: mu, x1: mu, y0: 0, y1: 1.12, line: { color: '#C79A4E', width: 1, dash: 'dot' } }],
                annotations: [{ x: mu, y: 1.13, text: 'Most businesses', showarrow: false, xanchor: 'left', xshift: 6, font: { family: 'IBM Plex Mono', size: 9, color: '#C79A4E' } }],
                hoverlabel: { bgcolor: '#1D2B22', bordercolor: '#C79A4E', font: { family: 'Inter', size: 11, color: '#EDE8DD' } }
            };
            Plotly.newPlot('maturity-chart', [curve, stagePoints], layout, { displayModeBar: false, responsive: true });
        }


safeRenderMaturityChart();
