import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { loginUser, isLoggedIn } from '../src/utils'
import { loginRequestData, loginResponseOk, loginResponseKo } from './mocks/login.mock'

// create spy for global fetch
const fetchSpy = vi.spyOn(global, "fetch")
const BASE_API_URL = "http://localhost:8000"
const API_VERSION = "/api/v1"


describe("API login", () => {
    beforeAll(() => {
        // define env variables used in tests
        vi.stubEnv("BASE_API_URL", BASE_API_URL)
        vi.stubEnv("API_VERSION", API_VERSION)
    })
    
    test("login successful", async () => {
        // mock implementation of fetch for login
        const mockedFetch = () => Promise.resolve({
            json() {
                return loginResponseOk
            }
        })

        fetchSpy.mockImplementation(mockedFetch)

        const newLogin = await loginUser(loginRequestData.username, loginRequestData.password)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginRequestData)
            }
        )

        expect(newLogin).toEqual(loginResponseOk)
    })

    test("login failed", async () => {
        const mockedFetch = () => Promise.resolve({
            json() {
                return loginResponseKo
            }
        })

        fetchSpy.mockImplementation(mockedFetch)

        const newLogin = await loginUser(loginRequestData.username, loginRequestData.password)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginRequestData)
            }
        )

        expect(newLogin).toEqual(loginResponseKo)

    })

    test("isLoggedIn function", () => {

        // test with future token expiration
        const futureExpiry = new Date()
        futureExpiry.setDate(futureExpiry.getDate() + 1)
        let config = {
            token: "token",
            tokenExpiry: futureExpiry
        }

        expect(isLoggedIn(config)).toBeTruthy()
        
        // test with expired token
        const pastExpiry = new Date()
        pastExpiry.setDate(pastExpiry.getDate() - 1)
        config.tokenExpiry = pastExpiry

        expect(isLoggedIn(config)).toBeFalsy()
        
    })

    afterAll(() => {
        fetchSpy.mockRestore()
    })

})