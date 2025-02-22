import '@testing-library/jest-dom'

afterEach(() => fetch.resetMocks())
afterEach(() => jest.restoreAllMocks())
afterEach(() => jest.clearAllMocks())
afterEach(() => jest.clearAllTimers())
