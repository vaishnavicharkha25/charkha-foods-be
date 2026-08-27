import moment from 'moment-timezone';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CustomError, ErrorHandler } from './errorHandling';

/* common application wide utility functions are placed here. */
class General {
    /* used in created_at and updated_at. */
    public static getDate = (date?: Date | string) => {
        /* get current date, which is utc date and convert to JS Date object */
        if (date) return moment(date).utc().add('+5:30').toDate();
        else return moment().utc().add('+5:30').toDate();
    };

    public static getFormattedDate = (date?: Date | string) => {
        /* get current date, which is utc date and convert to JS Date object */
        if (date) return moment(date).utc().add('+5:30');
        else return moment().utc().add('+5:30');
    };

    public static mapDayToJsDay = (day: number): number => {
        return day % 7;
    };

    public static parseTime = (time: string): { hours: number; minutes: number } => {
        const [hours, minutes] = time.split(':').map(Number);
        return { hours, minutes };
    };

    /* used in incidents */
    public static fileAssignDate = () => {
        const currentDate = General.getDate();
        return moment(currentDate).format('YYYYMMDD');
    };

    public static getOtpExpiryTime = () => {
        /* get current date, which is utc date and convert to JS Date object */
        const currentDate = General.getDate();
        /* add 5 minutes to the current date */
        const otpExpiryTime = moment(currentDate).add(1, 'minute').toDate();

        return otpExpiryTime;
    };

    /* date string should not have Z (zone) in it. */
    public static addISTToDate = (date: string) => {
        return moment(date).add('+5:30').toDate();
    };

    public static isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    public static parseIp = (req: Request) => {
        const ipHeader = req.headers['x-forwarded-for'] as string;
        return ipHeader?.split(',').shift() ?? req.socket?.remoteAddress;
    };

    // public static maskData = (name: string | null | undefined) => {
    //     if (name && name?.length >= 3) {
    //         const nameArr = name.split('');
    //         return nameArr[0] + nameArr[1] + 'XXX' + nameArr[nameArr.length - 1];
    //     }

    //     if (name && name?.length === 2) {
    //         const nameArr = name.split('');
    //         return nameArr[0] + 'XXX';
    //     }

    //     if (name && name?.length === 1) {
    //         return 'XXX';
    //     }

    //     return null;
    // };

    // public static checkIsUserExpired = (expiryDate: string) => {
    //     /* we remove the Z (zone) from the date string. */
    //     const userExpiryDate = moment(expiryDate.slice(0, -1));

    //     return userExpiryDate < moment();
    // };

    /* method to generate a uuid-v4 pseudo-random string. Can be used in various places for uniquely identifying items. */
    public static getUUIDV4 = () => {
        return uuidv4();
    };

