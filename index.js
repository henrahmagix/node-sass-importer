module.exports = function (importer) {
    return function (importPath, absFilepath, done) {
        var result;
        var doneSafely;
        var alreadyDone = false;
        if (done) {
            doneSafely = function () {
                alreadyDone = true;
                done.apply(this, arguments);
            };
        }
        try {
            result = importer(importPath, absFilepath, doneSafely);
        } catch (error) {
            result = error;
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
