import { average } from '../utils/for_testing.js'

describe('average', () => {
    test('of one value is valueself', () => {
        const result = average([1])
        expect(result).toBe(1)
    })

    test('of many is calculated reight', () => {
        const result = average([1, 2, 3, 4, 5])
        expect(result).toBe(3)
    })

    test('of empty array is zero', () => {
        const result = average([])
        expect(result).toBe(0)
    })
})
