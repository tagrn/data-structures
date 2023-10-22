type Indices<T> = {
  [key: number]: T;
};

class HashList<T> {
  private indices: Indices<T>;
  private lastIndex: number;
  private adjustment: number[];
  private getCount: number;
  private threshold: number;
  constructor(threshold: number = 200) {
    this.indices = {};
    this.lastIndex = -1;
    this.adjustment = [];
    this.getCount = 0;
    this.threshold = threshold;
  }

  private isValidIndex(index: number, rangeMore: number = 0): boolean {
    if (index > this.size() - 1 + rangeMore || index < 0) {
      return false;
    }
    return true;
  }

  private adjustTargetIndex(index: number): number {
    for (const x of this.adjustment) {
      if (index >= x) {
        index++;
      }
    }
    return index;
  }

  private rearrangeIndices(): void {
    if (
      this.getCount < this.threshold &&
      this.adjustment.length < this.threshold / 10
    ) {
      return;
    }
    const newIndices: Indices<T> = {};
    const indexKeys = Object.keys(this.indices).map((x) => Number(x));
    indexKeys.sort((a: number, b: number) => a - b);
    for (let i = 0; i < indexKeys.length; i++) {
      newIndices[i] = this.indices[indexKeys[i]];
    }

    this.indices = newIndices;
    this.lastIndex = indexKeys.length - 1;
    this.getCount = 0;
    this.adjustment = [];
  }

  add(value: T, index: number = this.lastIndex + 1): void {
    this.rearrangeIndices();
    if (!this.isValidIndex(index, 1)) {
      throw new Error('out of index');
    }
    const adjustedIndex = this.adjustTargetIndex(index);
    this.indices[adjustedIndex] = value;
    this.lastIndex++;
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
    this.adjustment.push(adjustedIndex);
  }

  size(): number {
    return this.lastIndex + 1 - this.adjustment.length;
  }
}


// ---------- Test -----------
const hashList = new HashList<number>();
console.log(hashList.size());
hashList.add(1);
console.log(hashList.get(0));
hashList.add(2);
hashList.add(3);
hashList.add(1);
hashList.add(1);
console.log(hashList.size());
console.log(hashList.get(1));
console.log(hashList.get(2));
hashList.remove(1);
hashList.remove(1);
console.log(hashList.get(2));
console.log(hashList.size());
console.log(hashList.get(0));
console.log(hashList.get(1));
console.log(hashList.get(2));
hashList.remove(2);
hashList.remove(1);
hashList.remove(0);
console.log(hashList.size());
