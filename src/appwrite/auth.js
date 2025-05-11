import conf from '../conf/conf';

export { ID, Client, Account } from 'appwrite';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                //call another method
                return this.login({ email, password });
            } else {
                return userAccount
            }

        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async login({ email, password }) {
        try{
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    // get current user
    async getCurrentError(){
        try{
            return await this.account.get();
        }
    catch(error){
        console.error('Error getting current user:', error);
        throw error;
    }
    return null;
    }

    // logout: delete session

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }
}
  
const authService = new AuthService();
export default authService;

