import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({ 

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  // jwt: {
  //   // true,
  //   signingKey: process.env.SIGNING_KEY,
  // },
  callbacks: {
    async signIn({user, account, profile}) {
      const { email } = user;
      // console.log(user);
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index("usersByEmail"),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'), 
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index("usersByEmail"),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch(err) {
        console.log(err)
        return false
      }
    },
  }
})