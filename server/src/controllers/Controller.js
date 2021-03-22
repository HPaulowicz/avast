class Controller {
    constructor(...args) {
        this.req = args[0];
        this.res = args[1];
        this.method = (args[0] && args[0].method) ? args[0].method.toLowerCase() : undefined;
    }
}

module.exports = Controller;
