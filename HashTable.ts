class HashTable<T> {
  private size: number;
  private data: T[];
  private keys: string[];
  private loadFactor: number;
  private currentCount: number;
  constructor(size: number = 199) {
    this.size = size;
    this.currentCount = 0;
    this.data = Array(size);
    this.keys = Array(size);
    this.loadFactor = 0.5;
  }

  private convertHashKey(key: string) {
    return (
      key.split('').reduce((cur, s) => cur + Number(s.charAt(0)), 0) % this.size
    );
  }

  private resize() {
    const size = this.size * 2 - 1;
    const data = Array(size);
    const keys = Array(size);
    for (const key of this.keys) {
      if (!key) continue;
      let convertedKey = this.convertHashKey(key);
      while (keys[convertedKey] && keys[convertedKey] !== key) {
        convertedKey++;
        convertedKey %= size;
      }
      data[convertedKey] = this.get(key);
      keys[convertedKey] = key;
    }
    this.size = size;
    this.data = data;
    this.keys = keys;
  }

  get(key: string): T {
    let convertedKey = this.convertHashKey(key);
    while (this.keys[convertedKey] !== key) {
      convertedKey++;
      convertedKey %= this.size;
    }
    return this.data[convertedKey];
  }

  put(key: string, value: T): void {
    if (this.currentCount / this.size > this.loadFactor) {
      this.resize();
    }

    let convertedKey = this.convertHashKey(key);
    while (this.keys[convertedKey] && this.keys[convertedKey] !== key) {
      convertedKey++;
      convertedKey %= this.size;
    }
    this.data[convertedKey] = value;
    this.keys[convertedKey] = key;
    this.currentCount++;
  }
}

const ht = new HashTable<String>();
for (let i = 0; i < 2000; i++) {
  ht.put(String(i), '!' + String(i));
  console.log(ht.get(String(i)));
}
