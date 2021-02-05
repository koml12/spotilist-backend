abstract class Entity {
  serialize(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this));
  }
}

export default Entity;
