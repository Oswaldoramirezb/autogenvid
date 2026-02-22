/**
 * Configuración de AWS Amplify para Cognito.
 * Los valores se leen de las variables de entorno VITE_.
 */
const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXX',
            userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXX',
            loginWith: {
                oauth: {
                    domain: import.meta.env.VITE_COGNITO_DOMAIN || 'videobot-ai.auth.us-east-1.amazoncognito.com',
                    scopes: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
                    redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT_URI || 'http://localhost:5173'],
                    redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT_URI || 'http://localhost:5173'],
                    responseType: 'code',
                },
            },
        },
    },
};

export default amplifyConfig;
