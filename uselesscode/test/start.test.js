function letterCount(str, char) {
  let count = 0
  for (let letter of str) {
    if (letter === char) {
      count++
    }
  }
  return count
}

test("letterCount works with regular strings", () => {
  expect(letterCount("awesome", "e")).toBe(2)
})

test("It adds two numbers", () => {
  expect(1 + 1).toBe(2)
})

test("arithmetic", function () {
  expect(4 + 4).toBeGreaterThan(7)
  expect(4 + 4).toBeLessThan(9)
})

test("references", function () {
  var arr = [1, 2, 3]
  expect(arr).toEqual([1, 2, 3])
  expect(arr).not.toBe([1, 2, 3]) // since === doesn't do deep comparison!
  expect(arr).toContain(1)
})
