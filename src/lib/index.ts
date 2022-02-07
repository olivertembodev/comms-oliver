/* eslint-disable array-callback-return */
export const mentionsTextParser = (text: string) => {
  let message = text;

  const mentionsRegEx = RegExp(/(@+[[a-z0-9\s]+\]\([a-z0-9_-]+\))/gi);
  const allMentions = [...message.matchAll(mentionsRegEx)];
  allMentions.map((mention) => {
    const displayName = mention[1].substring(
      mention[1].indexOf('[') + 1,
      mention[1].indexOf(']'),
    );
    message = message.replace(
      mention[1],
      `<span title='${
        mention[1].includes('@@')
          ? `Response Requested from ${displayName.split(' ')[0]}`
          : displayName
      }' class='mentioned-user ${
        mention[1].includes('@@') ? 'response-requested' : ''
      }'>${displayName.split(' ')[0]}</span>`,
    );
  });
  return {
    message,
  };
};

export const transformMentionDisplay = (id: string, display: string) => {
  return display.split(' ')[0];
}