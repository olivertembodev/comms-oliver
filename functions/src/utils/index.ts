/* eslint-disable array-callback-return */
interface MentionsType {
  displayName: string;
  userId: string;
  actionType?: string;
}

export const mentionsTextParser = (text: string) => {
  let message = text;

  const mentions: Array<MentionsType> = [];
  const mentionsRegEx = RegExp(/(@+[[a-z0-9\s]+\]\([a-z0-9_-]+\))/gi);
  const allMentions = [...message.matchAll(mentionsRegEx)];
  allMentions.map((mention) => {
    const displayName = mention[1].substring(
      mention[1].indexOf('[') + 1,
      mention[1].indexOf(']'),
    );
    const userId = mention[1].substring(
      mention[1].indexOf('(') + 1,
      mention[1].indexOf(')'),
    );
    if (mention[1].includes('@@')) {
      mentions.push({
        displayName,
        userId,
        actionType: 'response-requested',
      });
    }
  });
  return {
    mentions,
  };
};
