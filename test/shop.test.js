import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { getShops, getShop, putShop, postShop, deleteShop, getShops } from '../src/utils'
import { getShopsResponse, getShopResponse } from './mocks/shop.mock'
import { number } from 'astro/zod'

// create spy for global fetch
const fetchSpy = vi.spyOn(global, "fetch")
const BASE_API_URL = "http://localhost:8000"
const API_VERSION = "/api/v1"


describe("API shop interaction", () => {
    beforeAll(() => {
        // define env variables used in tests
        vi.stubEnv("BASE_API_URL", BASE_API_URL)
        vi.stubEnv("API_VERSION", API_VERSION)
    })
    
    test("get shops", async () => {
        const mockedFetch = () => Promise.resolve({
            json() {
                return getShopsResponse
            }
        })

        fetchSpy.mockImplementation(mockedFetch)

        const token = "token"
        const shops = await getShops(token)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/shops`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )

        expect(shops).toEqual(getShopsResponse)
    })

    test("get shop", async () => {
        const mockedFetch = () => Promise.resolve({
            json() {
                return getShopResponse
            }
        })

        fetchSpy.mockImplementation(mockedFetch)

        const token = "token"
        const id = 1
        const shop = await getShop(token, id)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/shops/${id}/`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )

        expect(shop).toEqual(getShopResponse)
        expect(typeof shop.id).toBe("number")
        expect(typeof shop.name).toBe("string")
        expect(shop.id).toBeGreaterThan(0)
    })


    afterAll(() => {
        fetchSpy.mockRestore()
    })

})