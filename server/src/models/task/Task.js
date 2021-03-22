const { records } = require('../../data/task.recording.json');

class Task {
    static getRecords() {
        return records;
    }
    static getStats() {
        /**
         * Simply sorting the array
         * Complexity is (O(n log n)) - comparison sort requires looping over n items log n times
         */
        const sorted = records.sort((a, b) => a.time - b.time);

        const stats = {
            counts: {},
            timing: {
                min: 0,
                max: 0,
                mean: 0,
            },
            longestSequence: 0,
            total: sorted[sorted.length - 1].time - sorted[0].time, // Total time is simply end - start (O(1))
        };

        /**
         * Complexity is (O(n log n)) - requires one loop over n elements
         * plus sorting the longestSequence array to get max
         */
        const longestSequence = sorted.reduce((acc, val) => {
            const { event: { type } } = val;

            if (type === 'input') {
                acc.push(1);
                return acc;
            }
            if (type === 'focus') {
                return acc;
            }
            if (acc.length) {
                const lastValue = acc[acc.length - 1];
                acc.pop();
                acc.push(lastValue + 1);
            }
            return acc;
        }, []);

        stats.longestSequence = Math.max(...longestSequence);

        /**
         * Complexity is (O(n log n)) - requires one loop over n elements
         * plus sorting the delays array to get max and min, plus one loop
         * over n elements to get the array average
         */
        let delays = [];

        for (let i = 1; i < sorted.length; i += 1) {
            delays.push(sorted[i].time - sorted[i - 1].time);
        }

        delays = delays.sort((a, b) => a - b);

        stats.timing = {
            min: delays[0],
            max: delays[delays.length - 1],
            mean:  delays.reduce((a,b) => a + b, 0) / delays.length,
        };

        /**
         * To find a count of different event types,
         * reducing the array and creating a key with [type]
         * if it does not exist in the accumulator,
         * or incrementing it if it does 
         * Complexity (O(n)) - requires only one loop over n elements
         */
        stats.counts = sorted.reduce((acc, val) => {
            const { event: { type } } = val;
            return {
                ...acc,
                [type]: typeof acc[type] === 'undefined' ? 1 : acc[type] + 1,
            };
        }, {});

        return stats;
    }
}

module.exports = Task;
