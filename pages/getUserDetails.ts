import * as fs from 'fs';

export function getUserDetails() {
    const envContent = fs.readFileSync('.env', 'utf-8');
    const envVariables = envContent.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);

    return {
        email: envVariables['EMAIL'],
        password: envVariables['PASSWORD']
    };
}