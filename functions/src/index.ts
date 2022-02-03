import * as functions from 'firebase-functions';
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
          (user: { data: FunctionConstructor; id: string }) => {
            if (newValue.userId !== user.id) {
              const inboxRef = db.collection(`users/${user.id}/inbox`).doc();
              const notification = {
                time: newValue.time ?? db.FieldValue.serverTimestamp(),
                message: newValue.text ?? 'Empty Message',
                user: newValue.user ?? { email: '', photoURL: '', name: '' },
                userId: newValue.userId ?? '',
                domain: params.domainId ?? '',
                channel: params.channelId ?? '',
                messageId: params.messageId ?? '',
                post: params.postId ?? '',
                subject: newValue.subject ?? '',
                isNew: true,
                responseRequired: false,
                isDone: false,
              }
              writeBatch.create(inboxRef, notification);
            }
          },
        );
        writeBatch.commit().then(() => {
            console.log('Successfully sent notifications.');
        });
      });

  });
