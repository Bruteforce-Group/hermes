export default function parseNameFromEmail(email?: string): string | undefined {
  const beforeDomainValue = email?.split("@")[0];

  if (beforeDomainValue) {
    // names can come in all sorts of formats.
    // we want to convert dots, underscores and plusses.
    // we also want to capitalize the first letter of each word.

    // split the string into an array of words
    const words = beforeDomainValue.split(/[\.\_]/);

    // capitalize the first letter of each word
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // join the words back together
    const name = capitalizedWords.join(" ");

    return name;
  }

  return email;
}
