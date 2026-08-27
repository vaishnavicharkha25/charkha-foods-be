interface issues {
    validation: string;
    code: string;
    message: string;
    path: Array<string>;
}

const zodErrorHandler = (issues: Array<issues>) => {
    let responseStr = '';
    issues.forEach((item, i) => {
        let arrayMessage = '';
        if (item.path.length > 1) {
            const arrayElement = item.path.at(0);
            const arrayErrPosition = item.path.at(1);
            arrayMessage = ` for ${arrayElement} at position ${arrayErrPosition}`;
        }
        responseStr +=
            `${item.message}` +
            arrayMessage +
            (issues.length == 1 || i == issues.length - 1 ? '.' : ', ');
    });
    return responseStr;
};

export default zodErrorHandler;