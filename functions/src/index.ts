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
    const randomDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    await db
      .collection('users')
      .where('domain', '==', params.domainId)
      .get()
      .then(async (users: { docs: [] }) => {
        const usersBatch = users.docs.map(
          async (user: { data: Function; id: string, }) => {
            const notificationPreference = await db.collection(`users/${user.id}/notifications`).doc(newValue.originalPost ? params.postId : newValue.postID).get();
            randomDelay();
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
              if (notificationPreference?.data()?.status === 'all posts' || isMentioned || isReponseRequested) {
                writeBatch.create(inboxRef, notification);
              }
            }
          },
        );
        await Promise.all(usersBatch);
        writeBatch.commit().then(() => {
          console.log('Successfully sent notifications.');
        });
      });
  });
