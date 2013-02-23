Array.prototype.sum = function() {
  return this.reduce(function(a,b){return a+b;});
}


var paymentCalculator = paymentCalculator || {};

paymentCalculator.lib = {
    init:function(options) {
        var defaults = {
            principal: 0, //
            numPayments: 12,
            initialPayments: [], // an indexed array of payments that are already locked in
            roundingPrecision: 1, // 1, 10, 100
            roundingMethod: 'ceil', // ceil or floor
            paymentGravity: 'top' // top or bottom.  Where to play largest payment
        }
        this.settings = jQuery.extend({}, defaults, options);
    },
    setNumPayments: function(numPayments) {
        this.settings.numPayments = numPayments;
    },
    setInitialPayments: function(initialPayments) {
        this.settings.initialPayments = initialPayments;
    },
    setPrincipal: function(principal) {
        this.settings.principal = principal;
    },
    setRoundingMethod: function(roundingMethod) {
        switch (roundingMethod) {
            case 'ceil':
            case 'floor':
                this.settings.roundingMethod = roundingMethod;
            break;
            default:
                this.settings.roundingMethod = 'floor';
            break;
        }
        this.settings.roundingMethod = roundingMethod;
    },
    setRoundingPrecision: function(roundingPrecision) {
        switch (roundingPrecision) {
            case .01:
            case .1:
            case 1:
            case 10:
                this.settings.roundingPrecision = roundingPrecision;
            break;

            default:
                this.settings.roundingPrecision = 1;
            break;
        }
    },
    setPaymentGravity: function(paymentGravity) {
        switch (paymentGravity) {
            case 'top':
            case 'bottom':
                this.settings.paymentGravity = paymentGravity;
            break;
            default:
                this.settings.paymentGravity = 'top';
            break;
        }
    },
    generatePayments: function() {
        var payAmt = paymentCalculator.lib.calculatePaymentAmount();
        this.payments = [];
        for (i=0; i < this.settings.numPayments; i++) {
            this.payments[i] = this.settings.initialPayments[i] || payAmt;
        }
        if (this.settings.paymentGravity == 'top') {
            for (var i=0; i < this.payments.length; i++) {
                while (this.payments.sum() > this.settings.principal) {
                    if (!this.settings.initialPayments[i]) {
                        if (this.payments[i]) {
                            this.payments[i] = this.payments[i] - 1;
                        }
                    } else {
                        break;
                    }
                }
                while (this.payments.sum() < this.settings.principal) {
                    if (!this.settings.initialPayments[i]) {
                        if (this.payments[i]) {
                            this.payments[i] = this.payments[i] + 1;
                        }
                    } else {
                        break;
                    }
                }
            }
        } else {
            for (var i=this.payments.length; i > 0; --i) {
                while (this.payments.sum() > this.settings.principal) {
                    if (this.payments[i]) {
                        this.payments[i] = this.payments[i] - 1;
                    } else {
                        break;
                    }
                }
                while (this.payments.sum() < this.settings.principal) {
                    if (this.payments[i]) {
                        this.payments[i] = this.payments[i] + 1;
                    } else {
                        break;
                    }
                }
            }
        }
        return this.payments;
    },
    calculatePaymentAmount: function() {
        switch (this.settings.roundingMethod) {
            case 'ceil':
                return paymentCalculator.lib.calculatePaymentAmountCeil();
            break;
            case 'floor':
                return paymentCalculator.lib.calculatePaymentAmountFloor();
            break;
        }
    },
    calculatePaymentAmountCeil: function() {
        return Math.ceil((this.settings.principal - this.settings.initialPayments.sum()) / this.settings.numPayments / this.settings.roundingPrecision) * this.settings.roundingPrecision;
    },
    calculatePaymentAmountFloor: function() {
        return Math.floor((this.settings.principal - this.settings.initialPayments.sum()) / this.settings.numPayments / this.settings.roundingPrecision) * this.settings.roundingPrecision;
    }
};


paymentCalculator.lib.init();
paymentCalculator.lib.setPrincipal(1800);
paymentCalculator.lib.setRoundingPrecision(1);
paymentCalculator.lib.setRoundingMethod('floor');
paymentCalculator.lib.setPaymentGravity('top');
paymentCalculator.lib.setInitialPayments([500, 76]);
console.log(paymentCalculator.lib.generatePayments());
