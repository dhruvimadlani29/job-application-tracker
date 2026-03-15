// src/utils/auth.js
import { Amplify } from 'aws-amplify'

// Configure Amplify with your Cognito settings
export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId:       import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
        }
      }
    }
  })
}