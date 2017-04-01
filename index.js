var chalk = require('chalk');
var inquirer = require('inquirer');
var cliTable = require('cli-table');
var Q = require('q');

module.exports = {};

module.exports.askFor = function askFor(message, opts) {
    opts = opts || {};
    var options = { defaultAnswer: opts.defaultAnswer || null };

    var deferred = Q.defer();

    inquirer.prompt([{
        name: "search",
        message: message,
        "default": options.defaultAnswer
    }], function(input) {
        return deferred.resolve(input.search);
    });

    return deferred.promise;
};

module.exports.renderList = function renderList(data, itemRenderCallback) {
    console.log(
        data.map(function(item, n) {
            return lineNumber(n+1) + ' ' + itemRenderCallback(item);
        }).join('\n')
    );
    return data;
};

module.exports.renderTable = function renderTable(data, tableOptions, itemDataCallback) {
    if (!tableOptions) {
        tableOptions = {head: []};
    }
    tableOptions.head.unshift('Number');

    var table = new cliTable(tableOptions);
    data.forEach(function(item, n) {
        table.push([lineNumber(n+1)].concat(itemDataCallback(item)));
    });
    console.log(table.toString());
};

module.exports.selectItem = function selectItem(list, message) {
    var deferred = Q.defer();

    inquirer.prompt([{
        name: "item",
        message: message + " Type the corresponding number:",
        validate: function(val) {
            var number = val*1;
            if (!isNaN(val) && number >= 1 && number <= list.length+1) {
                return true;
            }
            return "Please enter a valid number between 1 and " + (list.length);
        }
    }], function(selection) {
        return deferred.resolve(list[selection.item-1]);
    });

    return deferred.promise;
};

module.exports.renderWarning = function renderWarning(message) {
    console.log(chalk.yellow.bold(message));
};

module.exports.renderError = function renderError(message) {
    console.log(chalk.red.bold(message));
};

module.exports.renderMessage = function renderMessage(message) {
    console.log(message);
};

module.exports.colors = chalk;

function lineNumber(index) {
    index = index > 9 ? index : ' ' + index;
    return chalk.dim.magenta.bold(index);
}
