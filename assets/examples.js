// ---------- CHART RENDERING (illustrative example analyses) ----------
function safeRenderCharts() {
    if (typeof Plotly === 'undefined') {
        console.warn('Plotly failed to load. Charts will not be displayed, but the rest of the page remains functional.');
        return;
    }
    try {
        renderRegressionChart();
        renderSlottingChart();
        renderChurnChart();
        renderBundleChart();
    } catch (error) {
        console.error('Error rendering charts:', error);
    }
}

function renderRegressionChart() {
            const points = [
                { otd: 80.4, margin: -0.42 }, { otd: 81.8, margin: -0.55 }, { otd: 83.1, margin: -0.31 },
                { otd: 84.6, margin: -0.48 }, { otd: 85.9, margin: -0.22 }, { otd: 87.3, margin: -0.36 },
                { otd: 88.7, margin: -0.18 }, { otd: 90.1, margin: -0.09 }, { otd: 91.4, margin: -0.14 },
                { otd: 92.6, margin: 0.21 }, { otd: 93.5, margin: 0.58 }, { otd: 94.2, margin: 0.94 },
                { otd: 95.0, margin: 1.32 }, { otd: 95.8, margin: 1.61 }, { otd: 96.6, margin: 2.02 },
                { otd: 97.3, margin: 2.38 }, { otd: 98.1, margin: 2.79 }, { otd: 98.9, margin: 3.15 },
                { otd: 99.5, margin: 3.44 }, { otd: 100.0, margin: 3.68 }
            ];
            const below = points.filter(p => p.otd < 92);
            const above = points.filter(p => p.otd >= 92);
            const belowTrace = {
                x: below.map(p => p.otd), y: below.map(p => p.margin),
                mode: 'markers', type: 'scatter',
                marker: { color: 'rgba(237,232,222,0.55)', size: 8 },
                hovertemplate: 'OTD %{x:.1f}% · Margin lift %{y:+.2f} pts<extra></extra>',
                showlegend: false
            };
            const aboveTrace = {
                x: above.map(p => p.otd), y: above.map(p => p.margin),
                mode: 'markers', type: 'scatter',
                marker: { color: '#C79A4E', size: 8 },
                hovertemplate: 'OTD %{x:.1f}% · Margin lift %{y:+.2f} pts<extra></extra>',
                showlegend: false
            };
            const belowFit = { x: [80, 92], y: [-0.5, -0.05], mode: 'lines', type: 'scatter', line: { color: 'rgba(237,232,222,0.55)', width: 2 }, hoverinfo: 'skip' };
            const aboveFit = { x: [92, 100], y: [0.05, 3.65], mode: 'lines', type: 'scatter', line: { color: '#C79A4E', width: 2.6 }, hoverinfo: 'skip' };
            const layout = {
                paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                font: { family: 'Inter, sans-serif', color: 'rgba(237,232,222,0.75)', size: 10 },
                margin: { l: 46, r: 16, t: 20, b: 38 },
                xaxis: { title: { text: 'On-time delivery', font: { family: 'IBM Plex Mono', size: 10 } }, ticksuffix: '%', range: [79, 101], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false },
                yaxis: { title: { text: 'Margin lift (pts)', font: { family: 'IBM Plex Mono', size: 10 } }, range: [-1, 4.2], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false },
                shapes: [{ type: 'line', x0: 92, x1: 92, y0: -1, y1: 4.2, line: { color: '#C79A4E', width: 1, dash: 'dot' } }],
                annotations: [{ x: 92, y: 4.05, text: '92% threshold', showarrow: false, xanchor: 'left', font: { family: 'IBM Plex Mono', size: 9, color: '#C79A4E' } }],
                hoverlabel: { bgcolor: '#1D2B22', bordercolor: '#C79A4E', font: { family: 'Inter, sans-serif', size: 11, color: '#EDE8DD' } }
            };
            Plotly.newPlot('regression-chart', [belowFit, aboveFit, belowTrace, aboveTrace], layout, { displayModeBar: false, responsive: true });
        }

        function renderSlottingChart() {
            const clusters = [
                { name: 'Fast movers', color: '#C79A4E', points: [{ freq: 92, weight: 1.2, vol: 80 }, { freq: 88, weight: 1.5, vol: 65 }, { freq: 95, weight: 0.8, vol: 75 }, { freq: 90, weight: 1.1, vol: 70 }, { freq: 85, weight: 1.4, vol: 55 }] },
                { name: 'Heavy movers', color: '#8CAA86', points: [{ freq: 30, weight: 12.5, vol: 40 }, { freq: 25, weight: 15.2, vol: 35 }, { freq: 35, weight: 11.8, vol: 45 }, { freq: 20, weight: 18.3, vol: 30 }] },
                { name: 'Mixed frequency', color: '#3E7350', points: [{ freq: 60, weight: 4.5, vol: 50 }, { freq: 55, weight: 5.2, vol: 48 }, { freq: 65, weight: 3.9, vol: 52 }, { freq: 50, weight: 6.1, vol: 42 }, { freq: 58, weight: 4.8, vol: 46 }] }
            ];
            const traces = [];
            clusters.forEach(cluster => {
                traces.push({
                    x: cluster.points.map(p => p.freq), y: cluster.points.map(p => p.weight),
                    mode: 'markers', type: 'scatter', name: cluster.name,
                    marker: { color: cluster.color, size: cluster.points.map(p => p.vol/3), line: { width: 1, color: '#0E1512' } },
                    hovertemplate: 'Freq: %{x:.0f}/day<br>Weight: %{y:.1f} kg<br>Vol: %{marker.size:.0f} units<extra></extra>'
                });
            });
            traces.push({ x: [92, 88], y: [1.2, 1.5], mode: 'lines', line: { color: 'rgba(199,154,78,0.3)', width: 1.5 }, hoverinfo: 'skip', showlegend: false });
            traces.push({ x: [30, 35], y: [12.5, 11.8], mode: 'lines', line: { color: 'rgba(140,170,134,0.3)', width: 1.5 }, hoverinfo: 'skip', showlegend: false });
            const layout = {
                paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                font: { family: 'Inter', color: 'rgba(237,232,222,0.75)', size: 10 },
                margin: { l: 50, r: 20, t: 20, b: 40 },
                xaxis: { title: 'Pick frequency (picks/day)', range: [10, 100], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false },
                yaxis: { title: 'Weight (kg)', range: [0, 20], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false },
                hoverlabel: { bgcolor: '#1D2B22', bordercolor: '#C79A4E', font: { family: 'Inter', size: 11, color: '#EDE8DD' } }
            };
            Plotly.newPlot('slotting-chart', traces, layout, { displayModeBar: false, responsive: true });
        }

        function renderChurnChart() {
            const customers = [
                { value: 12000, churn: 0.82 }, { value: 9500, churn: 0.75 }, { value: 18000, churn: 0.68 },
                { value: 8000, churn: 0.55 }, { value: 3000, churn: 0.85 }, { value: 20000, churn: 0.25 },
                { value: 6000, churn: 0.60 }, { value: 14000, churn: 0.30 }, { value: 5000, churn: 0.72 },
                { value: 25000, churn: 0.15 }, { value: 11000, churn: 0.45 }, { value: 7000, churn: 0.78 }
            ];
            const segments = [
                { name: 'High risk', color: '#C79A4E', filter: c => c.churn >= 0.7 },
                { name: 'Medium risk', color: '#8CAA86', filter: c => c.churn >= 0.4 && c.churn < 0.7 },
                { name: 'Low risk', color: '#3E7350', filter: c => c.churn < 0.4 }
            ];
            const traces = [];
            segments.forEach(seg => {
                const subset = customers.filter(seg.filter);
                traces.push({
                    x: subset.map(c => c.value), y: subset.map(c => c.churn),
                    mode: 'markers', type: 'scatter', name: seg.name,
                    marker: { color: seg.color, size: 10 },
                    hovertemplate: 'Value: $%{x:,.0f}<br>Churn: %{y:.0%}<extra></extra>'
                });
            });
            traces.push({ x: [2000, 26000], y: [0.7, 0.7], mode: 'lines', line: { color: '#C79A4E', width: 1.5, dash: 'dot' }, hoverinfo: 'skip', showlegend: false });
            const layout = {
                paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                font: { family: 'Inter', color: 'rgba(237,232,222,0.75)', size: 10 },
                margin: { l: 60, r: 20, t: 20, b: 40 },
                xaxis: { title: 'Customer lifetime value ($)', range: [1000, 28000], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false },
                yaxis: { title: 'Predicted churn probability', tickformat: ',.0%', range: [0, 1], gridcolor: 'rgba(237,232,222,0.07)', zeroline: false },
                annotations: [{ x: 27000, y: 0.72, text: 'Threshold', showarrow: false, xanchor: 'right', font: { family: 'IBM Plex Mono', size: 9, color: '#C79A4E' } }],
                hoverlabel: { bgcolor: '#1D2B22', bordercolor: '#C79A4E', font: { family: 'Inter', size: 11, color: '#EDE8DD' } }
            };
            Plotly.newPlot('churn-chart', traces, layout, { displayModeBar: false, responsive: true });
        }

        function renderBundleChart() {
            const categories = ['Packaging', 'Fasteners', 'Electrical', 'Adhesives', 'Safety'];
            const matrix = [
                [1.00, 0.45, 0.30, 0.25, 0.35],
                [0.45, 1.00, 0.55, 0.40, 0.30],
                [0.30, 0.55, 1.00, 0.50, 0.20],
                [0.25, 0.40, 0.50, 1.00, 0.15],
                [0.35, 0.30, 0.20, 0.15, 1.00]
            ];
            const data = [{
                z: matrix, x: categories, y: categories, type: 'heatmap',
                colorscale: [[0, '#14231A'], [0.5, '#3E7350'], [1, '#C79A4E']],
                hovertemplate: '%{y} + %{x}: %{z:.0%}<extra></extra>',
                colorbar: { title: { text: 'Co-purchase', font: { family: 'IBM Plex Mono', size: 9 } }, tickfont: { family: 'IBM Plex Mono', size: 9 }, tickformat: ',.0%' }
            }];
            const layout = {
                paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                font: { family: 'Inter', color: 'rgba(237,232,222,0.75)', size: 10 },
                margin: { l: 70, r: 20, t: 20, b: 70 },
                xaxis: { tickangle: -35, tickfont: { family: 'IBM Plex Mono', size: 9 } },
                yaxis: { tickfont: { family: 'IBM Plex Mono', size: 9 } },
                hoverlabel: { bgcolor: '#1D2B22', bordercolor: '#C79A4E', font: { family: 'Inter', size: 11, color: '#EDE8DD' } }
            };
            Plotly.newPlot('bundle-chart', data, layout, { displayModeBar: false, responsive: true });
        }

        
safeRenderCharts();
