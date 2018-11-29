define([
    'jquery',
    'js-cookie',
    'moment',
    'underscore',
    'models/enterprise_coupon_model',
    'models/coupon_model',
    'test/mock_data/coupons'
],
    function($,
             Cookies,
             moment,
             _,
             EnterpriseCoupon,
             Coupon,
             MockCoupons) {
        'use strict';

        var enterpriseCouponData = MockCoupons.enterpriseCouponModelData;

        describe('Coupon model', function() {
            describe('url', function() {
                it('should be /api/v2/enterprise/coupons/ for new instances', function() {
                    var instance = new EnterpriseCoupon();
                    expect(instance.url()).toEqual('/api/v2/enterprise/coupons/');
                });

                it('should have a trailing slash for existing instances', function() {
                    var id = 1,
                        instance = new EnterpriseCoupon({id: id});
                    expect(instance.url()).toEqual('/api/v2/enterprise/coupons/' + id + '/');
                });
            });

            describe('validation', function() {
                var model;

                beforeEach(function() {
                    spyOn($, 'ajax');
                    model = EnterpriseCoupon.findOrCreate(enterpriseCouponData, {parse: true});
                });

                it('should validate enterprise customer is required', function() {
                    model.set('enterprise_customer', '');
                    model.validate();
                    expect(model.isValid()).toBeFalsy();
                });

                it('should validate enterprise customer is required', function() {
                    model.set('enterprise_customer_catalog', '');
                    model.validate();
                    expect(model.isValid()).toBeFalsy();
                });
            });

            describe('save', function() {
                it('should POST enrollment data', function() {
                    var model, args, ajaxData;
                    spyOn($, 'ajax');
                    model = EnterpriseCoupon.findOrCreate(enterpriseCouponData, {parse: true});
                    model.save();
                    expect($.ajax).toHaveBeenCalled();
                    args = $.ajax.calls.argsFor(0);
                    ajaxData = JSON.parse(args[0].data);
                    expect(ajaxData.enterprise_customer).toEqual(enterpriseCouponData.enterprise_customer);
                    expect(ajaxData.enterprise_customer_catalog)
                        .toEqual(enterpriseCouponData.enterprise_customer_catalog);
                });

                it('should call Coupon model when saved', function() {
                    var model = EnterpriseCoupon.findOrCreate(enterpriseCouponData, {parse: true}),
                        title = 'Coupon title';
                    spyOn(Coupon.prototype, 'save');
                    model.save(
                        {title: title},
                        {patch: true}
                    );

                    expect(Coupon.prototype.save).toHaveBeenCalledWith(
                        {title: title},
                        {patch: true}
                    );
                });
            });
        });
    });