'use strict';

describe('Filter: CardType', function () {
    var $filter;

    angular.module('angular-stripe', []).provider('stripe', {
        setPublishableKey: function() { },
        $get: function() {}
    });

    // Initialize the controller and a mock scope
    beforeEach(function() {
        module('measureApp');

        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('Should recognise VISA card', function () {
        var visaA = '4917610000000000';
        var visaB = '4444333322221111';
        var visaC = '4917610000000000';

        var resultA = $filter('cardType')(visaA, '');
        var resultB = $filter('cardType')(visaB, '');
        var resultC = $filter('cardType')(visaC, '');

        expect(resultA).toBe('assets/images/visa-small.png');
        expect(resultB).toBe('assets/images/visa-small.png');
        expect(resultC).toBe('assets/images/visa-small.png');
    });

    it('should recognize MASTERCARD card', function() {
        var mastercardA = '5555555555554444';
        var mastercardB = '5454545454545454';

        var resultA = $filter('cardType')(mastercardA, '');
        var resultB = $filter('cardType')(mastercardB, '');


        expect(resultA).toBe('assets/images/mastercard-small.png');
        expect(resultB).toBe('assets/images/mastercard-small.png');
    });

    it('should recognize AMEX card', function() {
        var amexA = '34343434343434';

        var resultA = $filter('cardType')(amexA, '');

        expect(resultA).toBe('assets/images/amex-small.png');
    });

    it('Should recognise DISCOVER card', function () {
        var discoverA = '6011000400000000';

        var resultA = $filter('cardType')(discoverA, '');

        expect(resultA).toBe('assets/images/discover-small.png');
    });

    it('Should recognise DINERS card', function () {
        var dinersA = '36700102000000';
        var dinersB = '36148900647913';

        var resultA = $filter('cardType')(dinersA, '');
        var resultB = $filter('cardType')(dinersB, '');

        expect(resultA).toBe('assets/images/dinner-small.png');
        expect(resultB).toBe('assets/images/dinner-small.png');
    });

    it('Should recognise JCB card', function () {
        var jcbA = '3528000700000000';

        var resultA = $filter('cardType')(jcbA, '');

        expect(resultA).toBe('assets/images/jcb-small.png');
    });

    it('Should recognise VISA ELECTRON card', function () {
        var visaElectronA = '4917300800000000';

        var resultA = $filter('cardType')(visaElectronA, '');

        expect(resultA).toBe('assets/images/visa-small.png');
    });
});
