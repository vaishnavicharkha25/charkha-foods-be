const enum HttpErrorMessage {
    INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error',

    INVALID_SEARCH = 'Invalid Search',
    MISSING_REQUIRED_FIELDS = 'Missing required fields',
    SHOW_DELETED_REQUIRED = 'ShowDeleted required',
    INACTIVE = 'Inactive',

    /* User */
    USERS_NOT_FOUND = 'Users not found.',
    USER_EXIST_WITH_SAME_ROLE = 'Cannot inactivate User role. Active Users exist.',
    USER_EXIST = 'User already exists with a similar details.',
    USER_EMAIL_EXIST = 'User already exists with a similar email address.',
    USER_MOBILE_EXIST = 'User already exists with a similar mobile number.',
    USER_NOT_FOUND = 'User not found.',
    USER_DELETED = 'The user has been deleted. Please contact the administrator.',
    USER_FORBIDDEN = 'You do not have the priviliges to perform actions on this user. Please contact superadmin. ',
    NO_USERS_FOUND = 'No users found.',
    USER_FILTER = 'You do not have access priviliges to provide filter for this User. Please contact superadmin. ',
    SAME_PASSWORD_SUPPLIED = 'Please provide a different password.',
    CANNOT_RESET_SUPER_ADMIN_PWD = 'Can not reset super admin password.',
    USER_NOT_FOUND_MOBILE_NUMBER = 'Mobile number associated with this account was not found. Please contact superadmin.',
    EMAIL_NOT_CONFIGURED = 'Email is not configured for provided user.',
    SMS_NOT_CONFIGURED = 'SMS is not configured for provided user.',
    FAILS_TO_SEND_WHATSAPP_NOTIFICATION = 'fails to send otp whatsapp notification',
    USER_LOCKED = 'User is locked, Please try again later or please contact your admin.',
    ACCESS_DENIED = 'You are not authorized to login',
    INVALID_ROLE_ID = 'Role ID is invalid.',

    /* General */

    MODEL_NOT_FOUND = 'Model not found',
    MULTER_ERROR = 'Multer error',
    FILE_NOT_FOUND = 'File not found',
    IMAGE_UPLOAD_FAIL = 'Image upload fails',
    NO_ROLE_ASSIGNED = 'No role assigned to the user.',
    SUPER_ADMIN_ACCESS = 'You are not authorized as superadmin.',
    ADMIN_ACCESS = 'You are not authorized as superadmin or admin.',
    UNABLE_TO_LOAD_ICON_LIST = 'Unable to load icons.',
    NO_URL_MATCHED = 'No URL matched.',
    LOGOUT_FAILED = 'Logout failed.',
    LIST_SIZE_EXCEPTION = 'List size too big, please provide a smaller filter range.',
    CONFIG_MASTER_CONSTANT_MISSING = 'config master constant missing from DB.',
    INCORRECT_CONFIG_MASTER_CONSTANT = 'Incorrect config master value.',
    EMAIL_GATEWAY_ERROR = 'Error occurred while sending email.',
    SMS_GATEWAY_ERROR = 'Error occurred while sending SMS.',
    API_ENDPOINT_NOT_FOUND = 'API endpoint not found',
    USER_EXPIRY_PARAMETER_MISSING = 'User expiry period missing from config master.',
    CHECK_USER_PASSWORD_EXPIRY_PARAMETER_MISSING = 'User account expiry period check missing from config master.',
    INVALID_REQUEST = 'Invalid Request',

    /* Token */
    TOKEN_NOT_FOUND = 'Please provide a valid token to access api endpoint.',
    TOKEN_MALFORMED = 'Please authenticate with a valid token',
    SHORTHAND_TOKEN_NOT_FOUND = 'Authorization failed. Please login again',

    /*---------------------------Role------------------------------*/
    INVALID_ID = 'ID is not of type number',
    ROLE_NOT_FOUND = 'Role not found',

    CONFIG_NOT_FOUND = 'Config not found',

    /* encryption */
    RSA_DECRYPT_ERROR = 'Error decrypting RSA message.',
    AES_ENCRYPT_ERROR = 'Error encrypting message using AES.',
    AES_DECRYPT_ERROR = 'Error decrypting AES message.',

    /* Login */
    INVALID_CREDENTIALS = 'Invalid email address or mobile number.',
    UPDATE_PASSWORD = 'You need to update your password.',
    OTP_VERIFICATION = 'Verify OTP sent on on mobile number or email ',
    CHANGE_PASSWORD_ERROR = 'New password must be different from the existing password.',
    INVALID_OTP = 'Invalid OTP',
    OTP_EXPIRED = 'OTP has expired.',
    INCORRECT_OLD_PASSWORD = 'Incorrect old password.',
    SIGNOUT_FAIL = 'Sign-out failed.',
    PASSWORD_NOT_SET = 'You are logging in for the first time. Please check your email for your temporary password.',
    INVALID_OTP_REQUEST = 'OTP has been already sent. Please wait for a minute to resend new OTP.',
    INCORRECT_CREDENTIALS = 'EmailAddress or MobileNumber is required',
    INCORRECT_CREDENTIALS_FORMAT = 'Invalid user credential formate',

    TAGS_NOT_FOUND = 'Tags not found',
    NO_DATA = 'No data found'
}

export default HttpErrorMessage;