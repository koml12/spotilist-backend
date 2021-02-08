class MockRequest {
  query: Record<string, string> = {};
  params: Record<string, string> = {};

  addParameter(key: string, value: string): this {
    this.params[key] = value;
    return this;
  }

  addQuery(key: string, value: string): this {
    this.query[key] = value;
    return this;
  }
}

export default MockRequest;
