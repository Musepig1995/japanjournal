Countdown = {
    __getCurrentDate: function () {
        if (!this.__curentDate) {
            this.__currentDate = new Date();
            return this.__currentDate;
        } else {
            return this.__currentDate;
        }
    },
    __currentDate: null,
    __timeType: {
        DAY: "DAY",
        HOUR: "HOUR",
        MINUTE: "MINUTE",
        SECOND: "SECOND",
    },
    __getTimeDifference(now, then) {
        var millis = then - now,
            millisecondsInDays = (1000 * 60 * 60 * 24),
            millisecondsInHours = (1000 * 60 * 60),
            millisecondsInMinutes = (1000 * 60),
            millisecondsInSeconds = 1000;

        var days = millis / millisecondsInDays,
            hours = (millis / millisecondsInHours) % 24,
            minutes = (millis / millisecondsInMinutes) % 60,
            seconds = (millis / millisecondsInSeconds) % 60;

        return {
            days: Math.floor(days),
            hours: Math.floor(hours),
            minutes: Math.floor(minutes),
            seconds: Math.floor(seconds)
        };
    },
    __createTimeElement: function (elementContainer, value) {
        var digits = value.toString().split("");

        digits.forEach(function (value) {
            var element = document.createElement("span");
            element.setAttribute("class", "countdown-number");
            element.appendChild(document.createTextNode(value));

            elementContainer.appendChild(element);
        });
    },
    __updateElement: function (elementContainer, timeType, isSignificantTime) {
        var updatedValue = null;

        var value = this.__getValueFromElement(elementContainer);
        updatedValue = this.__decrementValue(value, timeType, isSignificantTime);

        this.__updateValueInElement(elementContainer, updatedValue);

        if (updatedValue <= 0) {
            return false;
        } else {
            return true;
        }
    },
    __updateValueInElement(elementContainer, value) {
        var childElements = elementContainer.childNodes,
            digitElements = [];

        for (var child in childElements) {
            if (hasClass(child, "countdown-number")) {
                digitElements.push(child);
            }
        }

        for (var i = 0; i < digitElements.length; i++) {
            digitElements[i].value = value.substring(i, i);
        }
    },
    __getValueFromElement: function (elementContainer) {
        var childElements = elementContainer.childNodes,
            digits = this.__getDigitsFromElement(elementContainer),
            value = "";

        for (var digit in digits) {
            value += digit.value.toString();
        }

        return value != "" ? value : 0;
    },
    __getDigitsFromElement(elementContainer) {
        var childElements = elementContainer.childNodes,
            digits = [];

        for (var child in childElements) {
            if (hasClass(child, "countdown-number")) {
                digits.push(child);
            }
        }

        return digits;
    },
    __decrementValue(value, timeType, isSignificantTime) {
        if (timeType === this.__timeType.DAY) {
            if (value > 0) {
                return value--;
            }
        } else if (timeType === this.__timeType.HOUR) {
            // 24 hours in a day
            if (value > 0) {
                return value--;
            } else if (!isSignificantTime) {
                // if it is a new day then it will default to 23:59
                return 23;
            }
        } else {
            if (value > 0) {
                return value--;
            } else if (!isSignificantTime) {
                return 59;
            }
        }

        return value;
    },
    __updateCountdown(params) {
        var daysElement = params.daysElement ? params.daysElement : null,
            hoursElement = params.hoursElement ? params.hoursElement : null,
            minutesElement = params.minutesElement ? params.minutesElement : null,
            secondsElement = params.secondsElement ? params.secondsElement : null,
            daysEnded = false,
            hoursEnded = false,
            minutesEnded = false;

        if (daysElement) {
            daysEnded = this.__updateElement(daysElement, this.__timeType.DAY, false)
        }

        if (hoursElement) {
            hoursEnded = this.__updateElement(hoursElement, this.__timeType.HOUR, daysEnded);
        }

        if (minutesElement) {
            minutesEnded = this.__updateElement(minutesElement, this.__timeType.MINUTE, hoursEnded);
        }

        if (secondsElement) {
            secondsElement = this.__updateElement(secondsElement, this.__timeType.SECOND, minutesEnded);
        }
    },
    createCountdown: function (params) {
        var daysElement = params.daysElement ? params.daysElement : null,
            hoursElement = params.hoursElement ? params.hoursElement : null,
            minutesElement = params.minutesElement ? params.minutesElement : null,
            secondsElement = params.secondsElement ? params.secondsElement : null,
            targetDate = params.targetDate && params.targetDate instanceof Date ? params.targetDate : null,
            animationType = params.animationType ? params.animationType : "basic";

        if (!targetDate) {
            throw new Error("Require a valid target date to countdown.");
        }

        var timeDifference = this.__getTimeDifference(this.__getCurrentDate(), targetDate);

        if (daysElement) {
            this.__createTimeElement(daysElement, timeDifference.days);
        }

        if (hoursElement) {
            this.__createTimeElement(hoursElement, timeDifference.hours);
        }

        if (minutesElement) {
            this.__createTimeElement(minutesElement, timeDifference.minutes);
        }

        if (secondsElement) {
            this.__createTimeElement(secondsElement, timeDifference.seconds);
        }

        setInterval(this.__updateCountdown(params), 1000);
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}