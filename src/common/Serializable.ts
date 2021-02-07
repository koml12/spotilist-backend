interface Serializable<T> {
  serialize(): T;

  deserialize(obj: T): this;
}

export default Serializable;
