const generatePolicy = (principalId, resource, effect = 'Deny') => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    }
}

const authorizer = async (event, ctx, cb) => {
    if (event["type"] != 'REQUEST') {
        cb('Unauthorized');
    }

    try {
        const { token: encodedCreds } = event.queryStringParameters;

        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const userName = plainCreds[0];
        const password = plainCreds[1];

        console.log(`Username: ${userName}, password: ${password}`);

        const storedUserPassword = process.env[userName];
        const effect = !storedUserPassword
            || storedUserPassword != password ? 'Deny' : 'Allow';

        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        cb(null, policy);
    } catch (e) {
        cb(`Unauthorized: ${e.message}`);
    }
};

module.exports = authorizer;