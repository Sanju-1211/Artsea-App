export function getAvatarUri(uri, object) {
  if (uri !== "") {
    return uri;
  } else {
    return `https://robohash.org/${object.username}?set=set5`;
  }
}
