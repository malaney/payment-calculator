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
        for (i=0; i < initialPayments.length; i++) {
            initialPayments[i] = parseInt(initialPayments[i]);
        }
        this.settings.initialPayments = initialPayments;
        if (this.settings.numPayments <= this.settings.initialPayments.length) {
            this.settings.numPayments = this.settings.initialPayments.length;
        }

        this.openSlots = 0;
        for (i=0; i < this.settings.numPayments; i++) {
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
    return this.round( (this.settings.principal - this.sumInitialPayments()) / this.openSlots );

};

PaymentCalculator.prototype.generatePayments = function() {
    this.payments = [];
    var payAmt = this.calculatePaymentAmount();
    
    for (i=0; i < this.settings.numPayments; i++) {
        this.payments[i] = (typeof this.settings.initialPayments[i] !== 'undefined') && (this.settings.initialPayments[i] > 0) ? this.settings.initialPayments[i] : payAmt;
    }
    this.validatePayments();
    return this.payments;
};

PaymentCalculator.prototype.validatePayments = function() {
    // initialize adjustedPaymentIndex
    var adjustedPaymentIndex = (this.settings.paymentGravity == 'top') ? 
        0 : this.payments.length - 1; 

    if (this.settings.paymentGravity == 'top') {
        for (var x=0; x < this.payments.length; x++) {
            if (this.settings.initialPayments[x]) {
               // 
            } else {
                adjustedPaymentIndex = x;
                break;
            }
        }
    } else {
        for (var x=this.payments.length; x > -1; x--) {
            if (this.settings.initialPayments[x]) {
                // 
            } else {
                adjustedPaymentIndex = x;
                break;
            }
        }
    }
    if (this.sumPayments() > this.settings.principal) {
        // Always round this to nearest penny
        this.payments[adjustedPaymentIndex] -= this.round(this.sumPayments() - this.settings.principal, 0.01);
    }
    if (this.sumPayments() < this.settings.principal) {
        // Always round this to nearest penny
        this.payments[adjustedPaymentIndex] += this.round(this.settings.principal - this.sumPayments(), 0.01);
    }

};

PaymentCalculator.prototype.round = function(amount, precision) {
    if (typeof(precision) == 'undefined') {
        precision = this.settings.roundingPrecision;
    }
    return Math.round(amount / precision) * precision;
};
