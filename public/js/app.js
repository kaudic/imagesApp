const app = {
    init: async () => {
        console.log('init script launched');
        app.addListennersToAction();
        app.drawCharts();

    },
    addListennersToAction: () => {

    },
    drawCharts: () => {
        app.drawBarChart();
        app.drawPieChart();
    },
    drawBarChart: async () => {

        const countInfoData = await fetch(`${BASE_URL}/images/countTagAndNotTagguedPerYear`).then((res) => res.json());

        // Load the Visualization API and the corechart package.
        google.charts.load('current', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);

        // Callback that creates and populates a data table,
        // instantiates the pie chart, passes in the data and
        // draws it.
        function drawChart() {

            // Create the data table.
            const data = google.visualization.arrayToDataTable(countInfoData.data);

            // Set chart options
            const options = {
                title: 'Nombre d\'images tagguées et non tagguées par an',
                width: 1700,
                height: 700,
                backgroundColor: '#E4E4E4',
                legend: { position: 'top', maxLines: 3 },
                bar: { groupWidth: '75%' },
                isStacked: true,
                responsive: true,
                annotations: {
                    alwaysOutside: true,
                    textStyle: {
                        fontSize: 14,
                    }
                },
                vAxis: {
                    title: 'Nombre d\'images',
                    viewWindow: {
                        min: [0],
                        max: [3700]
                    }
                }
            };

            // Instantiate and draw our chart, passing in some options.
            const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }

    },
    drawPieChart: async () => {

        const countInfoData = await fetch(`${BASE_URL}/images/countTagAndNotTaggued`).then((res) => res.json());
        console.log(JSON.stringify(countInfoData.data));

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            const data = google.visualization.arrayToDataTable(countInfoData.data);

            const options = {
                title: 'Nombre d\'images tagguées et non tagguées'
            };

            const chart = new google.visualization.PieChart(document.getElementById('pieChart_div'));

            chart.draw(data, options);
        }
    }

};

document.addEventListener('DOMContentLoaded', app.init);