    /* error handler fn to catch errors in controllers. */
    public static errorHandlerFn = (fn: any) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                ErrorHandler.commonErrorHandler(error, res);
            }
        };
    };

    public static generateImageUrl = (path: string | undefined) => {
        if (path) {
            const imageUrl = 'userData' + path.replace(/\\/g, '/');
            return imageUrl;
        }
        return null;
    };

    public static processImageUrl = (file: any, dataKey: string, data: any): string => {
        // Extract the file path from the file object
        const formatFile = file?.[dataKey]?.[0]?.path || null;

        // Generate the image URL if formatFile exists
        const imageUrl = formatFile
            ? General.generateImageUrl(formatFile.split('userData')?.[1] as string)
            : null;

        // Get the stored image URL from the data object if it exists
        const storedImageUrl =
            data?.[dataKey] && data?.[dataKey] !== 'null' && data?.[dataKey] !== 'undefined'
                ? (data?.[dataKey] as string)
                : null;

        // Return the generated image URL, the stored image URL, or an empty string if neither exists
        return imageUrl || storedImageUrl || '';
    };

    // public static maskMobileNumber = (mobileNumber: string) => {
    //     if (typeof mobileNumber !== 'string') {
    //         throw new Error('The mobile number must be a string');
    //     }

    //     // Remove the country code (assuming it starts with '+')
    //     const numberWithoutCountryCode = mobileNumber.replace(/^\+\d{1,4}/, '').trim();

    //     // Ensure the number has at least 4 digits
    //     if (numberWithoutCountryCode.length < 4) {
    //         throw new Error('The mobile number must be exactly 10 digits after the country code.');
    //     }

    //     // Masking logic: keep first 2 digits, then 'XXX', and last 2 digits
    //     const visibleStart = numberWithoutCountryCode.slice(0, 2);
    //     const visibleEnd = numberWithoutCountryCode.slice(-2);
    //     const maskedNumber = `${visibleStart}XXX${visibleEnd}`;

    //     return maskedNumber;
    // };

    public static validateDate = (date: string) => {
        const inputDate = moment(date, 'YYYY-MM-DD');
        const currentDate = moment().startOf('day');

        if (!inputDate.isValid()) {
            throw new Error('Invalid date format.');
        }

        if (inputDate.isBefore(currentDate, 'day')) {
            throw new Error('The date must be today or in the future.');
        }
    };

    public static validateTime = (time: string) => {
        const currentDateTime = moment();
        const inputTimeToday = moment(
            currentDateTime.format('YYYY-MM-DD') + ' ' + time,
            'YYYY-MM-DD HH:mm'
        );

        if (!moment(time, 'HH:mm', true).isValid()) {
            throw new Error('Invalid time format.');
        }

        if (
            inputTimeToday.isSame(currentDateTime, 'day') &&
            inputTimeToday.isBefore(currentDateTime)
        ) {
            throw new Error('The time must not be in the past if the date is today.');
        }
    };

    public static validateDateTime = (date: string, time: string) => {
        // Validate the date
        const inputDate = moment(date, 'YYYY-MM-DD');
        const currentDate = moment().startOf('day');

        if (!inputDate.isValid()) {
            throw new Error('Invalid date format.');
        }

        if (inputDate.isBefore(currentDate, 'day')) {
            throw new Error('The date must be today or in the future.');
        }

        // Validate the time
        const currentDateTime = moment();
        const inputDateTime = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm');

        if (!moment(time, 'HH:mm', true).isValid()) {
            throw new Error('Invalid time format.');
        }

        if (inputDate.isSame(currentDate, 'day') && inputDateTime.isBefore(currentDateTime)) {
            throw new Error('The time must not be in the past if the date is today.');
        }
    };

    public static formattedDate = (date: string) => {
        return moment(date).utc().add('+5:30').toDate();
    };

    public static adjustDateIfPast = (time: string, fromDate: string): string => {
        // Parse the fromDate into a moment object
        const currentDate = moment(fromDate, 'YYYY-MM-DD');

        // Create a moment object for the input time on the specified date
        const inputDateTime = moment(
            `${currentDate.format('YYYY-MM-DD')} ${time}`,
            'YYYY-MM-DD HH:mm'
        );

        // Check if the input dateTime is in the past
        if (inputDateTime.isBefore(moment())) {
            // Move to the next day
            currentDate.add(1, 'day');
        }

        // Return the adjusted date in the desired format
        return currentDate.format('YYYY-MM-DD');
    };

    public static formattedSearchQuery = (dateString: string) => {
        // Regex pattern to match date formats DD-MM-YYYY and DD-MM-YYYY HH:mm
        const dateOnlyPattern = /^\d{2}-\d{2}-\d{4}$/;
        const dateTimePattern = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/;

        // Check if the input matches the date or date time pattern
        if (dateOnlyPattern.test(dateString)) {
            // Reverse date only
            const [day, month, year] = dateString.split('-');
            return `${year}-${month}-${day}`;
        } else if (dateTimePattern.test(dateString)) {
            // Reverse date and return with time
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('-');
            return `${year}-${month}-${day} ${timePart}`;
        } else {
            // If not a valid date format, return the input string as is
            return dateString;
        }
    };

    public static dateTimeValidator = (dateStr: string) => {
        const dateFormat = 'DD-MM-YYYY HH:mm';
        const date = moment(dateStr, dateFormat, true);
        if (!date.isValid()) {
            return false;
        }
        return !date.isAfter(General.getDate());
    };

    public static dateValidator = (dateStr: string) => {
        const dateFormat = 'YYYY-MM-DD';
        const date = moment(dateStr, dateFormat, true);
        if (!date.isValid()) {
            return false;
        }
        return !date.isAfter(General.getDate());
    };

    public static positiveBoolValue = (value: boolean) => {
        if (!value) return false;
        return true;
    };

    /* used in reports [controller] if a particular date is not present. */
    public static getYMDTHMSZDateFormat = () => {
        return moment().utcOffset('+05:30').format('YYYY-MM-DD');
    };

    public static parseTimeTo24Hour(time: string): Date {
        const [hours, minutesPart] = time.split(':');
        const minutes = parseInt(minutesPart.slice(0, 2), 10);
        const isPM = minutesPart.slice(-2).toUpperCase() === 'PM';

        let hours24 = parseInt(hours, 10);
        if (isPM && hours24 < 12) hours24 += 12;
        if (!isPM && hours24 === 12) hours24 = 0;

        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours24, minutes);
    }

    // public static getDefaultUserExpiryDate = async () => {
    //     const data = await ConfigMaster.findOne({
    //         where: { Key: ConfigMasterConstants.USER_DEFAULT_EXPIRY_PERIOD, IsActive: true }
    //     });

    //     if (!data?.Value)
    //         throw new CustomError(
    //             HttpCode.INTERNAL_SERVER_ERROR,
    //             HttpErrorMessage.USER_EXPIRY_PARAMETER_MISSING
    //         );

    //     return moment().add(data.Value, 'days').add('+5:30');
    // };
}

export default General;