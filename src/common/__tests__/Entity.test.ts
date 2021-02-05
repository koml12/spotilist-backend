import Entity from "../Entity";

class EntityImpl extends Entity {
  foo: string;
  bar: string;

  constructor(foo: string, bar: string) {
    super();
    this.foo = foo;
    this.bar = bar;
  }
}

describe("Abstract Entity", () => {
  describe("serialize", () => {
    it("should use the normal JSON representation by default", () => {
      const expectedJson = { foo: "foo value", bar: "bar value" };
      const entity = new EntityImpl(expectedJson.foo, expectedJson.bar);
      expect(entity.serialize()).toEqual(expectedJson);
    });
  });
});
