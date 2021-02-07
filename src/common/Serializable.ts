interface Serializable<T> {
  serialize(): T;

  deserialize(obj: T): this;

  equals(obj: T): boolean;
}

export default Serializable;
