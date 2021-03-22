const Controller = require('./Controller');
const Task = require('../models/task/Task')

class TaskController extends Controller {
    constructor(...args) {
        super(...args);
    }
    async recording() {
        return {
            get: async () => Task.getRecords()
        }[this.method]();
    }
    async stats() {
        return {
            get: async () => Task.getStats(),
        }[this.method]();
    }
}

module.exports = TaskController;
