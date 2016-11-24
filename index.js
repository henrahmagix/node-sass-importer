module.exports = function (importer) {
    return function (importPath, absFilepath, done) {
        var result;

        var originalDone = done;
        var alreadyDone = false;
        if (typeof done === 'function') {
            done = function () {
                alreadyDone = true;
                originalDone.apply(this, arguments);
            };
        }

        try {
            result = importer(importPath, absFilepath, done);
        } catch (error) {
            result = error;
            if (alreadyDone) {
                // Throw again to show the error to the user, because we cannot
                // call done() again. This must not be done in sync mode, else
                // the error is unhelpful: `Segmentation fault: 11` (it will be
                // returned in sync mode and logged that way).
                throw error;
            }
        }

        if (done) {
            if (!alreadyDone) {
                done(result);
            }
        } else {
            return result;
        }
    };
};
