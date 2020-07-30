document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".calc__form");
    const summary = document.querySelector(".calc__summary");

    new Calc(form, summary);
});

function Calc(form, summary) {

    //Price var object
    this.prices = {
        products: 0.5,
        orders: 0.25,
        package: {
            basic: 0,
            professional: 25,
            premium: 60,
        },
        accounting: 40,
        terminal: 10
    };

    //Form elements
    this.form = {
        products: form.querySelector('#products'),
        orders: form.querySelector('#orders'),
        package: form.querySelector('#package'),
        accounting: form.querySelector('#accounting'),
        terminal: form.querySelector('#teminal'),
    }

    //Summary elements
    this.summary = {
        list: summary.querySelector('ul'),
        items: summary.querySelector('ul').children,
        total: {
            container: summary.querySelector('#total-price'),
            price: summary.querySelector('.total-price')
        }
    };
}


//InputEvent summary method - counting prices
Calc.prototype.inputEvent = function (element) {
    const id = element.currentTarget.id;
    const value = element.currentTarget.value;
    const singlePrice = this.prices[id];
    const totalPrice = value * singlePrice;

    //Starting updateSummary method
    this.updateSummary(id, value + ' * $' + singlePrice, totalPrice, function (item, calc, total) {
        if (value < 0) {
            calc.innerHTML = null;
            total.innerText = 'Value should be greater than 0';
        }
        if (value.length === 0) {
            item.classList.remove('open');
        }
    })
}

//UpdateSummary summary method - updating data in summary section
Calc.prototype.updateSummary = function (id, calc, total, callback) {
    const summary = this.summary.list.querySelector('[data-id=" + id + "]');
    const summaryCalc = summary.querySelector('.item__calc');
    const summaryTotal = summary.querySelector('.item__price');

    //Adding 'open' class
    summary.classList.add('open');

    if (summaryCalc !== null) {
        summaryCalc.innerText = calc;
    }

    summaryTotal.innterText = "$" + total;

    if (typeof callback === "function") {
        callback(summary, summaryCalc, summaryTotal);
    }
};

//Toggle event on select
Calc.prototype.selectEvent = function (element) {
    this.form.package.classList.toggle('open');

    const value = typeof element.target.dataset.value !== 'undefined' ? element.target.dataset.value : '';
    const text = typeof element.target.dataset.value !== 'undefined' ? element.target.innerText : 'Choose package';

    //Actualization condition
    if (value.length > 0) {
        this.form.package.dataset.value = value;
        this.form.package.querySelector('.select__input').innerText = text;

        this.updateSummary('package', text, this.prices.package[value]);
    }
};

//Checkbox events
Calc.prototype.checkboxEvent = function (element) {
    const checkbox = element.currentTarget;
    const id = checkbox.id;
    const checked = element.currentTarget.checked;

    this.updateSummary(id, undefined, this.prices[id], function (item) {
        if (!checked) {
            item.classList.remove("open");
        }
    });
};

//AddEvents method on all elements
Calc.prototype.addEvents = function () {
    //Inputs
    this.form.products.addEventListener("change", this.inputEvent.bind(this));
    this.form.products.addEventListener("keyup", this.inputEvent.bind(this));
    this.form.orders.addEventListener("change", this.inputEvent.bind(this));
    this.form.orders.addEventListener("keyup", this.inputEvent.bind(this));

    // Select
    this.form.package.addEventListener("click", this.selectEvent.bind(this));

    // Checkboxes
    this.form.accounting.addEventListener("change", this.checkboxEvent.bind(this));
    this.form.terminal.addEventListener("change", this.checkboxEvent.bind(this));
};


//AddEvents on summing funtion
Calc.prototype.updateTotal = function () {
    const show = this.summary.list.querySelectorAll(".open").length > 0;

    if (show) {
        const productSum = this.form.products.value < 0 ? 0 : this.form.products.value * this.prices.products;
        const ordersSum = this.form.orders.value < 0 ? 0 : this.form.orders.value * this.prices.orders;
        const packagePrice = this.form.package.dataset.value.length === 0 ? 0 : this.prices.package[this.form.package.dataset.value];
        const accounting = this.form.accounting.checked ? this.prices.accounting : 0;
        const terminal = this.form.terminal.checked ? this.prices.terminal : 0;

        this.summary.total.price.innerText = "$" + (productSum + ordersSum + packagePrice + accounting + terminal);

        this.summary.total.container.classList.add("open");
    } else {
        this.summary.total.container.classList.remove("open");
    }
};






