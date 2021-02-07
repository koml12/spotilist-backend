class MockRequest {
  params: Record<string, string> = {};

  addParameter(key: string, value: string): this {
    this.params[key] = value;
    return this;
  }
}

export default MockRequest;
