/* eslint-disable array-callback-return */
import {collection, doc, query, where, writeBatch, arrayUnion} from "firebase/firestore";
import {auth, firestore} from "lib/firebase";
import {useCollection} from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {useParams} from "react-router-dom";

export default function useUsers() {
    const [user] = useAuthState(auth);
    const params = useParams();
    const domain = params.domain;
    const channel = params.channel;
    const post = params.post;

    const users = query(collection(firestore, 'users'), where('domain', '==', user?.email?.split("@")[1] ?? 'null'));
    const [value,
        loading] = useCollection(users);
    const results = value
        ?.docs
            ?.map(doc => ({id: doc.id}))
    const sendNotification = async (subject : string, text : string) => {
        const notification = {
            user: {
                displayName: user.displayName,
                photoURL: user.photoURL
            },
            userId: user.uid,
            subject,
            message: text,
            post: post,
            channel: channel,
            domain
        };
        const notifyUsers = writeBatch(firestore);
        results.map((result) => {
            if (result.id !== user.uid) {
                const users_collection = doc(firestore, 'users', result.id, 'inbox', result.id);
                notifyUsers.update(users_collection, {
                    messages: arrayUnion(notification),
                });
            }
        })
        await notifyUsers.commit();
    }

    return {
        loading,
        sendNotification,
        users: results || []
    }
}