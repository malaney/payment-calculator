function PaymentCalculator(options) {
    this.defaults = {
        principal: 0,
        numPayments: 12,
        initialPayments: [],
        roundingPrecision: 1,
        roundingMethod: 'ceil',
        paymentGravity: 'top'
    };

    this.settings = jQuery.extend({}, this.defaults, options);
}

PaymentCalculator.prototype.setNumPayments = function(numPayments) {
    if (numPayments > 0) {
        this.settings.numPayments = numPayments;
    }
};

PaymentCalculator.prototype.setPrincipal = function(principal) {
    if (principal > 0) {
        this.settings.principal = principal;
    }
};

PaymentCalculator.prototype.setPaymentGravity = function(paymentGravity) {
    switch (paymentGravity.toLower()) {
        case 'top':
        case 'bottom':
            this.settings.paymentGravity = paymentGravity.toLower();
        break;
    }
};

PaymentCalculator.prototype.setRoundingPrecision = function(roundingPrecision) {
    switch (roundingPrecision) {
        case 0.001:
        case 0.01:
        case 0.1:
        case 1:
        case 10:
            this.settings.roundingPrecision = roundingPrecision;
        break;
    }
};

PaymentCalculator.prototype.setInitialPayments = function(initialPayments) {
    if (initialPayments instanceof Array) {
        this.settings.initialPayments = initialPayments;
    }
};


PaymentCalculator.prototype.initialPayments = function() {
    return this.settings.initialPayments;
};

PaymentCalculator.prototype.sumInitialPayments = function() {
    var total = 0;
    for (num in this.settings.initialPayments) {
        total += this.settings.initialPayments[num];
    }
    return total;
};

PaymentCalculator.prototype.sumPayments = function() {
    var total = 0;
    for (num in this.payments) {
        total += this.payments[num];
    }
    return total;
};

PaymentCalculator.prototype.calculatePaymentAmount = function(method) {
    return this.round( (this.settings.principal - this.sumInitialPayments()) / (this.settings.numPayments - this.settings.initialPayments.length) );

};

PaymentCalculator.prototype.generatePayments = function() {
    this.payments = [];
    var payAmt = this.calculatePaymentAmount();
    for (i=0; i < this.settings.numPayments; i++) {
        this.payments[i] = this.settings.initialPayments[i] || payAmt;
    }
    this.validatePayments();
    return this.payments;
};

PaymentCalculator.prototype.validatePayments = function() {
    if (this.sumPayments() > this.settings.principal) {
        console.log(this.payments);
        console.log(this.sumPayments() - this.settings.principal);
        // Always round this to nearest penny
        this.payments[this.payments.length - 1] -= this.round(this.sumPayments() - this.settings.principal, 0.01);
    }
};

PaymentCalculator.prototype.round = function(amount, precision) {
    if (typeof(precision) == 'undefined') {
        precision = this.settings.roundingPrecision;
    }
    return Math.round(amount / precision) * precision;
};
