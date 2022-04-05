import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {

  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('usersByCustomerId'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,  
  }

  if(createAction) {
    await fauna.query(
      q.If(
        q.Not(
          q.Exists(
            q.Match(
              q.Index("subscriptionById"),
              subscriptionId
            )
          )
        ),
        q.Create(
          q.Collection("subscriptions"),
          { data: subscriptionData }
        ),
        q.Get(
          q.Match(
            q.Index("subscriptionById"),
            subscriptionId
          )
        )
      )
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscriptionById"),
              subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}