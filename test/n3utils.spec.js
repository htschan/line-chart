describe('n3utils', function() {

  describe('getBestColumnWidth', function() {
    it('should handle no data', inject(function(n3utils) {
      expect(n3utils.getBestColumnWidth({}, [])).toBe(10);
    }));
  });

  it('should compute data per series', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8}
    ];

    var xFormatter = function(text) {return ''};

    var options = {
      axes: {x: {key: 'x', tooltipFormatter: xFormatter}},
      series: [
        {y: 'value', axis: 'y2', color: 'steelblue'},
        {y: 'foo', color: 'red', type: 'area'}
      ]
    };

    var expected = [{
      xFormatter: xFormatter,
      name: 'value', color: 'steelblue', axis: 'y2', type: 'line', index: 0,
      values: [
        {x: 0, value: 4, axis: 'y2'}, {x: 1, value: 8, axis: 'y2'}
      ]
    }, {
      xFormatter: xFormatter,
      name: 'foo', color: 'red', axis: 'y', type: 'area', index: 1,
      values: [
        {x: 0, value: 4.154, axis: 'y'}, {x: 1, value: 8.15485, axis: 'y'}
      ]
    }];

    var computed = n3utils.getDataPerSeries(data, options);

    expect(computed).toEqual(expected);

  }));

  it('should compute the widest y value', inject(function(n3utils) {
    var data = [
    {x: 0, foo: 4.154, value: 4},
    {x: 1, foo: 8.15485, value: 8},
    {x: 2, foo: 1.1548578, value: 15},
    {x: 3, foo: 1.154, value: 16},
    {x: 4, foo: 2.45, value: 23},
    {x: 5, foo: 4, value: 42}
    ];

    var series = [{y: 'value'}];
    expect(n3utils.getWidestOrdinate(data, series)).toBe(15);

    series = [{y: 'value'}, {y: 'foo'}];
    expect(n3utils.getWidestOrdinate(data, series)).toBe(1.1548578);
  }));

  describe('adjustMargins', function() {
    beforeEach(inject(function(n3utils) {
      spyOn(n3utils, 'getDefaultMargins').andReturn(
        {top: 20, right: 50, bottom: 30, left: 50}
        );
    }));

    it('should return default margins for no series', inject(function(n3utils) {
      var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
      ];

      var dimensions = {left: 10, right: 10};

      var options = {series: []};
      n3utils.adjustMargins(dimensions, options, data);

      expect(dimensions).toEqual({left: 30, right: 50, top: 20, bottom: 30});
    }));
    
    it('should adjust margins for one left series', inject(function(n3utils) {
      var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
      ];

      var dimensions = {left: 10, right: 10};

      var options = {series: [{y: 'value'}]};
      n3utils.adjustMargins(dimensions, options, data);
      expect(dimensions).toEqual(
        {left: 40, right: 50, top: 20, bottom: 30}
      );
    }));

    it('should adjust margins for two left series', inject(function(n3utils) {
      var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
      ];

      var dimensions = {left: 10, right: 10};

      var options = {series: [{y: 'value'}, {y: 'foo'}]};
      n3utils.adjustMargins(dimensions, options, data);
      expect(dimensions).toEqual({left: 75, right: 50, top: 20, bottom: 30});
    }));

    it('should adjust margins for one left series and one right series', inject(function(n3utils) {
      var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
      ];

      var dimensions = {left: 10, right: 10};

      var options = {series: [{y: 'value'}, {axis: 'y2', y: 'foo'}]};
      n3utils.adjustMargins(dimensions, options, data);
      expect(dimensions).toEqual(
        {left: 40, right: 75, top: 20, bottom: 30}
        );
    }));

  });
});
