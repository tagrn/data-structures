type Indices<T> = {
  [key: number]: T;
};

const bisect = (target: number, arr: number[]): number => {
  let [s, e] = [0, arr.length];
  while (s < e) {
    const mid = Math.floor((s + e) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      e = mid;
    } else {
      s = mid + 1;
    }
  }
  return s;
};

class HashList<T> {
  private indices: Indices<T>;
  private removedIndices: number[];
  private getCount: number;
  private threshold: number;
  public size: number;

  constructor(threshold: number = 200) {
    this.indices = {};
    this.removedIndices = [];
    this.getCount = 0;
    this.threshold = threshold;
    this.size = 0;
  }

  private isValidIndex(index: number, rangeMore: number = 0): boolean {
    if (index > this.size - 1 + rangeMore || index < 0) {
      return false;
    }
    return true;
  }

  private adjustTargetIndex(index: number): number {
    for (const x of this.removedIndices) {
      if (index >= x) {
        index++;
      }
    }
    return index;
  }

  private rearrangeIndices(): void {
    if (
      this.getCount < this.threshold &&
      this.removedIndices.length < this.threshold / 50
    ) {
      return;
    }
    const newIndices: Indices<T> = {};
    const oldLength =
      Object.keys(this.indices).length + this.removedIndices.length;
    let removedIndicesIdx = 0;
    for (let i = 0; i < oldLength; i++) {
      if (this.removedIndices[removedIndicesIdx] == i) {
        removedIndicesIdx++;
        continue;
      }
      newIndices[i - removedIndicesIdx] = this.indices[i];
    }

    this.indices = newIndices;
    this.getCount = 0;
    this.removedIndices = [];
  }

  add(value: T, index: number = this.size): void {
    this.rearrangeIndices();
    if (!this.isValidIndex(index, 1)) {
      throw new Error('out of index');
    }
    const adjustedIndex = this.adjustTargetIndex(index);
    this.indices[adjustedIndex] = value;
    if (index == this.size) {
      this.size++;
    }
  }

  get(index: number): T {
    this.rearrangeIndices();
    this.getCount++;

    if (!this.isValidIndex(index)) {
      throw new Error('out of index');
    }
    const adjustedIndex = this.adjustTargetIndex(index);
    return this.indices[adjustedIndex];
  }

  remove(index: number): void {
    this.rearrangeIndices();
    if (!this.isValidIndex(index)) {
      throw new Error('out of index');
    }

    const adjustedIndex = this.adjustTargetIndex(index);
    delete this.indices[adjustedIndex];
    const location = bisect(adjustedIndex, this.removedIndices);
    const curLength = this.removedIndices.length;
    for (let i = curLength; i > location; i--) {
      this.removedIndices[i] = this.removedIndices[i - 1];
    }
    this.removedIndices[location] = adjustedIndex;
    this.size--;
  }
}

// ---------- Test -----------
const hashList = new HashList<number>();
console.log(hashList.size === 0);
hashList.add(1);
console.log(hashList.get(0) === 1);
hashList.add(2);
hashList.add(3);
hashList.add(1);
hashList.add(1);
console.log(hashList.size === 5);
console.log(hashList.get(1) === 2);
console.log(hashList.get(2) === 3);
hashList.remove(1);
hashList.remove(1);
hashList.remove(0);
hashList.add(5);
hashList.add(16, 1);
hashList.add(5);
hashList.add(55, 2);
hashList.add(66);
console.log(hashList.size === 5);
console.log(hashList.get(0) === 1);
console.log(hashList.get(1) === 16);
console.log(hashList.get(2) === 55);
hashList.remove(2);
hashList.remove(1); // execute rearrange logic
hashList.remove(0);
console.log(hashList.size === 2);
console.log(hashList.get(1) === 66);
console.log(hashList.get(0) === 5);
