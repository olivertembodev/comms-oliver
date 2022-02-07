/* eslint-disable array-callback-return */
import * as functions from 'firebase-functions';
import { mentionsTextParser } from './utils';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.sendNotificationToUsers = functions.firestore
  .document(
    'channels/domain/{domainId}/{channelId}/posts/{postId}/messages/{messageId}',
  )
  .onCreate(async (snap, context) => {
    const { params } = context;
    const newValue = snap.data();
    const writeBatch = db.batch();
    await db
      .collection('users')
      .where('domain', '==', params.domainId)
      .get()
      .then((users: { docs: [] }) => {
        users.docs.forEach(
          (user: { data: Function; id: string, }) => {
            if (newValue.userId !== user.id) {
              const { mentions } = mentionsTextParser(newValue.text);
              let isReponseRequested = false;
              let isMentioned = false;
              if (mentions?.length) {
                const notificationsForCurrentUsers = mentions.filter(
                  (mention) => mention.userId === user.id,
                );
                if (notificationsForCurrentUsers?.length) {
                  notificationsForCurrentUsers.map((mention) => {
                    if (mention.actionType === 'response-requested') {
                      isReponseRequested = true;
                    } else if (mention.actionType === 'mentioned') {
                      isMentioned = true;
                    }
                  });
                }
              }
              const inboxRef = db.collection(`users/${user.id}/inbox`).doc();
              const notification = {
                time: newValue.time ?? db.FieldValue.serverTimestamp(),
                message: newValue.text ?? 'Empty Message',
                user: newValue.user ?? { email: '', photoURL: '', name: '' },
                userId: newValue.userId ?? '',
                domain: params.domainId ?? '',
                channelName: newValue.channel ?? '',
                channel: params.channelId ?? '',
                messageId: params.messageId ?? '',
                post: params.postId ?? '',
                subject: newValue.subject ?? '',
                isNew: true,
                responseRequired: isReponseRequested,
                isDone: false,
                isMentioned: isMentioned,
              };
              if (user.data().notifications === 'all posts' || (isMentioned && user.data().notifications === 'only when mentioned') || isReponseRequested) {
                writeBatch.create(inboxRef, notification);
              }
            }
          },
        );
        writeBatch.commit().then(() => {
          console.log('Successfully sent notifications.');
        });
      });
  });
