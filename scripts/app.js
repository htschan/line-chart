angular.module('myApp', ['n3-charts.linechart'])

.controller('DemoCtrl', function($scope) {
  var linearData = function(rowCount, seriesCount) {
    var data = [];

    for (var i = 0; i < seriesCount; i++) {
      for (var j = 0; j < rowCount; j++) {
        var row = data[j] || {x: j};
        row['series_' + i] = Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000;
        data[j] = row;
      }
    }

    return data;
  };

  var timedData = function(rowCount, seriesCount) {
    var data = [];

    var t = new Date();
    t.setMonth(t.getMonth() - 1);
    t = t.getTime();

    for (var i = 0; i < seriesCount; i++) {
      for (var j = 0; j < rowCount; j++) {
        var row = data[j] || {x: new Date(t + j*3600*1000*24)};
        row['series_' + i] = Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000;
        data[j] = row;
      }
    }

    return data;
  };

  $scope.examples = [];

  $scope.addExample = function(label, desc, data, options) {
    $scope.examples.push({
      label: label,
      data: data,
      description: desc || '',
      options: options,
      json: JSON.stringify(options, null, 2)
    });

    return $scope.addExample;
  };

  $scope.setCurrent = function(example) {
    $scope.current = example;
    $scope.json = JSON.stringify(example.options, null, 2);
  }

  var colors = d3.scale.category10();

  $scope.addExample

  ('Linear series', 'Standard linear data is fully supported and can be displayed as lines, columns and areas.', linearData(50, 1),
    {series: [{y: 'series_0', label: 'A simple sinusoid', color: colors(0)}]})

  ('Time series', 'Date objects are also accepted as abscissas values.', timedData(50, 1),
    {axes: {
      x: {type: 'date', tooltipFormatter: function(d) {return moment(d).fromNow()}}
    },
    series: [{y: 'series_0', label: 'A simple sinusoid', color: colors(0)}]}
    )

  ('Area series', 'Area series are fully supported.', linearData(50, 1),
    {series: [{y: 'series_0', color: colors(1), type: 'area'}]})

  ('Column series', 'Column series are fully suported too. The chart adjusts its x-axis so that columns are never cropped.', linearData(50, 1),
    {series: [{y: 'series_0', color: colors(2), type: 'column'}]})

  ('Two axes', 'Series can be represented on another axis, just say it in the options !', linearData(50, 2),
    {series: [
      {y: 'series_0', label: 'A labeled series', color: colors(3)},
      {y: 'series_1', axis: 'y2', color: colors(4)}
      ]}
      )

  ('Interpolation', 'D3.js adds some eye-candy when asked, and it is awesome', linearData(50, 5),
    {lineMode: 'bundle', series: [
    {y: 'series_0', color: colors(5)},
    {y: 'series_4', axis: 'y2', color: colors(6)}
    ]}
    )

  ('Several series', 'You can even mix series types !', linearData(50, 5),
    {lineMode: 'cardinal', series: [
    {y: 'series_0', type: 'area', color: colors(7)},
    {y: 'series_4', type: 'column', color: colors(8)},
    {y: 'series_4', color: colors(9)}
    ]}
    );

  $scope.setCurrent($scope.examples[6]);
})