/* eslint-disable array-callback-return */
import * as functions from 'firebase-functions';
import { mentionsTextParser } from './utils';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.sendNotificationToUsers = functions.firestore
  .document(
    'channels/domain/{domainId}/{channelId}/posts/{postId}',
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
          async (user: { data: Function; id: string, }) => {
            const [notificationPreference] = await Promise.all([
              db.collection(`users/${user.id}/notifications`).doc(newValue.originalPost ? params.postId : newValue.postID).get(),
            ]);
            console.log(notificationPreference.data(), '<==notification data for', user.id);
            if (newValue.userId !== user.id) {
              const { mentions } = mentionsTextParser(newValue.body);
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
                time: newValue.time ?? admin.firestore.Timestamp.now(),
                message: newValue.body ?? 'Empty Message',
                user: newValue.user ?? { email: '', photoURL: '', name: '' },
                userId: newValue.userId ?? '',
                domain: params.domainId ?? '',
                channelName: newValue.channel ?? '',
                channel: params.channelId ?? '',
                messageId: params.messageId ?? '',
                post: newValue.originalPost ? params.postId : newValue.postID,
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
