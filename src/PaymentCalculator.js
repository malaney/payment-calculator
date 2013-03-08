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
    this.openSlots = this.settings.numPayments;
    this.setInitialPayments(this.settings.initialPayments);
}

PaymentCalculator.prototype.setNumPayments = function(numPayments) {
    if (numPayments > 0) {
        this.settings.numPayments = numPayments;
        this.openSlots = numPayments;
    }
};

PaymentCalculator.prototype.setPrincipal = function(principal) {
    if (principal > 0) {
        this.settings.principal = principal;
    }
};

PaymentCalculator.prototype.setPaymentGravity = function(paymentGravity) {
    switch (paymentGravity.toLowerCase()) {
        case 'top':
        case 'bottom':
            this.settings.paymentGravity = paymentGravity.toLowerCase();
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
            this.settings.roundingPrecision = parseFloat(roundingPrecision);
        break;
    }
};

PaymentCalculator.prototype.setInitialPayments = function(initialPayments) {
    if (initialPayments instanceof Array) {
        for (var i=0; i < initialPayments.length; i++) {
            initialPayments[i] = parseInt(initialPayments[i]);
        }
        this.settings.initialPayments = initialPayments;
        if (this.settings.numPayments <= this.settings.initialPayments.length) {
            this.settings.numPayments = this.settings.initialPayments.length;
        }

        this.openSlots = 0;
        for (var i=0; i < this.settings.numPayments; i++) {
            if (initialPayments[i] > 0) {
            } else {
                this.openSlots++;
            }
        }

        if (!this.openSlots) {
            throw "There are no open slots available for payment calculation."
        }
    }
};

PaymentCalculator.prototype.initialPayments = function() {
    return this.settings.initialPayments;
};

PaymentCalculator.prototype.sumInitialPayments = function() {
    var total = 0;
    for (var num in this.settings.initialPayments) {
        total += this.settings.initialPayments[num];
    }
    return total;
};

PaymentCalculator.prototype.sumPayments = function() {
    var total = 0;
    for (var num in this.payments) {
        total += this.payments[num];
    }
    return this.round(total, 0.01);
};

PaymentCalculator.prototype.calculatePaymentAmount = function(method) {
    return this.round( (this.settings.principal - this.sumInitialPayments()) / this.openSlots );

};

PaymentCalculator.prototype.generatePayments = function() {
    this.payments = [];
    var payAmt = this.calculatePaymentAmount();
    
    for (var i=0; i < this.settings.numPayments; i++) {
        this.payments[i] = (typeof this.settings.initialPayments[i] !== 'undefined') && (this.settings.initialPayments[i] > 0) ? this.settings.initialPayments[i] : payAmt;
    }
    this.validatePayments();
    return this.payments;
};

PaymentCalculator.prototype.validatePayments = function() {
    if (this.sumPayments() > this.settings.principal) {
        var adjustedPaymentIndex = (this.settings.paymentGravity == 'top') ? this.getMaxAdjustedPaymentIndex() : this.getMinAdjustedPaymentIndex();
        this.payments[adjustedPaymentIndex] -= this.round(this.sumPayments() - this.settings.principal, 0.01); // Always round this to nearest penny
    }
    if (this.sumPayments() < this.settings.principal) {
        var adjustedPaymentIndex = (this.settings.paymentGravity == 'top') ? this.getMinAdjustedPaymentIndex() : this.getMaxAdjustedPaymentIndex();
        this.payments[adjustedPaymentIndex] += this.round(this.settings.principal - this.sumPayments(), 0.01); // Always round this to nearest penny
    }
};

PaymentCalculator.prototype.getMinAdjustedPaymentIndex = function() {
    for (var x=0; x < this.payments.length; x++) {
        if ((typeof this.settings.initialPayments[x] === 'undefined') || (this.settings.initialPayments[x] == 0)) {
            return x;
        }
    }
};

PaymentCalculator.prototype.getMaxAdjustedPaymentIndex = function() {
    for (var x=this.payments.length - 1; x > -1; x--) {
        if ((typeof this.settings.initialPayments[x] === 'undefined') || (this.settings.initialPayments[x] == 0)) {
            return x;
        }
    }
};

PaymentCalculator.prototype.round = function(amount, precision) {
    if (typeof(precision) == 'undefined') {
        precision = this.settings.roundingPrecision;
    }
    return Math.round(amount / precision) * precision;
};
