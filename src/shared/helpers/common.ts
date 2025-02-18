const COMMA_SEPARATOR = ',';

export function generateRandomValue(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}
export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function generateStringWithSeparatorFromArray<T>(items: T[]): string {
  return items.join(COMMA_SEPARATOR);
}

export function getRandomItemsToStringWithSeparator<T>(items: T[]): string {
  return generateStringWithSeparatorFromArray(getRandomItems(items));
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}
export function getRandomBoolean(): boolean {
  return !generateRandomValue(0, 2);
}

