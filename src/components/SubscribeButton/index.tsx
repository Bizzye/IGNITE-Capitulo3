import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const router = useRouter();
  const { data } = useSession();

  async function handleSubscribe() {
    if (!data) {
      signIn("github");
      return;
    }

    if (data.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe?.redirectToCheckout({sessionId: sessionId})
    } catch(err) {
      alert(err);
      console.log(err);
    }
  }

  return (
    <button 
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe now
    </button>
  )
}