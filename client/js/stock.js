document.getElementById("greet").innerHTML = "<b>Welcome " + window.localStorage.getItem('user') + "!</b>";
button = document.getElementById("getData");
button.addEventListener("click", refreshGraph);

let ctx = document.getElementById('chart1').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 300;
let color = Chart.helpers.color;
var cfg = {
  data: {
    datasets: [{
      label: 'Corporation',
      backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
      borderColor: window.chartColors.red,
      data: [],
      type: 'line',
      pointRadius: 0,
      fill: false,
      lineTension: 0,
      borderWidth: 2
    }]
  },
  options: {
    animation: {
      duration: 0
    },
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
        offset: true,
        ticks: {
          major: {
            enabled: true,
            fontStyle: 'bold'
          },
          source: 'data',
          autoSkip: true,
          autoSkipPadding: 75,
          maxRotation: 0,
          sampleSize: 100
        },

      }],
      yAxes: [{
        gridLines: {
          drawBorder: false
        },
        scaleLabel: {
          display: true,
          labelString: 'Closing price ($)'
        }
      }]
    },
    tooltips: {
      intersect: false,
      mode: 'index',
      callbacks: {
        label: function (tooltipItem, myData) {
          var label = myData.datasets[tooltipItem.datasetIndex].label || '';
          if (label) {
            label += ': ';
          }
          label += parseFloat(tooltipItem.value).toFixed(2);
          return label;
        }
      }
    }
  }
};
let chart = new Chart(ctx, cfg);

async function refreshGraph(e) {
  let data = await getData(e);
  let metaData = data["Meta Data"];
  let priceData = data["Time Series (Daily)"];
  let graphData = processData(priceData);
  chart.config.data.datasets[0].data = graphData;
  chart.config.data.datasets[0].label = metaData["2. Symbol"];
  chart.update();
}

async function getData(e) {
  list = document.getElementById("company");
  company = list.options[list.selectedIndex].value;
  let res = await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + company +
    "&apikey=TKY4WALC6M02J83K");
  let data = await res.json();
  return data;
}

function processData(data) {
  graphData = [];
  for (let item in data) {
    let date = moment(item);
    let close = data[item]["4. close"];
    graphData.push({
      t: date,
      y: close
    });
  };
  return graphData;
}