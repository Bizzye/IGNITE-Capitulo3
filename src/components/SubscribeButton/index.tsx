import { useSession, signIn } from 'next-auth/react';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

  const user = useSession();

  function handleSubscribe() {
    console.log(user)
    if (!user) {
      signIn("github");
      return;
    }


  }

  return (
    <button 
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  )
}