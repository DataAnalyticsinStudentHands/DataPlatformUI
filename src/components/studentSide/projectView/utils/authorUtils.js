/**
 * Returns true if the author has no avatar and no quote (just name + role).
 */
export function isMinimalAuthor(author) {
  return !author.avatarUrl && !author.avatarFile && !author.quote;
}

/**
 * Returns true if ALL authors in the array are minimal.
 */
export function allAuthorsMinimal(authors) {
  return authors.length > 0 && authors.every(isMinimalAuthor);
}
