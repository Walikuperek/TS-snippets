type Endpoint = {
  path: string;
};

// Immutable array like structure
class Endpoints extends Array<Endpoint> {
  constructor(...args: any[]) {
    super(...args.map(e => Object.assign({}, e)));
  }

  override push(...args: any[]) {
    console.log("pushed", ...args);
    return super.push(Object.assign({}, ...args));
  }
}

const e: Endpoint = {path: '/'}
const endpoints = new Endpoints(e)
e.path = '/blog'
endpoints.push(e)
e.path = '/blog/:id' // endpoints elements are immutable - this line won't affect any element
console.log(endpoints) // then enpoints will show [{"path": "/"}, {"path": "/blog"}]
