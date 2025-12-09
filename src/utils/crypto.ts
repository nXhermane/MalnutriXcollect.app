export function encode(data: string, secret: string) {
  // TODO:Implemente encoding logic here
  //   return Buffer.from(data);
  return data;
}

export function decode(data: string | Buffer<ArrayBuffer>, secret: string) {
  // TODO:Implemente deconding logic here
  return data.toString();
}
