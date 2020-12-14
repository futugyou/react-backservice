import { palindrome } from '../utils/for_testing.js'

test('palindrome of a', () => {
    const result = palindrome('a')
    expect(result).toBe('a')
})

test('palindrome of abcd', () => {
    const result = palindrome('abcd')
    expect(result).toBe('dcba')
})

test('palindrome of 123456', () => {
    const result = palindrome('123456')
    expect(result).toBe('654321')
})