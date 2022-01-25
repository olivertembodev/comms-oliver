import { doc } from 'firebase/firestore';
import { firestore } from 'lib/firebase';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function useSinglePost() {
  const params = useParams();
  const domain = params.domain;
  const channel = params.channel;
  const post = params.post;
  const ref = doc(
    firestore,
    `channels`,
    `domain`,
    `${domain.replace('@', '')}`,
    channel,
    'posts',
    post,
  );

  const [value, loading] = useDocumentData(ref);

  return {
    value,
    domain,
    channel,
    loading,
  };
}
