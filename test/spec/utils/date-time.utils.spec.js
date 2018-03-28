'use strict';

describe('Utils: DateTime', function () {
    var DateTimeUtil;

    // Initialize the controller and a mock scope
    beforeEach(function() {
        module('measureApp');

        inject(function (_DateTimeUtil_) {
            DateTimeUtil = _DateTimeUtil_;
        });
    });

    it('should parse DDMMYYYY and return date object', function() {
        var stringDate = '22-09-1989';
        var expected = new Date('1989/9/22');

        var result = DateTimeUtil.convertDDMMYYYToDate(stringDate);

        expect(result).toEqual(expected);
    });

    it('should should return date object if passed as an argument', function() {
        var expected = new Date('1989/9/22');
        var result = DateTimeUtil.convertDDMMYYYToDate(expected);

        expect(result).toBe(expected);
    });

});
