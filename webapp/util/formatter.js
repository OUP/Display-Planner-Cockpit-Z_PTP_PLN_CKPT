sap.ui.define([], function () {
    "use strict";
    return {
        textFormat: function (text, key) {
            if (text !== null && key !== null) {
                var str = text + "(" + key + ")";
                return str;
            } else if (text !== null) {
                return text;
            } else {
                return "";
            }
        },
    };
});
