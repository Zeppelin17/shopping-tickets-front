import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { getShops, getShop, putShop, postShop, deleteShop } from '../src/utils'
import { getShopsResponse, getShopResponse, putShopResponse, postShopResponse, deleteShopResponse } from './mocks/shop.mock'

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

    test("edit shop", async () => {
        const mockedFetch = () => Promise.resolve({
            json() {
                return putShopResponse
            }
        })

        fetchSpy.mockImplementation(mockedFetch)

        const id = 1
        const newName = putShopResponse.name
        const shop = await putShop(id, newName)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/shops/${id}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: putShopResponse.name})
            }
        )

        expect(shop).toEqual(putShopResponse)
        expect(typeof shop.id).toBe("number")
        expect(typeof shop.name).toBe("string")
        expect(shop.id).toBeGreaterThan(0)
    })

    test("create shop", async () => {
        const mockedFetch = () => Promise.resolve({
            json() {
                return postShopResponse
            }
        })

        fetchSpy.mockImplementation(mockedFetch)

        const newName = postShopResponse.name
        const shop = await postShop(newName)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/shops/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: postShopResponse.name})
            }
        )

        expect(shop).toEqual(postShopResponse)
        expect(typeof shop.id).toBe("number")
        expect(typeof shop.name).toBe("string")
        expect(shop.id).toBeGreaterThan(0)
    })

    test("delete shop", async () => {
        const mockedFetch = () => Promise.resolve(deleteShopResponse)

        fetchSpy.mockImplementation(mockedFetch)

        const id = 1
        const token = "token"
        const response = await deleteShop(token, id)

        expect(fetch).toHaveBeenCalledWith(
            `${BASE_API_URL}${API_VERSION}/shops/${id}/`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )

    })


    afterAll(() => {
        fetchSpy.mockRestore()
    })

})