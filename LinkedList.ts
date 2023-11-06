// 링크드 리스트 구현하기
// 구현할 기능: 삽입, 삭제, 조회, 크기
class LinkedNode<T> {
  data: T;
  next: LinkedNode<T> | null;

  constructor(data: T, next: LinkedNode<T> | null = null) {
    this.data = data;
    this.next = next;
  }
}

class LinkedList<T> {
  head: LinkedNode<T> | null;
  size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  insert(data: T, beforeNode: LinkedNode<T> | null) {
    if (beforeNode === null) {
      const tmpNode = this.head;
      this.head = new LinkedNode(data);
      this.head.next = tmpNode;
    } else {
      const tmpNode = new LinkedNode(data);
      tmpNode.next = beforeNode.next;
      beforeNode.next = tmpNode;
    }
    this.size++;
  }

  private validateIndex(index: number) {
    if (this.size <= index || index < 0) {
      throw new Error('Out of Index');
    }
  }

  get(index: number): LinkedNode<T> {
    this.validateIndex(index);
    let node = this.head;
    while (0 < index && node) {
      node = node.next;
      index--;
    }
    if (node === null) {
      throw new Error('Out Index Out');
    }
    return node;
  }

  private validateNode(beforeNode: LinkedNode<T> | null) {
    if (beforeNode === null) {
      if (this.size === 0) {
        throw new Error('Out of Index');
      }
      return;
    }
    if (beforeNode.next === null) {
      throw new Error('Out of Index');
    }
  }

  remove(beforeNode: LinkedNode<T> | null) {
    this.validateNode(beforeNode);
    if (beforeNode === null) {
      if (this.head) {
        this.head = this.head.next;
      }
    } else {
      if (beforeNode.next) {
        beforeNode.next = beforeNode.next.next;
      }
    }
    this.size--;
  }
}

// ---------- Test -----------
const linkedList = new LinkedList<number>();
console.log(linkedList.size); // 0
linkedList.insert(10, null);
const beforeNode = linkedList.get(0);
console.log(beforeNode.data); // 10
linkedList.insert(20, beforeNode);
linkedList.insert(30, beforeNode);
console.log(linkedList.size); // 3
linkedList.remove(beforeNode);
console.log(linkedList.size); // 2
console.log(linkedList.get(1).data); // 20
// ---------------------------

// ----- Out of Index Test ------
// linkedList.get(10);
// linkedList.get(-2);
// linkedList.remove(linkedList.get(1));
// linkedList.remove(null);
// linkedList.remove(null);
// linkedList.remove(null);
// ------------------------------
