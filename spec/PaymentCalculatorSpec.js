describe("PaymentCalculator", function() {
    var paymentCalculator;
    
    beforeEach(function() {
      paymentCalculator = new PaymentCalculator();
    });
    
    it("should be able to set numPayments", function() {
      paymentCalculator.setNumPayments(5);
      expect(paymentCalculator.settings.numPayments).toEqual(5);
    });
    
    it("should not be able to set invalid numPayments", function() {
      paymentCalculator.setNumPayments(-1);
      expect(paymentCalculator.settings.numPayments).toEqual(paymentCalculator.defaults.numPayments);
      paymentCalculator.setNumPayments('asdf');
      expect(paymentCalculator.settings.numPayments).toEqual(paymentCalculator.defaults.numPayments);
    });

    it("should be able to set rounding precision properly", function() {
        paymentCalculator.setRoundingPrecision(1);
        expect(paymentCalculator.settings.roundingPrecision).toEqual(1);
        paymentCalculator.setRoundingPrecision(.1);
        expect(paymentCalculator.settings.roundingPrecision).toEqual(.1);
        paymentCalculator.setRoundingPrecision(0.1);
        expect(paymentCalculator.settings.roundingPrecision).toEqual(0.1);
        paymentCalculator.setRoundingPrecision(0.01);
        expect(paymentCalculator.settings.roundingPrecision).toEqual(0.01);
        paymentCalculator.setRoundingPrecision(0.001);
        expect(paymentCalculator.settings.roundingPrecision).toEqual(0.001);
        paymentCalculator.setRoundingPrecision(0.0001);
        expect(paymentCalculator.settings.roundingPrecision).not.toEqual(0.0001);
    });
    
    it("should allow for setting an array of initial payments", function() {
        var arr = [20,20];
        paymentCalculator.setInitialPayments(arr);
        expect(paymentCalculator.settings.initialPayments.length).toEqual(2);
        expect(paymentCalculator.sumInitialPayments()).toEqual(40);
    });

    it("should be able to calculate payments", function() {
    });


    it("should be able to round payments", function() {
    });

    it("should allow for certain payments to be preset", function() {
    });

    describe("when numPayments is 2 and principal is $100", function() {
        beforeEach(function() {
            paymentCalculator.setNumPayments(2);  
            paymentCalculator.setPrincipal(100);
            paymentCalculator.generatePayments();
        });

        it("should show 2 payments of $50", function() {
            expect(paymentCalculator.sumPayments()).toEqual(100);
            expect(paymentCalculator.generatePayments()).toEqual([50,50]);
        });
    });
    
    describe("when numPayments is 4 and prinicipal is $100 and initialPayment of 50", function() {
        beforeEach(function() {
            paymentCalculator.setNumPayments(4);  
            paymentCalculator.setPrincipal(100);
            paymentCalculator.setInitialPayments([50]);
            paymentCalculator.setRoundingPrecision(0.01);
            paymentCalculator.generatePayments();
        });

        it("should show 4 remaining payments", function() {
            expect(paymentCalculator.generatePayments().length).toEqual(4);
        });

        it("should show first payment of 50", function() {
            expect(paymentCalculator.generatePayments()[0]).toEqual(50);
        });

        it("should show 2 payments of 16.67 and 1 of 16.66", function() {
            expect(paymentCalculator.generatePayments()[1]).toEqual(16.67);
            expect(paymentCalculator.generatePayments()[2]).toEqual(16.67);
            expect(paymentCalculator.generatePayments()[3]).toEqual(16.66);
        });

        it("should sum all payments to 100", function() {
            expect(paymentCalculator.sumPayments()).toEqual(100);
        });

    });
});
