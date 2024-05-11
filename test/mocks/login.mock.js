export const loginRequestData = {
    "username": "test",
    "password": "test"
}

export const loginResponseOk = {
    "token": "new_token",
    "expiry": "2024-05-10T14:42:45.652216Z"
}

export const loginResponseKo = {
    non_field_errors: [
        "Unable to log in with provided credentials."
    ]
}