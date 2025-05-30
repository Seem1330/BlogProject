import conf from '../conf/conf.js';
import { Client, Account,ID } from 'appwrite';

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
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    // get current user
    async getCurrentUser(){
        try{
            return await this.account.get();
        }
    catch(error){
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        throw error;
    }
    return null;
    }

    // logout: delete session

    async logout() {
         try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}
  
export const authService = new AuthService();
export default authService;

